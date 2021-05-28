<template>
	<view class="box">
		<!-- 未登录时显示的内容 -->
		<block v-if="!token">
			<view class="loginHead">
				<text class="iconfont icon-touxiang"></text>
			</view>
			<button class="loginBtn" @tap="gotoLogin">登录</button>
		</block>
		<!-- 登陆后显示 的内容 -->
		<block v-else>
			<view class="status_bar">
			    <view class="top_view"></view>  
			</view>  
			<!-- 头像信息 -->
			<view class="head">
				<view class="">
					<image :src=imgSrc class="headImg"></image>
				</view>
				<text class="iconfont icon-nan" v-if="gender==='0'"></text>
				<text class="iconfont icon-nv" v-else></text>
			</view>
			<!-- 个人信息 -->
			<view class="accBox">
				<!--  -->
				<view class="accMsg">
					<text>昵称</text><text>（{{nickName}}）</text><br/>
					<text>账户</text><text>（{{account}}）</text>
				</view>
				<!-- 修改退出栏 -->
				<view class="accModify">
					<button @tap="modifyMsg">修改资料</button>
					<button @tap="outLogin">退出登录</button>
				</view>
			</view>
			<!-- 按钮栏 -->
			<view class="content">
				<!-- 头部 -->
				<view class="navbar">
					<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">
						{{ item.text }}{{item.number}}
					</view>
				</view>
				<!-- 显示区域 -->
				<scroll-view  scroll-y="true" class="content">
				<!-- <view class="content"> -->
					<view  class="contentBox" v-for="(item,i) in currentItem.content" :key="i" >
						<block v-if="tabCurrentIndex===0">
							<view class="ImageBox">
								<image :src="item.cover_picture" class="posterImg"></image>
								<view class="pauseImg" @tap="vedioPlay(item.video_src)">
									<image src="../static/images/pause.png"></image>
								</view>
							</view>
							<view class="describe">{{item.description}}</view>
							<view>
								<text class="iconfont icon-delete" @tap="delVideo(item.video_id)"></text>
							</view>
						</block>
						<block v-else>
							<view class=" fans">
								<image :src="item.picture" class="headImage"></image>
							</view>
							<view class="name">
							<text>{{item.nick_name}}</text>&nbsp;&nbsp;
							<text class="iconfont icon-nan" v-if="item.sex==='0'"></text>
							<text class="iconfont icon-nv" v-else></text>
							</view>
						</block>
					</view>
				<!-- </view> -->
				</scroll-view>
			</view>
			</block>
			<view class="box"></view>
			<footerNav></footerNav>
			
	</view>
	
</template>

