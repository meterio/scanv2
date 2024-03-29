const { VUE_APP_CHAIN_ID } = process.env;
/**
 * anything that relates to DOM
 */
export default {
  namespaced: true,
  state: {
    windowWidth: 0,
    /**
     * breakpoint constants
     */
    widthExtraSmall: 320,
    widthSmall: 640,
    widthTablet: 1024,
    knownAddresses: {},
    knownTokens: {},
    network: !!VUE_APP_CHAIN_ID ? Number(VUE_APP_CHAIN_ID) : 82,
  },

  mutations: {
    SET_WINDOW_WIDTH(state, value) {
      state.windowWidth = value;
    },
    SET_NETWORK(state, value) {
      console.log('set network', value);
      state.network = value;
    },
    SET_KNOWN_ADDRESSES(state, valMap) {
      state.knownAddresses = valMap;
    },
    SET_KNOWN_TOKENS(state, valMap) {
      state.knownTokens = valMap;
    },
  },
  actions: {
    changeNetwork({ commit }, network) {
      return commit('SET_NETWORK', network);
    },
  },

  getters: {
    isExtraSmall: (state) => state.windowWidth <= state.widthExtraSmall,
    isSmall: (state) => state.windowWidth <= state.widthSmall,
    isTablet: (state) => state.windowWidth <= state.widthTablet,
    isDesktop: (state) => state.windowWidth > state.widthTablet,
  },
};
