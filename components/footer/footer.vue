<template>
	<view class="footer">
		<view :class="{active:Code}" @tap="redirctToIndex">
			<text>首页</text>
		</view>
		<view class="Photo" @tap="videoCapture">
			<text class="iconfont icon-xiangji"></text>
		</view>
		<view :class="{active:!Code}" @tap="redirctToSelf">
			<text>我的</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		computed:{
			Code(){
				if ( this.$store.state.pageCode == "index") {
					return true
				}else{
					return false
				}
			}
		},
		methods:{
			/* 调用摄像头 */
			 videoCapture() {
				 // #ifdef APP-PLUS
				 let cmr = plus.camera.getCamera();
				 let res = cmr.supportedVideoResolutions[0];
				 cmr.startVideoCapture((path) => {
				 		uni.redirectTo({
							url:`../../videoUpload/videoUpload?path=${path}`
				 		})
				 	},
				 	(error) => {
				 		// #ifdef H5
				 		alert("Capture video failed: " + error.message);
				 		// #endif
				 		console.log("Capture video failed: " + error.message)
				 		// uni.hideLoading();
				 				
				 	}, {
				 		resolution: res,
				 		format: '3gp',
				 		videoMaximumDuration: 15,
				 		optimize: true
				 	}
				 );
				 // #endif
			},
			/* 到首页 */
			redirctToIndex(){
				uni.redirectTo({
				    url: 'index'
				});
				this.$store.commit('ChangeCode','index');//全局改变页面的值
			},
			/* 跳转到个人中心 */
			redirctToSelf(){	
				uni.redirectTo({
				    url: 'person'
				});
				this.$store.commit('ChangeCode','person')
			}
		}
	}
</script>

<style>
	page{
		z-index:999;
	}
.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		display: flex;
		justify-content: space-between;
		text-align: center;
		color: #888384;
		background-color: #363c52;
	}
	.footer view{
		width: 33.3%;
	}
	.footer .active{
		color: #fff;
	}
	.icon-xiangji{
		font-size: 90rpx;
		color: #888384;
	}
</style>
