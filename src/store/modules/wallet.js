import { ethers } from 'ethers';
const namespaced = true;

const state = {
  provider: null,
  web3Provider: null,
  signer: null,
  account: '0x',
  chainId: 0,

  walletIcon: '',
  walletLabel: ''
};

const getters = {};

const mutations = {
  setChainId(state, chainId) {
    state.chainId = chainId;
  },
  setAccount(state, account) {
    state.account = account;
  },
  setProvider(state, provider) {
    state.provider = provider;
  },
  setWeb3Provider(state, web3Provider) {
    state.web3Provider = web3Provider;
  },
  setSigner(state, signer) {
    state.signer = signer;
  },
  clearWalletInfo(state) {
    state.provider = null;
    state.web3Provider = null;
    state.signer = null;
    state.account = '0x';
    state.chainId = 0;
  },

  setWalletIcon(state, icon) {
    state.walletIcon = icon;
  },
  setWalletLabel(state, label) {
    state.walletLabel = label;
  }
};

const actions = {
  actionWalletInfo({ rootState, state, commit, dispatch }, { account, chainId, provider, icon, label }) {
    if (account) {
      commit('setAccount', account);
    }

    if (chainId) {
      commit('setChainId', chainId);
    }

    if (provider) {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();

      commit('setProvider', provider);
      commit('setWeb3Provider', web3Provider);
      commit('setSigner', signer);
    }
    if (icon) {
      commit('setWalletIcon', icon);
    }

    if (label) {
      commit('setWalletLabel', label);
    }
  }
};

export const wallet = { namespaced, state, getters, mutations, actions };
