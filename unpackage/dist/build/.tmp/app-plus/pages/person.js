(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/person"],{3015:function(t,e,n){"use strict";(function(t){n("52a2"),n("921b");s(n("66fd"));var e=s(n("a4cf"));function s(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},"45eb":function(t,e,n){},"509f":function(t,e,n){"use strict";n.r(e);var s=n("7a5f"),o=n.n(s);for(var i in s)"default"!==i&&function(t){n.d(e,t,function(){return s[t]})}(i);e["default"]=o.a},"559d":function(t,e,n){"use strict";var s=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"a",function(){return s}),n.d(e,"b",function(){return o})},"7a5f":function(t,e,n){"use strict";(function(t,s){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(n("4c99"));function i(t){return t&&t.__esModule?t:{default:t}}var a=function(){return n.e("components/footer/footer").then(n.bind(null,"e172"))},u={data:function(){return{token:"",id:"",account:"",imgSrc:"",nickName:"",gender:"",tabCurrentIndex:"",navList:[{text:"作品",number:10,content:[]},{text:"关注",number:12,content:[{imageSrc:"../static/images/05.jpg",nickName:"关注的人1",sex:0}]},{text:"粉丝",number:13,content:[{imageSrc:"../static/images/h1.jpg",nickName:"粉丝1",sex:1}]}],currentItem:""}},components:{footerNav:a},onBackPress:function(){t.redirectTo({url:"index"}),this.$store.commit("ChangeCode","index")},onLoad:function(){this.tabCurrentIndex=0,this.id=this.$store.state.userId,this.token=this.$store.state.token,this.currentItem=this.navList[0],this.refreshPage()},onShow:function(){this.token=this.$store.state.token,this.refreshPage()},methods:{gotoLogin:function(){t.redirectTo({url:"login"})},refreshPage:function(){var t=this;o.default.baseRequest({url:"/user/myInit",data:{userId:this.id,token:this.token},success:function(e){var n=e.data.msg;console.log(s(n," at pages\\person.vue:151")),e.data.success&&(t.account=n.account,t.nickName=n.nick_name,t.imgSrc=n.picture,t.gender=n.sex,t.navList[0].number=n.videos.length,t.navList[1].number=n.follow_account,t.navList[2].number=n.follower_account)}}),o.default.baseRequest({url:"/follow/fanslist",data:{userId:this.id,token:this.token},success:function(t){console.log(s(t.data," at pages\\person.vue:171"))}}),o.default.baseRequest({url:"/follow/followslist",data:{userId:this.id,token:this.token},success:function(t){console.log(s(t.data," at pages\\person.vue:182"))}}),this.getVideos()},getVideos:function(){var t=this;o.default.baseRequest({url:"/video/userVideo",data:{userId:this.id},success:function(e){e.data.success&&(t.navList[0].content=e.data.msg)}})},delVideo:function(t){var e=this;o.default.baseRequest({url:"video/subVideo",data:{videoId:t,userId:this.id,token:this.token},success:function(t){t.data.success&&e.getVideos()}})},vedioPlay:function(e){console.log(s(e," at pages\\person.vue:219")),t.navigateTo({url:"videoPlay?nickName="+this.nikcName+"&videoSrc="+e})},moreVideo:function(){this.hasNextPage&&(this.pageNum++,this.loadVideoList())},modifyMsg:function(){t.navigateTo({url:"modify?account="+this.account})},tabClick:function(t){this.currentItem=this.navList[t],this.tabCurrentIndex=t},outLogin:function(){var e=this;t.showModal({content:"是否退出登录",success:function(n){n.confirm&&o.default.baseRequest({url:"/user/quit",success:function(n){n.data.success&&(e.$store.commit("initToken",""),e.$store.commit("ChangeCode","index"),t.redirectTo({url:"index"}))}})}})}}};e.default=u}).call(this,n("6e42")["default"],n("0de9")["default"])},9886:function(t,e,n){"use strict";var s=n("45eb"),o=n.n(s);o.a},a4cf:function(t,e,n){"use strict";n.r(e);var s=n("559d"),o=n("509f");for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);n("9886");var a=n("2877"),u=Object(a["a"])(o["default"],s["a"],s["b"],!1,null,null,null);e["default"]=u.exports}},[["3015","common/runtime","common/vendor"]]]);