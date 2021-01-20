export default {
  state: {
    network: "main"
  },

  mutations: {
    SET_NETWORK(state, network) {
      state.network = network;
    }
  },
  
  actions:{
    changeNetwork ({ commit }, network) {
      return commit('SET_NETWORK', network);
    }
  }
};
