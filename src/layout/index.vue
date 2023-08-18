<template>
  <div id="app">
    <main class="main-container">
      <!-- top nav -->
      <TopNav></TopNav>

      <!-- router content -->
      <router-view></router-view>
    </main>

    <!-- footer -->
    <Footer></Footer>

    <WalletBoard :chains="computedChains" @wallets="getWallets" @disconnected="disconnected" />
  </div>
</template>

<script>
import Footer from './Footer.vue';
import TopNav from './TopNav';
import WalletBoard from '@/WalletBoard';
import ChainList from '@/config.json';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'AppLayout',
  components: {
    TopNav,
    Footer,
    WalletBoard
  },
  computed: {
    computedChains() {
      return ChainList.map(net => {
        return {
          id: `0x${Number(net.chainId).toString(16)}`,
          token: net.symbol,
          label: net.name,
          rpcUrl: net.rpcUrl,
          publicRpcUrl: net.rpcUrl,
          blockExplorerUrl: net.blockExplorer
        };
      });
    }
  },
  methods: {
    ...mapActions({
      initWallet: 'wallet/actionWalletInfo'
    }),
    ...mapMutations({
      clearWalletInfo: 'wallet/clearWalletInfo'
    }),
    disconnected() {
      this.clearWalletInfo();
    },
    getWallets(wallets) {
      const { accounts, chains, provider, icon, label } = wallets[0];
      console.log('provider type: ', typeof provider);

      this.initWallet({ account: accounts[0].address, chainId: Number(chains[0].id), provider, icon, label });
    }
  }
};
</script>
