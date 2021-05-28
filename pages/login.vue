<template>
	<view class="content">
		<view class="inputBox">
			<input type="text" placeholder="请输入账号" placeholder-style='color:#747888'  v-model="account"/>
			<input type="password" placeholder="请输入密码" placeholder-style='color:#747888' v-model="password" />
		</view>
		<button  class="loginbtn" @tap="login" >登录</button>
		<navigator url="register" class="registerWord">新用户注册</navigator>
	</view>
</template>

<script>
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				account:'',
				password:''
			}
		},
		onLoad(e) {
			this.account = e.account;
		},
		onUnload() {
			this.account = this.password = ""
		},
		methods: {
			/* 登录按钮的操作 */
			login(){
				if(this.account==''||this.password==''){
					uni.showModal({
						content: '账号密码不能为空',
						showCancel: false
					});
				}else{
					app.baseRequest({
						/* ======接口，登录 */
						 url: 'user/login',
						method: 'POST',
						data:{
							account: this.account,
							password: this.password
						},
						success: (res) => {
							var data = res.data
							console.log(data)
							if(res.data.success){ 
								/* 将token存入本地缓存中，成功后进入首页 */
								/* uni.setStorageSync('userToken',data.token); */
								/* 存到全局变量中 */
								this.$store.commit('ChangeCode','index');//设置为登录的时候为首页
								this.$store.commit('initToken',data.token);
								this.$store.commit('initAccount',this.account);//用户的账户
								this.$store.commit('initUserId',data.msg.substr(7));//用户id
								uni.redirectTo({
									url:'index?account='+this.account+''
								})
							}else{
								uni.showModal({
									content: res.data.rspDesc,
									showCancel: false,
									success:function(){
										this.password = ""
									}
								});
							}
						},
						fail:(res)=>{
							uni.showModal({
								content: '网络请求失败，请稍后重试',
								showCancel: false
							});
						}
					}) 
				}
			}
		}
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
		background: #363c52;
	}
	.inputBox{
		position: absolute;
		left: 65rpx;
		top: 195rpx;
	}
	.inputBox input{
		width: 626rpx;
		height: 97rpx;
		background-color: #4a5064;
		margin-bottom: 40rpx;
		padding-left:30rpx ;
		color: #FFFFFF;
	}
	.registerWord{
		color: #FFFFFF;
		text-decoration: underline;
		position: absolute;
		right: 70rpx;
		top: 650rpx;
		text-decoration: none;
	}
	.loginbtn{
		width: 656rpx;
		height: 97rpx;
		color: #b4e1ff;
		background-color: #0d6fb8;
		position: absolute;
		top: 500rpx;
		left: 65rpx;
	}
</style>
