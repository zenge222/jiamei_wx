import * as types from '../mutations';
const classify = {
    state: {
        classifyAddrInfo:{
            areaIds:[],
            phoneNum:'',
            productTypeId:'',
        }
    },
    mutations: {
        [types.SET_CLASSIFY](state, data) {
            state.classifyAddrInfo.areaIds = data.areaIds;
            state.classifyAddrInfo.linkPhone = data.linkPhone;
            state.classifyAddrInfo.productTypeId = data.productTypeId;
        },
    },
    actions: {
      setClassify({ commit, state }, params){
        commit(types.SET_CLASSIFY, params);
      }
    },
}
export default classify;