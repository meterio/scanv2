<template lang="pug">
  div
    .text-center.text-primary(v-if="isContract === null")
      b-spinner.my-5
    ContractAddress(v-else-if="isContract" :address-info="addressInfo")
    UserAddress(v-else  :address-info="addressInfo")
</template>

<script>
import UserAddress from "./UserAddress.vue";
import ContractAddress from "./ContractAddress.vue";
export default {
  name: "Address",
  components: {
    UserAddress,
    ContractAddress
  },
  data() {
    return {
      isContract: true,
      isERC20: false,
      address: "0x",
      account: {},
      summary: []
    };
  },
  computed: {
    addressInfo() {
      return {
        isContract: this.isContract,
        isERC20: this.isERC20,
        address: this.address,
        summary: this.summary
      }
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

        const res = await this.$api.account.getAccountDetail(
          this.network,
          address
        );
        console.log("res: ", res)

        const { account } = res;
        // this.isContract = !!account.isContract;
        this.isERC20 = !!account.isERC20;
        if (this.address === "0x0000000000000000000000000000000000000000") {
          if (new BigNumber(account.mtrgBalance).isLessThan(0)) {
            account.mtrgBalance = "0";
          }
          if (new BigNumber(account.mtrgBounded).isLessThan(0)) {
            account.mtrgBounded = "0";
          }
          if (new BigNumber(account.mtrBalance).isLessThan(0)) {
            account.mtrBalance = "0";
          }
          if (new BigNumber(account.mtrBounded).isLessThan(0)) {
            account.mtrBounded = "0";
          }
        }
        this.summary = this.summary.concat([
          // { key: "Address", value: account.address },
          {
            key: "MTRG Balance",
            value: account.mtrgBalance,
            type: "amount",
            token: "MTRG",
            precision: -1,
          },
          {
            key: "MTRG Staked",
            value: account.mtrgBounded,
            type: "amount",
            token: "MTRG",
            precision: -1,
          },
          {
            key: "MTR Balance",
            value: account.mtrBalance,
            type: "amount",
            token: "MTR",
            precision: -1,
          },
        ]);
        // if (account.name) {
        //   this.summary.push({ key: "Name", value: account.name });
        // }
        if (account.firstSeen && account.firstSeen.number > 0) {
          this.summary.push({
            key: "First Seen",
            type: "block-link-with-note",
            value: this.fromNow(account.firstSeen.timestamp),
            block: account.firstSeen.number,
          });
        }
        if (account.lastUpdate && account.lastUpdate.number > 0) {
          this.summary.push({
            key: "Last Updated",
            type: "block-link-with-note",
            value: this.fromNow(account.lastUpdate.timestamp),
            block: account.lastUpdate.number,
          });
        }
        if (account.hasCode) {
          this.summary.push({ key: "Type", value: "Contract" });
        }
        if (account.isERC20) {
          this.summary.push({
            key: "ERC20 Token",
            value: `${account.tokenName || "Unnamed Token"} (${
              account.tokenSymbol || "ERC20"
            })`,
          });
          this.summary.push({
            key: "Decimals",
            value: account.tokenDecimals || 18,
          });
          if (account.circulation) {
            this.summary.push({
              key: "Circulation",
              type: "amount",
              value: account.circulation,
              token: account.tokenSymbol,
              decimals: account.tokenDecimals,
            });
          }
          if (account.holdersCount) {
            this.summary.push({
              key: "Holders Count",
              value: account.holdersCount,
            });
          }
        }
        this.account = account;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
