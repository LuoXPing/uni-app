<template>
	<view class="frame">
		<view class="frameBox">
			<view class="title">
				<text>请输入举报原因：</text>
			</view>
			<textarea v-model="content" />
			<view class="btns">
				<text @tap="comfirm">确认</text>
				<text @tap="cancel">取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				content:'',
				token:this.$store.state.token,
				userId:this.$store.state.userId
			};
		},
		props:["id"],
		methods:{
			cancel(){
				this.$store.commit('initframedisp',false);
			},
			comfirm(){
				var current = this.$store.state.tipflag;
				 if(current === 'comment'){
					app.baseRequest({
						url: '/violation/addviolationComment',
						method:"POST",
					    data: {
					        informantInfo: this.content,
							commentId:this.id,
							token:this.token,
							userId:this.userId
					    },
					    success: (res) => {
							this.$store.commit('initframedisp',false);
							uni.showToast({
							    title: res.data.rspDesc,
							    duration: 2000
							});
					    },
					});
				}else{
					console.log(this.content);
					app.baseRequest({
						url: '/violation/addviolationVideo',
						method:"POST",
					    data: {
					        informantInfo: this.content,
							videoId:this.id,
							token:this.token,
							userId:this.userId
					    },
					    success: (res) => {
							this.$store.commit('initframedisp',false);
							uni.showToast({
							    title: res.data.rspDesc,
							    duration: 2000
							});
					    }
					});
					
				} 
			}
		}
	}
</script>

<style>
	.frame{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,.6);
	}
	.frame .frameBox{
		position: fixed;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%,-50%);
		transform: translate(-50%,-50%);
		
		z-index: 999;
		width: 80%;
		max-width: 300px;
		background-color: #4a5064;
		
		border-radius: 3px;
		overflow: hidden;
		padding: 10rpx;
	}
	.frame .frameBox .title{
		margin: 10rpx;
		color: #FFFFFF;
	}
	.frame .frameBox textarea{
		border: 1px solid #ccc;
		width: 95%;
		padding: 5px;
		color:#FFFFFF;
	}
	.btns{
		display: flex;
		margin-top: 20rpx;
		border-top: 1px solid #C0C0C0;
	}
	.btns text{
		flex: 1;
		text-align: center;
		color: #fff;
		padding: 10rpx;
	}
	.btns text:first-of-type{
		border-right: 1px solid  #C0C0C0;
	}
</style>
