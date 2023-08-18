import Vue from 'vue';
import Vuex from 'vuex';
// import modules from './modules';
import { wallet } from '@/store/modules/wallet';
import auth from '@/store/modules/auth';
import user from '@/store/modules/user';
import dom from '@/store/modules/dom';
import toast from '@/store/modules/toast';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    home_block_height: 0,
  },
  mutations: {
    CONFIGVAL(state, { key, val }) {
      state[key] = val;
    },
  },
  actions: {
    configVal({ commit }, { key, val }) {
      commit('CONFIGVAL', { key: key, val: val });
    },
  },
  modules: { user, auth, dom, toast, wallet },
  // strict: process.env.NODE_ENV === 'development'
});
