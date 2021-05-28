<template>
	<view class="">
		<!-- 顶部栏目显示 -->
		<view class="status_bar">  
		    <view class="top_view"></view>  
		</view>  
		<view class="videoBox">
			<video id="myvideo"  autoplay="true" controls="true" objectFit="fill" :src="videoSrc"></video>
		</view>
		<cover-view class="close" @tap="closeVideoPlay">╳</cover-view>
	</view>
</template>

<script>
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				name:'',
				videoSrc:'',
				videoUrl:'',
			}
		},
		onLoad(e) {
			this.name = e.nickName;
			this.videoSrc = e.videoSrc;
			this.videoUrl = app.videoUrl;
			console.log(this.videoSrc)
		},
		methods: {
			/* 关闭视频 */
			closeVideoPlay(){
				uni.redirectTo({
					url: 'person?nickName='+this.name+'',
				});
			}
		}
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
		background-color: black;
		position: relative;
	}
	.videoBox{
		position: absolute;
		width: 100%;
		height: 96%;
		bottom:0;
		left: 0;
	}
	.videoBox #myvideo{
		width: 100%;
		height: 100%;
	}
	.close{
		position: absolute;
		right: 40rpx;
		top: 70rpx;
		color: #fff;
	}

</style>
