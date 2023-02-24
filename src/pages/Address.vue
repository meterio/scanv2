<template lang="pug">
div
  .text-center.text-primary(v-if='isContract === null')
    b-spinner.my-5
  ContractAddress(v-else-if='isContract', :address-info='addressInfo', :contract-data-count='contractDataCount')
  UserAddress(v-else, :address-info='addressInfo', :user-data-count='userDataCount')
</template>

<script>
import UserAddress from './UserAddress.vue';
import ContractAddress from './ContractAddress.vue';
export default {
  name: 'Address',
  components: {
    UserAddress,
    ContractAddress
  },
  data() {
    return {
      isContract: null,
      tokenType: '',
      address: '0x',
      account: {},
      summary: [],
      verified: false, // only for contract
      verifiedDesc: '', // only for contract
      verifiedFrom: '', // only for contract
      deployStatus: '',
      contractDataCount: {
        txCount: 0,
        transfersCount: 0,
        holdersCount: 0,
        internalTxCount: 0
      },
      userDataCount: {
        txCount: 0,
        tokenCount: 0,
        erc20TxCount: 0,
        erc721TxCount: 0,
        bidCount: 0,
        proposedCount: 0,
        bucketCount: 0
      },
      proxyContract: {
        isProxy: false,
        proxyType: '',
        implAddr: '',
        prevImplAddr: '',
        adminAddr: ''
      },
      logoURI: '',
    };
  },
  computed: {
    addressInfo() {
      return {
        isContract: this.isContract,
        tokenType: this.tokenType,
        address: this.address,
        summary: this.summary,
        logoURI: this.logoURI,
        verified: this.verified,
        verifiedDesc: this.verifiedDesc,
        deployStatus: this.deployStatus,
        verifiedFrom: this.verifiedFrom,
        proxyContract: this.proxyContract,
      };
    }
  },
  methods: {
    init() {
      this.loadAddress();
    },
    async loadAddress() {
      try {
        const { address } = this.$route.params;
        this.address = address;
        this.summary = [];

        const res = await this.$api.account.getAccountDetail(this.network, address);

        console.log('res', res)

        const { account } = res;
        this.isContract = account.type !== undefined;
        this.tokenType = account.type;
        this.logoURI = account.logoURI || '';
        if (this.address === '0x0000000000000000000000000000000000000000') {
          if (new BigNumber(account.mtrgBalance).isLessThan(0)) {
            account.mtrgBalance = '0';
          }
          if (new BigNumber(account.mtrgBounded).isLessThan(0)) {
            account.mtrgBounded = '0';
          }
          if (new BigNumber(account.mtrBalance).isLessThan(0)) {
            account.mtrBalance = '0';
          }
          if (new BigNumber(account.mtrBounded).isLessThan(0)) {
            account.mtrBounded = '0';
          }
        }
        this.summary = this.summary.concat([
          // { key: 'Address', value: account.address, type: 'copyable' },
          {
            key: 'Balance',
            mtrg: account.mtrgBalance,
            mtr: account.mtrBalance,
            mtrToken: this.currentChain.symbol,
            mtrgToken: this.currentChain.gSymbol,
            type: 'balance',
            precision: -1
          },
          {
            key: 'Staked',
            value: account.mtrgBounded,
            type: 'amount',
            token: this.currentChain.gSymbol,
            precision: -1
          }
        ]);
        if (account.name) {
          this.summary.push({ key: 'Name', value: account.name });
        }
        if (account.firstSeen && account.firstSeen.number > 0) {
          this.summary.push({
            key: 'First Seen',
            type: 'block-link-with-time',
            value: account.firstSeen.timestamp,
            block: account.firstSeen.number
          });
        }
        if (account.lastUpdate && account.lastUpdate.number > 0) {
          this.summary.push({
            key: 'Last Updated',
            type: 'block-link-with-time',
            value: account.lastUpdate.timestamp,
            block: account.lastUpdate.number
          });
        }
        if (account.hasCode) {
          this.summary.push({ key: 'Type', value: 'Contract' });
        }
        if (account.tokenName && account.tokenSymbol) {
          this.summary.push({
            key: `${this.tokenType} Token`,
            value: `${account.tokenName || 'Unnamed Token'} (${account.tokenSymbol || 'ERC20'})`
          });
        }
        if (account.tokenSymbol && account.type === 'ERC20') {
          this.summary.push({
            key: 'Decimals',
            value: account.tokenDecimals || 18
          });
        }
        if (account.totalSupply && account.type === 'ERC20') {
          if (account.totalSupply) {
            this.summary.push({
              key: 'Total Supply',
              type: 'amount',
              value: account.totalSupply,
              token: account.tokenSymbol,
              decimals: account.tokenDecimals
            });
          }
        }
        if (account.holdersCount) {
          this.summary.push({
            key: 'Holders',
            type: 'holders',
            value: account.holdersCount
          });
        }

        if (account.transfersCount) {
          this.summary.push({
            key: 'Transfers',
            type: 'transfers',
            value: account.transfersCount
          });
        }

        if (this.isContract) {
          this.verified = account.verified;
          this.verifiedDesc = account.status;
          this.verifiedFrom = account.verifiedFrom;
          this.deployStatus = account.deployStatus ? account.deployStatus : '';
          this.summary.push({
            key: 'owner',
            value: account.master
          });
          this.summary.push({
            key: 'creationTxHash',
            value: account.creationTxHash
          });
          this.contractDataCount = {
            txCount: account.txCount,
            transfersCount: account.transfersCount,
            holdersCount: account.holdersCount,
            erc20TxCount: account.erc20TxCount,
            erc20TokenCount: account.erc20TokenCount,
            internalTxCount: account.internalTxCount,
            eventsCount: account.eventsCount
          };
        } else {
          this.userDataCount = {
            txCount: account.txCount,
            erc20TokenCount: account.erc20TokenCount,
            nftTokenCount: account.nftTokenCount,
            erc20TxCount: account.erc20TxCount,
            nftTxCount: account.nftTxCount,
            bidCount: account.bidCount,
            proposedCount: account.proposedCount,
            bucketCount: account.bucketCount,
            eventsCount: account.eventsCount
          };
        }

        if (account.isProxy) {
          this.proxyContract = {
            isProxy: account.isProxy,
            proxyType: account.proxyType,
            implAddr: account.implAddr,
            prevImplAddr: account.prevImplAddr,
            adminAddr: account.adminAddr
          }
        } else {
          this.proxyContract.isProxy = false
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
