<template>
  <div id="app">
    <WalletBoard :chains="computedChains" @wallets="getWallets" @disconnected="disconnected" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import WalletBoard from '@/WalletBoard';
import ChainList from '@/config.json';
export default {
  name: 'App',
  components: {
    WalletBoard,
  },
  data() {
    return {
      isSelecting: true,
    };
  },
  computed: {
    computedChains() {
      return ChainList.map((net) => {
        return {
          id: `0x${Number(net.chainId).toString(16)}`,
          token: net.symbol,
          label: net.name,
          rpcUrl: net.rpcUrl,
          publicRpcUrl: net.rpcUrl,
          blockExplorerUrl: net.blockExplorer,
        };
      });
    },
  },
  watch: {
    chainId(newChainId) {
      if (newChainId) {
        console.log('newChainId: ', newChainId);
        // this.watchERC20()
      }
    },
  },
  methods: {
    ...mapActions({
      initWallet: 'wallet/actionWalletInfo',
      watchERC20: 'watchBalance/watchERC20',
    }),
    ...mapMutations({
      clearWalletInfo: 'wallet/clearWalletInfo',
    }),
    disconnected() {
      this.isSelecting = true;
      this.clearWalletInfo();
    },
    getWallets(wallets) {
      const { accounts, chains, provider, icon, label } = wallets[0];
      console.log('provider type: ', provider, typeof provider);
      this.isSelecting = false;

      this.initWallet({ account: accounts[0].address, chainId: Number(chains[0].id), provider, icon, label });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: auto;
}
.renderLoading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
