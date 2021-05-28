import Vue from 'vue'
import App from './App'
import 'static/css/iconfont1.css'
import store from "@/store/store.js";

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
