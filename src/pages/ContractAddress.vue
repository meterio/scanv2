<template lang="pug">
.detail-page
  data-summary(
    :logoURI="logoURI"
    :title='title',
    :titleValue="address",
    :titleCopyable="true"
    :data='addressInfo.summary',
    wide,
    isContract,
    :verified='verified',
    :verifiedDesc='verifiedDesc',
    :verifiedFrom='verifiedFrom',
    :deployStatus='deployStatus'
  )

  b-container.summary.px-0
    data-table-v3.mt-1pert.px-0(
      :isTableData='isTableData',
      :loadItems='loadItems',
      :fields='fields',
      :pagination='pagination',
      :key='loadTarget'
    )
      div(slot='header')
        nav-tabs.px-0(:tabs='tabs', :value='tabValue', :verified='verified', @changeTab='navTabChange', @download="downloadTxs")
      div(slot='otherData')
        <div class="loading" v-if="filesLoading">
          <div class="text-center text-primary my-2">
            b-spinner.align-middle.mr-2(small, type="grow" )
            strong Loading...
          </div>
        </div>
        contract-detail(v-else, :verified='verified',
          :files='files',
          :impl-files='implFiles',
          :proxy-contract="addressInfo.proxyContract",
          :address='addressInfo.address',
          :deploy-status="deployStatus")
</template>

