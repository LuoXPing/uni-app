<template>
	<view >
		<view class="videoBox" @touchstart="dealTouchstart"  @touchend="dealTouchend">
			<video :src="item.video_src" id="myvideo" objectFit="fill" :controls="false" 
					@play="isVideoPlay=true" :show-play-btn="false" autoplay="true">
				<!-- 评论 -->
				<cover-image src="../static/images/message.png" class="icon" @tap="gotoMessage"></cover-image>
				<cover-view class="number">{{item.comment_times}}</cover-view>
				<!-- 点赞 -->
				<cover-image src="../static/images/hearta.png" class="icon"  v-if="item.appreciateFlag != '0' "  @tap="dealheart()"></cover-image>
				<cover-image src="../static/images/heart.png" class="icon" v-else @tap="dealheart()"></cover-image>
				<cover-view class="number">{{item.star_times}}</cover-view>
				<!-- 举报 -->
				<cover-image src="../static/images/tip.png" class="icon1" @tap="delTip()"></cover-image>
				<!-- 描述 -->
				<cover-view class="describeContent">{{item.description}}</cover-view>
				
		     </video>
		</view>
		<!-- 顶部栏目显示 -->
		<view class="status_bar">  
		    <view class="top_view"></view>  
		</view>  
		<!-- 顶部个人信息 -->
		<view class="header clearfix">
			<view class="imgBox">
				<image :src="item.user_picture"></image>&nbsp;
				<text>&nbsp;</text>
				<text class="name">{{item.nickName}}</text>
			</view>
			<!-- 关注 -->
			<view class="focusBox" >
				<text  class="focus" @tap="dealFocus()" v-if="item.followFlag === '0'">关注</text>
				<text  class="focus" @tap="dealFocus()" v-else>取消关注</text>
			</view>
		</view>	
		<!-- 底部tab栏 -->
		<footerNav></footerNav>
		<frame v-if="framedisp" :id="item.video_id"></frame>
	</view>
</template>

<script>
	import footerNav from '../components/footer/footer.vue'
	import frame from '../components/frame.vue'
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				token:'',
				id:'',//当前登录用户的id
				videos:[],//视频列表
				item:{},//当前播放
				swiperDistance:'0',//滑动距离
				isVideoPlay:'',
				videoId:''
				}
		},
		components:{
			footerNav,
			frame
		},
		computed:{
			framedisp(){
				return this.$store.state.framedisp;
			}
		},
		onLoad(e) {
			this.videoId = e.videoId;
			/* 初始化视频数据 */
			app.baseRequest({
				url: "/video/getVideoList",
				data:{
					userId:this.id
				},
			    success: (res) => {
					console.log(res.data)
					if(res.data.success){
						var data = res.data;
						this.videos = data.msg;
						this.item = this.videos.shift();
					} 
					console.log(this.item)
				},
			})
		},
		onShow() {
			this.id = this.$store.state.userId;
			this.token = this.$store.state.token;
			this.refreshDate();
		},
		onReady() {
			 this.videoContext = uni.createVideoContext('myvideo');
		},
		methods: {
			/* 用于更新页面 */
			refreshDate(){
				app.baseRequest({
					url: "/video/getVideoList",
					data:{
						userId:this.id
					},
				    success: (res) => {
						console.log(res.data)
						if(res.data.success){
							var list = res.data.msg;
							var no = this.videoId?this.videoId:this.item.video_id;
							for(var i=list.length ; i>0 ; i--){
								var video = list.shift();
								if(video.video_id === no) {
									this.videos = list;
									this.item = video;
									break;
								}
							}
						} 
					},
				})
			},
			/* 获取页面的数据 */
			getVideoList(){
				app.baseRequest({
					url: "/video/getVideoList",
					data:{
						userId:this.id
					},
				    success: (res) => {
						console.log(res.data)
						if(res.data.success){
							var data = res.data;
							var list = this.videos.concat(data.msg)
							this.videos = list;
						} 
					},
				})
			},
			/* 滑动事件 */
			dealTouchstart(e){//滑动开始
			    this.swiperDistance = e.changedTouches[0].pageY;
			},
			dealTouchend(e){//滑动结束
				this.swiperDistance -= e.changedTouches[0].pageY
				if(this.swiperDistance>50){
					this.item = this.videos.shift()
					this.num++;
					if(this.videos.length<2){
						this.getVideoList()
					}
					console.log(this.videos);
				}else{
					if(this.isVideoPlay){
						this.videoContext.pause();
						this.isVideoPlay=false
					}else{
						this.videoContext.play();
						this.isVideoPlay=true
					}
				}
			},
			/* 关注和取消关注的操作 */
			dealFocus(){
				if(!this.token){
					uni.showModal({
						content:'尚未登录，请进行登录',
						showCancel: false
					})
				}else{
					if(this.item.followFlag === '0'){//还没有关注，显示关注，处理完显示未关注
						app.baseRequest({
							url:'/follow/add',
							data:{
								followId:this.item.user_id,
								token:this.token,
								userId:this.id
							},
							success: (res) => {
								console.log(res);
								if(res.data.success){
									console.log('关注成功')
									this.item.followFlag = '1';
								}
							}
						})
					}else{//已经关注，显示取消关注，处理完显示 关注
						app.baseRequest({
							url:'/follow/sub',
							data:{
								followId:this.item.user_id,
								token:this.token,
								userId:this.id
							},
							success: (res) => {
								console.log(res);
								if(res.data.success){
									console.log('取消关注成功')
									this.item.followFlag = '0';
								}
							},
						})
					}
					this.refreshDate();
				}
			},
			/* 跳转到评论页面 */
			gotoMessage(){
				uni.redirectTo({
					url: 'comment?videoId='+this.item.video_id+'',
				});
			},
			/* 点赞和取消操作 */
			dealheart(id){
				app.baseRequest({
					url:'appreciate/change',
					data:{
						videoId:this.item.video_id,
						token:this.token,
						userId:this.id
					},
					success: (res) => {
						console.log(res);
						if(res.data.success){
							this.item.appreciateFlag = this.item.appreciateFlag === '0'?'1':'0';
							this.refreshDate();
						}
					}
				})
			},
			delTip(){
				this.$store.commit('initframedisp',true);
				this.$store.commit('inittipflag','index');
				
			}
		
		}
	}
