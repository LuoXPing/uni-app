<template>
	<view class="mian">
		<view class="head">
			<image src='../static/images/head.png' class="headImg"></image>
		</view>
		<view class="inputBox">
			<view class="item">
				<label>账号</label>
				<input v-model="account" disabled class="accountDis"/>
			</view>
			<view class="item">
				<label>昵称</label>
				<input v-model="nickName" placeholder="请输入昵称"  placeholder-style='color:#747888'/>
			</view>
			<view class="item">
				<label>密码</label>
				<input type='password' v-model="password" placeholder="请输入密码"  placeholder-style='color:#747888'/>
			</view>
			<view class="item">
				<label>性别</label><br/>
				<radio-group @change="radioChange">
					<radio value="男"  :checked="sexChecked === 0" style="transform: scale(0.7)" color='#0d6fb8' />男<br/>
					<radio value="女" class="radioBtn" :checked="sexChecked === 1" style="transform: scale(0.7)"  color='#0d6fb8'/> 女
				</radio-group>
			</view>
		</view>
		<view>
			<button  class="modifybtn" @tap="modify" >修改</button>
		</view>
	</view>
</template>

<script>
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				sexChecked:0,
				account:'',
				nickName:'',
				password:''
			}
		},
		onLoad(e) {
			this.account = e.account;
		},
		methods: {
			/* 单选框的值改变触发 */
			radioChange(evt){
				this.sexChecked = evt.target.value==='男'?0:1;
			},
			/* 确认修改按钮触发 */
			modify(){
				var _this = this;
				uni.showModal({
					content:'是否确认修改？',
					success: function (res) {//用户点击确认
					    if (res.confirm) {
							app.baseRequest({
								url:'/user/modifyInfo',
								data:{
									account:_this.account,
									nick_name:_this.nickName,
									password:_this.password,
									sex:_this.sexChecked
								},
								success: (res) => {
									console.log(res);
									uni.navigateBack({
										delta: 1,
										animationType: 'pop-out',
										animationDuration: 200
									})
								},
							})
						}
					}
				})
			}
			
		},
		
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
		background: #363c52;
	}
	/*------------- 头像-------- */
   .head{
		color: #fff;
		text-align: center;
		padding: 60rpx 0 40rpx;
	}
	.head .headImg{
		width: 153rpx;
		height: 153rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
/* ------输入框------------ */
    .inputBox{
		position: absolute;
		left: 65rpx;
		top: 260rpx;
		width: 100%;
		height: 630rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.inputBox .item{
		width: 85%;
		justify-content: center;
		display: flex;
		align-items: center;
		
	}
	.inputBox label{
		font-size: 35rpx;
		color: #FFFFFF;
		flex: 1;
	}
	.inputBox input{
		display: inline-block;
		flex: 5;
		height: 80rpx;
		background-color: #4a5064;
		padding-left:30rpx ;
		color: #FFFFFF;
	}
	.inputBox .accountDis{
		color: #747888;
	}
	.item radio-group{
		flex: 5;
	}
	/*---------------- 确认按钮 ---------------*/
	.modifybtn{
		width: 656rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #b4e1ff;
		background-color: #0d6fb8;
		position: absolute;
		top: 900rpx;
		left: 65rpx;
	}

</style>
