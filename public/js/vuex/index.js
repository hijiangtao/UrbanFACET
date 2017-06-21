/**
 * index.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-06-19 22:22:36
 * @version $Id$
 */

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        init: true
    },
    mutations: {
        updateInitState(state) {
            state.init = !state.init;
        }
    }
})

export default store;