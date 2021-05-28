import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageCode: "index",
	token:'',//用户登录的标志
	account:"",//用户账户
	userId:'',//用户id
	framedisp:false,
	tipflag:''
  },
  mutations: {
    ChangeCode(state,code){
      state.pageCode = code;
    },
	initToken(state,token){
	  state.token = token;
	},
	initAccount(state,account){
      state.account = account;
    },
	initUserId(state,id){
	  state.userId = id;
	},
	initframedisp(state,dis){
	  state.framedisp = dis;
	},
	inittipflag(state,now){
	  state.tipflag = now;
	},
	
  }

})
