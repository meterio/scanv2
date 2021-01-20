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
    network: '',
  },

  mutations: {
    SET_WINDOW_WIDTH(state, value) {
      state.windowWidth = value;
    },
    SET_NETWORK(state,value){
      if (value === 'main' || value === 'test'){
      state.network = value;
      }
    }

  },
  actions:{
    changeNetwork ({ commit }, network) {
      return commit('SET_NETWORK', network);
    }
  },

  getters: {
    isExtraSmall: state => state.windowWidth <= state.widthExtraSmall,
    isSmall: state => state.windowWidth <= state.widthSmall,
    isTablet: state => state.windowWidth <= state.widthTablet,
    isDesktop: state => state.windowWidth > state.widthTablet
  }
};
