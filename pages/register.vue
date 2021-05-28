<template>
	<view class="content">
		<view class="inputBox">
			<input type="text" placeholder="请输入昵称" placeholder-style='color:#747888' v-model="nickName"/>
			<input type="text" placeholder="请输入账号" placeholder-style='color:#747888' v-model="account"/>
			<input type="password" placeholder="请输入密码" placeholder-style='color:#747888' v-model="password"/>
			<input type="password" placeholder="请确认密码" placeholder-style='color:#747888' v-model="rePassword"/>
			 <radio-group @change="radioChange">
				<radio value="男"  :checked="sexChecked === 0" style="transform: scale(0.7)" color='#0d6fb8' />
			    <label class="iconfont icon-nan"></label>
				<radio value="女" class="radioBtn" :checked="sexChecked === 1" style="transform: scale(0.7)"  color='#0d6fb8'/> 
				<label class="iconfont icon-nv" ></label>
			</radio-group>
		</view>
		
		<button  class="registbtn" @tap="dealregister" >注册</button>
		<navigator url="login" class="registerWord">返回登录</navigator>
	</view>
</template>

<script>
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				nickName:"",//用户昵称
				account:"",//账户
				password:"",//密码
				rePassword:'',
				sexChecked:0//性别，0为男，1为女
			}
		},
		onUnload() {
			this.account = this.password ='';
		},
		methods: {
			/* 用户注册操作，account和password不为空，account需要唯一 */
			dealregister(){
				/* 判断是否为空 */
				if(this.account==''||this.password==''||this.rePassword==''){
					uni.showModal({
						content: '账号密码不能为空',
						showCancel: false
					});
				}else{
					/* 判断两次密码是否一致 */
					if(this.rePassword!=this.password){
						uni.showModal({
							content: '两次密码不一致请重新输入',
							showCancel: false
						});
						this.rePassword=this.password=''
					}else{
					app.baseRequest({
						url: '/user/acocuntCheck',
					    data: {
					        account: this.account,
					    },
					    success: (res) => {
							console.log('--',res)
					       if(res.data.success){
							   app.baseRequest({
							   	   url: 'user/register',
								   method:"POST",
							       data: {
									   nickName:this.nickName,
							           account: this.account,
									   password: this.password,
									   sex: this.sexChecked
							       },
							       success: (res) => {
									   console.log(res.data)
									   if(res.data.success){
										   /* 跳转回登录页面 */
										  uni.navigateTo({
										   	url: 'login?account='+this.account+'',
										});
									  }
								   },
								})  
						   }else{
							   /* 用户名已经存在*/
							   uni.showModal({
							   	content: res.data.rspDesc,
							   	showCancel: false
							   });
						   }
					    },
					})
				    }
				}
			},
			//判断选择的性别
			radioChange(evt){
				this.sexChecked = evt.target.value==='男'?0:1;
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
		top: 160rpx;
		
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
		top: 900rpx;
		text-decoration: none;
	}
	.registbtn{
		width: 656rpx;
		height: 97rpx;
		color: #b4e1ff;
		background-color: #0d6fb8;
		position: absolute;
		top: 780rpx;
		left: 65rpx;
	}
	.icon-nan{
		color: #9ecffb;
	}
	.icon-nv{
		color: #ee7aa6;
	}
	.radioBtn{
		margin-left: 30rpx;
	}
</style>