</script>

<style>
	page{
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #363c52;
	}
	/* -------------------------------- */
	.videoBox{
		position: absolute;
		width: 100%;
		height: 78%;
		left: 0;
		margin-top: 160rpx;
		margin-bottom: 120rpx;
	}
    .videoBox #myvideo{
		width: 100%;
		height: 100%;
	}
	/* ------------------------------ */
	.header{
		width: 100%;
		height: 115rpx;
		line-height: 100rpx;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: space-between;
	}
	.imgBox {
		width: 350rpx;
		height: 100%;
	}
	.header .imgBox image{
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		vertical-align: middle;
	}
	.header .name{
		color: #fff;
		font-size: 30rpx;
		padding-left: 10rpx;
	}
	.header .focusBox{
		width: 350rpx;
		height: 100%;
		text-align: right;
	}
	.header .focus{
		border: 1px solid #fdd100;
		color: #fdd100;
		width: 120rpx;
		display: inline-block;
		padding:0 5rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 30rpx;
		margin-right: 20rpx ;
	}
	/* -------------侧边图标--------------- */
	
	.number{
		font-size: 25rpx;
		width: 100rpx;
		text-align: center;
		color: #fff;
		position: absolute;
		right: 20rpx;
	}
	.number:nth-of-type(1){
		top: 600rpx;
	}
	.number:nth-of-type(2){
		top: 730rpx;
	}
	.icon{
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		right: 20rpx;
	}
	.icon1{
		width: 70rpx;
		height: 70rpx;
		position: absolute;
		right: 30rpx;
		top: 780rpx;
	}
	.icon:nth-of-type(1){
		top: 500rpx;
	}
	.icon:nth-of-type(2){
		top: 640rpx;
	}
	/* ---------------------------- */
	.describeContent{
		width: 450rpx;
		height: 155rpx;
		line-height: 40rpx;
		color: #ebebeb;
		font-size: 30rpx;
		position: absolute;
		left: 30rpx;
		bottom: 150rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		 white-space:normal;
		 word-wrap: break-word;/* 允许单词内换行 */
		 word-break: break-all; /* 允许长单词换行到下一行 */
	}
</style>