<script>
import DataTableV3 from '@/components/DataTableV3.vue';
import NavTabs from '@/components/NavTabs.vue';
import DataSummary from '@/components/DataSummary.vue';
import ContractDetail from './ContractDetail.vue';
import Loading from '@/components/Loading.vue';
export default {
  name: 'ContractAddress',
  components: {
    DataTableV3,
    NavTabs,
    DataSummary,
    ContractDetail,
    Loading,
  },
  props: {
    addressInfo: {
      type: Object,
      default() {
        return {
          isContract: true,
          tokenType: '',
          address: '0x',
          summary: [],
          contractDataCount: {
            isProxy: false,
            proxyType: '',
            implAddr: '',
            prevImplAddr: '',
            adminAddr: '',
          },
        };
      },
    },
    contractDataCount: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isToken() {
      if (['ERC20', 'ERC721', 'ERC1155'].includes(this.addressInfo.tokenType)) {
        return true;
      }
      return false;
    },
    isERC20() {
      return this.addressInfo.tokenType === 'ERC20';
    },
    address() {
      return this.addressInfo.address;
    },
    verified() {
      return this.addressInfo.verified;
    },
    verifiedDesc() {
      return this.addressInfo.verifiedDesc;
    },
    verifiedFrom() {
      return this.addressInfo.verifiedFrom;
    },
    deployStatus() {
      return this.addressInfo.deployStatus;
    },
    title() {
      if (this.isToken) {
        return 'Token';
      } else {
        return 'Contract';
      }
    },
    logoURI() {
      return this.addressInfo.logoURI;
    },
    tabs() {
      if (this.isToken) {
        return [
          {
            name:
              this.contractDataCount.transfersCount > 0
                ? `Transfers(${this.contractDataCount.transfersCount})`
                : 'Transfers',
            download: true,
          },
          {
            name: this.contractDataCount.txCount > 0 ? `Txs(${this.contractDataCount.txCount})` : 'Txs',
            download: true,
          },
          {
            name:
              this.contractDataCount.internalTxCount > 0
                ? `Internal Txs(${this.contractDataCount.internalTxCount})`
                : 'Internal Txs',
          },
          {
            name:
              this.contractDataCount.holdersCount > 0 ? `Holders(${this.contractDataCount.holdersCount})` : 'Holders',
          },
          {
            name:
              this.contractDataCount.erc20TokenCount > 0
                ? `ERC20s(${this.contractDataCount.erc20TokenCount})`
                : 'ERC20s',
          },
          { name: 'Contract' },
          { name: this.contractDataCount.eventsCount > 0 ? `Events(${this.contractDataCount.eventsCount})` : 'Events' },
          {
            name: this.contractDataCount.bucketCount > 0 ? `Buckets(${this.contractDataCount.bucketCount})` : 'Buckets',
          },
        ];
      }
      return [
        {
          name: this.contractDataCount.txCount > 0 ? `Txs(${this.contractDataCount.txCount})` : 'Txs',
        },
        {
          name:
            this.contractDataCount.internalTxCount > 0
              ? `Internal Txs(${this.contractDataCount.internalTxCount})`
              : 'Internal Txs',
        },
        {
          name:
            this.contractDataCount.erc20TxCount > 0 ? `ERC20 Txs(${this.contractDataCount.erc20TxCount})` : 'ERC20 Txs',
          download: 'download',
        },
        {
          name:
            this.contractDataCount.erc20TokenCount > 0
              ? `ERC20 Tokens(${this.contractDataCount.erc20TokenCount})`
              : 'ERC20 Tokens',
        },
        { name: 'Contract' },
        { name: this.contractDataCount.eventsCount > 0 ? `Events(${this.contractDataCount.eventsCount})` : 'Events' },
        { name: this.contractDataCount.bucketCount > 0 ? `Buckets(${this.contractDataCount.bucketCount})` : 'Buckets' },
      ];
    },
    fields() {
      if (this.isERC20) {
        switch (this.loadTarget) {
          case 'transfers':
            return this.transfers.fields;
          case 'txs':
            return this.txs.fields;
          case 'internaltxs':
            return this.internaltxs.fields;
          case 'holders':
            return this.holders.fields;
          case 'erc20Tokens':
            return this.erc20Tokens.fields;
          case 'events':
            return this.events.fields;
          case 'buckets':
            return this.buckets.fields;
        }
        return this.transfers.fields;
      } else {
        switch (this.loadTarget) {
          case 'transfers':
            return this.transfers.fields2;
          case 'txs':
            return this.txs.fields;
          case 'internaltxs':
            return this.internaltxs.fields;
          case 'erc20Txs':
            return this.erc20txs.fields;
          case 'holders':
            return this.holders.fields2;
          case 'erc20Tokens':
            return this.erc20Tokens.fields;
          case 'events':
            return this.events.fields;
          case 'buckets':
            return this.buckets.fields;
        }
        return this.txs.fields;
      }
    },
    pagination() {
      switch (this.loadTarget) {
        case 'txs':
          return this.txs.pagination;
        case 'internaltxs':
          return this.internaltxs.pagination;
        case 'transfers':
          return this.transfers.pagination;
        case 'holders':
          return this.holders.pagination;
        case 'erc20Tokens':
          return this.erc20Tokens.pagination;
        case 'events':
          return this.events.pagination;
        case 'buckets':
          return this.buckets.pagination;
      }
      return this.transfers.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        case 'txs':
          return this.loadTxs;
        case 'internaltxs':
          return this.loadInternalTxs;
        case 'transfers':
          return this.loadTransfers;
        case 'holders':
          return this.loadHolders;
        case 'erc20Tokens':
          return this.loadErc20Tokens;
        case 'events':
          return this.loadEvents;
        case 'erc20Txs':
          return this.loadTxs20;
        case 'buckets':
          return this.loadBuckets;
      }
      return this.loadTransfers;
    },
    isTableData() {
      if (this.loadTarget === 'contract') {
        return false;
      }

      return true;
    },
  },
  data() {
    return {
      filesLoading: false,
      files: [],
      implFiles: [],
      tabValue: 0,
      loadTarget: 'transfers',
      holders: {
        pagination: { show: true, align: 'center', perPage: 25 },
        fields: [
          { key: 'rank', label: 'Rank' },
          { key: 'fullAddress', label: 'Address' },
          { key: 'balance', label: 'Balance' },
        ],
        fields2: [
          // { key: 'rank', label: 'Rank' },
          { key: 'fullAddress', label: 'Address' },
          { key: 'nftTokens', label: 'Token ID' },
        ],
      },
      txs: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 25,
        },
        fields: [
          { key: 'txhashWithStatus', label: 'Hash' },
          { key: 'methodName', label: 'Method' },
          { key: 'blocknum', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'direct', label: '' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount' },
          { key: 'fee', label: 'Fee' },
        ],
        items: [],
      },
      internaltxs: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 25,
        },
        fields: [
          { key: 'txhashWithStatus', label: 'Parent Tx Hash' },
          { key: 'methodName', label: 'Method' },
          { key: 'blocknum', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'direct', label: '' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount' },
        ],
        items: [],
      },
      events: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 25,
        },
        fields: [
          { key: 'txInfo', label: 'Tx Hash' },
          { key: 'method', label: 'Method' },
          { key: 'event', label: 'Logs' },
        ],
        items: [],
      },
      transfers: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 25,
        },
        fields: [
          { key: 'txhashWithStatus', label: 'Hash' },
          { key: 'blocknum', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount' },
        ],
        fields2: [
          { key: 'txhashWithStatus', label: 'Hash' },
          { key: 'blocknum', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'nft', label: 'Token ID' },
        ],
        items: [],
      },
      erc20Tokens: {
        pagination: { show: true, align: 'center', perPage: 25 },
        fields: [
          { key: 'tokenType', label: 'Type' },
          { key: 'fullAddress', label: 'Token Address' },
          { key: 'balance', label: 'Balance' },
          { key: 'blocknum', label: 'Last Updated on Block' },
        ],
      },
      erc20txs: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 25,
          limit: 10,
        },
        fields: [
          { key: 'txhashWithStatus', label: 'Hash' },
          { key: 'blocknum', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'direct', label: '' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount' },
          { key: 'fee', label: 'Fee' },
        ],
        items: [],
      },
      buckets: {
        pagination: { show: true, align: 'center', perPage: 25 },
        fields: [
          { key: 'bucketid', label: 'ID' },
          { key: 'address', label: 'Candidate Address' },
          { key: 'totalVotes', label: 'Votes' },
          { key: 'timestamp', label: 'Time' },
          { key: 'status', label: 'Status' },
        ],
      },
    };
  },
  watch: {
    address() {
      this.getContractFiles();
    },
    addressInfo(val) {
      this.getImplContractFiles();
    },
  },
  created() {
    this.getLoadTarget();
    this.getContractFiles();
    this.getImplContractFiles();
  },
  methods: {
    async downloadTxs(tabIndex) {
      if (tabIndex == 0) {
        this.$router.push({
          name: 'exportData',
          params: {
            address: this.address,
            type: 'transfers',
          },
        });
      }
      if (tabIndex == 1) {
        this.$router.push({
          name: 'exportData',
          params: {
            address: this.address,
            type: 'txs',
          },
        });
      }
      if (tabIndex == 2) {
        this.$router.push({
          name: 'exportData',
          params: {
            address: this.address,
            type: 'erc20Txs',
          },
        });
      }
    },
    async getContractFiles() {
      this.filesLoading = true;
      const { files } = await this.$api.contract.getContractFiles(this.network, this.address);
      this.files = files;

      this.filesLoading = false;
    },
    async getImplContractFiles() {
      if (this.addressInfo.proxyContract.isProxy) {
        const { files } = await this.$api.contract.getContractFiles(
          this.network,
          this.addressInfo.proxyContract.implAddr
        );
        this.implFiles = files;
      }
    },
    navTabChange(val) {
      this.tabValue = val;

      this.getLoadTarget(val);
    },
    getLoadTarget(val) {
      if (this.isToken) {
        switch (val) {
          case 0:
            this.loadTarget = 'transfers';
            break;
          case 1:
            this.loadTarget = 'txs';
            break;
          case 2:
            this.loadTarget = 'internaltxs';
            break;
          case 3:
            this.loadTarget = 'holders';
            break;
          case 4:
            this.loadTarget = 'erc20Tokens';
            break;
          case 5:
            this.loadTarget = 'contract';
            break;
          case 6:
            this.loadTarget = 'events';
            break;
          case 7:
            this.loadTarget = 'buckets';
            break;
          default:
            this.loadTarget = 'transfers';
        }
      } else {
        switch (val) {
          case 0:
            this.loadTarget = 'txs';
            break;
          case 1:
            this.loadTarget = 'internaltxs';
            break;
          case 2:
            this.loadTarget = 'erc20Txs';
            break;
          case 3:
            this.loadTarget = 'erc20Tokens';
            break;
          case 4:
            this.loadTarget = 'contract';
            break;
          case 5:
            this.loadTarget = 'events';
            break;
          case 6:
            this.loadTarget = 'buckets';
            break;
          default:
            this.loadTarget = 'txs';
        }
      }
    },
    async loadBuckets(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getBuckets(network, address, page, limit);
      const { buckets, totalRows } = res;
      const items = buckets.map((b) => {
        return {
          bucketid: b.id,
          address: b.candidate,
          totalVotes: {
            type: 'amount',
            amount: b.totalVotes,
            precision: 6,
            token: this.currentChain.gSymbol,
          },
          timestamp: b.createTime,
          status: b.unbounded ? 'Unbounded' : 'Created',
        };
      });
      return { items, totalRows };
    },
    async loadTxs20(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs20(network, address, page, limit);
      const { txs, totalRows } = res;
      const items = txs.map((t) => ({
        txhashWithStatus: {
          hash: t.txHash,
          status: false,
        },
        blocknum: t.block.number,
        from: {
          address: t.from,
          isContract: t.fromIsContract,
        },
        to: {
          address: t.to,
          isContract: t.toIsContract,
        },
        direct: t.from === this.address ? 'Out' : 'In',
        amount: {
          type: 'amount',
          amount: t.amount,
          token: t.symbol || 'ERC20',
          precision: 8,
          decimals: t.decimals || 18,
          address: t.tokenAddress,
        },
        fee: {
          type: 'amount',
          amount: t.fee,
          token: 'MTR',
          precision: -1,
        },
        timestamp: t.block.timestamp,
      }));
      return { items, totalRows };
    },
    async loadErc20Tokens(network, page, limit) {
      this.load = true;
      const { address } = this.$route.params;
      const { tokens, totalRows } = await this.$api.account.getErc20Tokens(network, address, page, limit);
      const items = [];
      for (const t of tokens) {
        items.push({
          ...t,
          fullAddress: t.tokenAddress,
          blocknum: t.lastUpdate.number,
          balance: {
            type: 'amount',
            amount: t.balance,
            token: t.tokenSymbol,
            precision: 8,
            decimals: t.tokenDecimals,
          },
        });
      }
      return { items, totalRows };
    },
    async loadHolders(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getHolders(network, address, page, limit);
      const { holders, token, totalRows } = res;
      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;
      const items = holders.map((h, index) => {
        const res = {
          ...h,
          rank: index + 1 + (pageNum - 1) * limitNum,
          fullAddress: h.address || h.owner,
        };

        if (this.isERC20) {
          res.balance = {
            type: 'amount',
            amount: h.balance,
            precision: 6,
            decimals: token.decimals || 18,
            token: token.symbol,
          };
        } else {
          res.nftTokens = h.tokens.map((t) => ({ ...t, address: token.address }));
        }

        return res;
      });
      return { items, totalRows };
    },
    async loadEvents(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getEvents(network, address, page, limit);
      const { rows, totalRows } = res;
      const items = rows.map((r, index) => {
        let res = {
          txInfo: {
            txHash: r.txHash,
            block: r.block,
          },
          method: r.method,
          event: {
            name: r.name,
            abi: r.abi,
            address: r.address,
            topics: r.topics,
            data: r.data,
            datas: r.datas,
            abi: r.abi,
          },
          decoded: r.decoded,
        };
        return res;
      });
      return { items, totalRows };
    },
    async loadTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txs, totalRows } = res;
      const items = txs.map((t) => {
        let direct = '';
        const fromAddr = t.from;
        const toAddr = t.to;
        let amount = t.mtr;

        let token = this.currentChain.symbol;
        if (t.mtrg !== '0') {
          amount = t.mtrg;
          token = this.currentChain.gSymbol;
        }

        if (fromAddr === toAddr) {
          direct = 'Self';
        } else if (fromAddr === address.toLowerCase()) {
          direct = 'Out';
        } else {
          direct = 'In';
        }
        let fee = t.fee;

        return {
          txhashWithStatus: {
            hash: t.txHash,
            status: t.reverted,
          },
          methodName: t.method,
          blocknum: t.block.number,
          from: {
            address: fromAddr,
            isContract: t.fromIsContract,
          },
          direct,
          to: {
            address: toAddr || 'nobody',
            isContract: t.toIsContract,
          },
          amount: {
            type: 'amount',
            amount: amount,
            token: token,
            precision: 8,
          },
          fee: {
            type: 'amount',
            amount: fee,
            token: 'MTR',
            precision: -1,
          },
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    },
    async loadInternalTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getInternalTxs(network, address, page, limit);
      const { rows, totalRows } = res;
      const items = rows.map((t) => {
        let direct = '';
        const fromAddr = t.from;
        const toAddr = t.to;
        let amount = t.value;

        let token = this.currentChain.symbol;

        if (fromAddr === toAddr) {
          direct = 'Self';
        } else if (fromAddr === address.toLowerCase()) {
          direct = 'Out';
        } else {
          direct = 'In';
        }

        return {
          txhashWithStatus: {
            hash: t.txHash,
            status: t.reverted,
          },
          methodName: t.method,
          blocknum: t.block.number,
          from: {
            address: fromAddr,
            isContract: t.fromIsContract,
          },
          direct,
          to: {
            address: toAddr || 'nobody',
            isContract: t.toIsContract,
          },
          amount: {
            type: 'amount',
            amount: amount,
            token: token,
            precision: 8,
          },
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    },
    async loadTransfers(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTransfers(network, address, page, limit);
      const { transfers, totalRows, contract } = res;
      const items = transfers.map((t) => {
        const res = {
          txhashWithStatus: {
            hash: t.txHash,
            status: false,
          },
          methodName: t.method,
          blocknum: t.block.number,
          from: {
            address: t.from,
            isContract: t.fromIsContract,
          },
          to: {
            address: t.to,
            isContract: t.toIsContract,
          },
          timestamp: t.block.timestamp,
        };
        if (this.isERC20) {
          res.amount = {
            type: 'amount',
            amount: t.amount,
            token: contract.symbol,
            decimals: contract.decimals,
            precision: 8,
          };
        } else {
          res.nft = {
            address: t.tokenAddress,
            nftBalances: t.nftTransfers,
          };
        }
        return res;
      });
      return { items, totalRows };
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }

  .mt-2pert {
    margin-top: 2.6%;
  }

  .loading {
    opacity: 0.55;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