<script>
	import footerNav from '../components/footer/footer.vue'
	import app from '../static/js/config.js'
	export default {
		data() {
			return {
				token:'',//用于判断是否已经登录
				id:'',//id用于关注
				account:'',
				imgSrc:"",//头像地址
				nickName:"",//昵称
				gender:'',//性别，0为男，1为女
				
				tabCurrentIndex:'',
				navList:[
					{text:'作品',number:0,content:[	]},
					{text:'关注',number:0,content:[]},
					{text:'粉丝',number:0,content:[]},
					],
					currentItem:'',
		    }
		},
		components:{
			footerNav
		},
		onBackPress() {
			uni.redirectTo({
			    url: 'index'
			});
			this.$store.commit('ChangeCode','index');
		},
		onLoad() {
			this.tabCurrentIndex = 0;
			this.id = this.$store.state.userId;
			this.token = this.$store.state.token;
			this.currentItem = this.navList[0];
			this.refreshPage();
		},
		onShow() {
			this.token = this.$store.state.token;
			this.refreshPage();
		},
		methods: {
			gotoLogin(){
				uni.redirectTo({
					url:'login'
				})
			},
			/* 更新页面 */
			 refreshPage(){
				app.baseRequest({
					url: '/user/myInit',
					data: {
					    userId: this.id,
						token:this.token	
					},
					success: (res) => {
						const data = res.data.msg;
						console.log(data);
						if (res.data.success) {
							this.account = data.account;
							this.nickName = data.nick_name;
							this.imgSrc = data.picture;
							this.gender = data.sex;
							this.navList[0].number = data.videos.length;
							this.navList[1].number = data.follow_account;
							this.navList[2].number = data.follower_account;
						}
					}
				})
				/* 获取粉丝集合 */
				app.baseRequest({
					url: '/follow/fanslist',
					data: {
					    userId: this.id,
						token:this.token	
					},
					success: (res) => {
						this.navList[2].content = res.data.msg;
						console.log(this.navList)
					},
				})
				/* 获得关注的人 */
				app.baseRequest({
					url: '/follow/followslist',
					data: {
					    userId: this.id,
						token:this.token	
					},
					success: (res) => {
						this.navList[1].content = res.data.msg;
					},
				})
				this.getVideos();
			},
			/* 获取视频 */
			getVideos(){
				app.baseRequest({
					url: '/video/userVideo',
					data: {
					    userId: this.id
					},
					success:(res)=>{
						if(res.data.success){
							this.navList[0].content = res.data.msg;
						}
					}
				})
			},
			/* 删除视频 */
			delVideo(id){
				app.baseRequest({
					url: 'video/subVideo',
					data: {
						videoId:id,
					    userId: this.id,
						token:this.token	
					},
					success: (res) => {
						if(res.data.success){
							this.getVideos();
					    }
					},
				})
			},
			/* 点击播放 */
			vedioPlay(src){
				console.log(src)
				uni.navigateTo({
					url:'videoPlay?nickName='+this.nikcName+'&videoSrc='+src+'',
				})
			},
			/* 加载更多 */
			moreVideo(){
				if(this.hasNextPage){
					this.pageNum++;
					this.loadVideoList()
				}
			},
			/* 点击修改页面跳转，需要进行传参，账户 */
			modifyMsg(){
				uni.navigateTo({
					url: 'modify?account='+this.account+''
				})
			},
			//顶部tab点击
			tabClick(index) {
				this.currentItem = this.navList[index];
				this.tabCurrentIndex = index;
			},
			//退出登录
			outLogin(){
				const _this = this;
				uni.showModal({
					content:'是否退出登录',
					success:function(res) {
						if (res.confirm) {
							app.baseRequest({
								url:'/user/quit',
								 data: {
									 userId:this.id
								 },
								 success: (res) => {
									if( res.data.success){
										_this.$store.commit('initToken','');
										 _this.$store.commit('ChangeCode','index');;
										uni.redirectTo({
											url:'index'
										})
									}
								 }
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
	background-color:#363c52;
}
/* --------提示登陆---------- */
.loginHead{
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 370rpx;
}
.icon-touxiang{
	font-size: 200rpx;
	color: #747888;
}
.loginBtn{
	width: 656rpx;
	height: 97rpx;
	color: #b4e1ff;
	background-color: #0d6fb8;
	position: absolute;
	top: 750rpx;
	left: 65rpx;
}

/* ---------正常显示----------- */
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
.icon-nan{
	color: #9ecffb;
	margin-left: 10rpx;
}
.icon-nv{
	color: #ee7aa6;
	margin-left: 10rpx;
}

/* --------信息框----------- */
.accBox{
	width: 100%;
	height: 200rpx;
}
.accBox .accMsg{
	float: left;
	padding-top: 30rpx ;
	font-size: 35rpx;
	color: #747888;
	margin-left: 30rpx;
}
.accBox .accModify{
	float: right;
}
.accBox .accModify button{
	width: 180rpx;
	font-size: 30rpx;
	margin: 0 30rpx 20rpx 0;
	color: #b4e1ff;
	background-color: #4a5064;
}

/* ------------顶部tab栏目------- */
.navbar{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}
.navbar .nav-item{
	width: 33.33%;
	font-size: 35rpx;
	padding: 10rpx;
	box-sizing: border-box;
	text-align: center;
	border-bottom: 1px solid #4a5064;
}
.navbar .current{
	border-bottom: 2px solid #747888;
}
.list{
	margin-top: 30rpx;
}
/* -----------作品内容展示------------ */
.content{
	margin-top: 30rpx;
	width: 750rpx;
	color: #fff;
	font-size: 30rpx;
}
.content .contentBox{
	width: 720rpx;
	height: 200rpx;
	padding-left: 30rpx;
	position: relative;
	
}
/* 图片 */
.content .ImageBox{
	width: 170rpx;
	height: 170rpx;
	position: relative;
	float: left;
}
.content .ImageBox .posterImg{
	width: 170rpx;
	height: 170rpx;
}
.content .contentBox .ImageBox .pauseImg{
	width: 170rpx;
	height: 170rpx;
	background-color: rgba(0,0,0,0.5);
	position: absolute;
	left: 0;
	top: 0;
}
.content .contentBox .ImageBox .pauseImg image{
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	float: left;
	left: 50%;
	top: 50%;
	transform: translateX(-50%);
}
/* --------描述------ */
.contentBox .describe{
	width: 510rpx;
	height: 170rpx;
	line-height: 43rpx;
	font-size: 30rpx;
	padding-left:20rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	 white-space:normal;
	 word-wrap: break-word;/* 允许单词内换行 */
	 word-break: break-all; /* 允许长单词换行到下一行 */
}
.icon-delete{
	color: #c73451;
	font-size: 40rpx;
	position: absolute;
	right: 30rpx;
	top: 20rpx;
}
/* ----内容中的粉丝和关注--------- */
.content .fans{
	width: 120rpx;
	height: 120rpx;
	float: left;
	margin-left: 50rpx;
}
.content  .fans .headImage{
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}
.content .name{
	width: 400rpx;
	height: 120rpx;
	line-height: 120rpx;
	margin-left: 30rpx;
	text-align: center;
}

/* -----------内容下面的按钮类------ */
.box{
	width: 750rpx;
	height: 125rpx;
}

.moreVideoBtn{
	width: 650rpx;
	border: 1px solid #555555;
	color: #fff;
	background-color:rgba(62,62,62,0.5);
	font-size: 25rpx;
}
.noMore{
	width: 750rpx;
	text-align: center;
	font-size: 25rpx;
	color: rgba(255,255,255,0.5);
}
</style>
