<template>
	<view class="content">
		<!-- 顶部栏目显示 -->
		<view class="status_bar">  
		    <view class="top_view"></view>  
		</view>  
		<view class="topMenu">
			<text class="iconfont icon-arrow-left" @tap="backIndex"></text>
			<text class="title">评论</text>
		</view>
		<view class="mainContent">
			<view class="messageBox" v-for="(item,index) in comments" :key="index">
				<view class="icons">
					
					<text class="iconfont icon-delete" v-if="item.user_id==userId" @tap="deleteComment(index)"></text>
					<text style="color: #363c52;">-</text>
					<text class="iconfont icon-tip" @tap="delTip(item.comment_id)"></text>
					
				</view>
				<view class="person">
					<image :src="item.picture" class="head"></image>
					<text>
						<text>{{item.nick_name}}</text>
						<text class="iconfont icon-nan" v-if="item.sex==='0'"></text>
						<text class="iconfont icon-nv" v-else></text>
					</text>
				</view>
				<view class="comment">
					<text>{{item.content}}</text>
				</view>
				<view class="commentTime">
					<text>{{item.commnetTime}}</text>
				</view>
			</view>
		</view>
		<view class="box"></view>
		<view class="commentBox">
			<input class="inputBox" type="text" v-model="commentValue" placeholder="请输入您的评论" />
			<button class="commentBtn" @tap="commitComment">评论</button>
		</view>
		<frame v-if="framedisp" :id="commentId"></frame>
	</view>
</template>

<script>
	import app from '../static/js/config.js'
	import frame from '../components/frame.vue'
	export default {
		data() {
			return {
				token:'',
				commentValue:'',
				videoId:'',
				userId:'',//当前登录用户的id
				comments:[],//评论列表
				commentId:''
			}
		},
		components:{
			frame
		},
		onLoad(e) {
			this.userId = this.$store.state.userId;
			this.videoId = e.videoId;
			this.token = this.$store.state.token;
			this.refreshPage();
		},
		onBackPress() {
			uni.redirectTo({
			    url: 'index?videoId='+videoId+''
			});
			this.$store.commit('ChangeCode','index');
		},
		computed:{
			framedisp(){
				return this.$store.state.framedisp;
			}
		},
		methods: {
			/* 更新页面 */
			 refreshPage(){
			    app.baseRequest({
					url: '/comment/commentList',
				    data: {
						videoId: this.videoId 
				    },
				    success: (res) => {
						var data = res.data;
						console.log(data);
						if(data.success){
							this.comments = data.msg;
						}
				    }
				});
			},
			backIndex(){
				uni.redirectTo({
				     url: 'index'
				});
				this.$store.commit('ChangeCode','index');
			},
			/* 提交评论 */
			commitComment(){
				if(this.commentValue==""){
					uni.showModal({
						content: '评论内容不能为空',
						showCancel: false
					});
				}else{
					console.log(this.token);
					app.baseRequest({
						url: '/comment/addComment',
						method:"POST",
					    data: {
					        content: this.commentValue,
							videoId:this.videoId,
							token:this.token,
							userId:this.userId
					    },
					    success: (res) => {
							var data = res.data;
							console.log(data)
							if(data.success){
								this.commentValue =""
								this.refreshPage()
							}else{
								uni.showModal({
									content:data.rspDesc,
									showCancel: false
								})
							}
					    }
					});
				}
			},
			deleteComment(index){
				var delData = this.comments.splice(index,1);
				console.log(delData);
				app.baseRequest({
					url: '/comment/subComment',
					method:"POST",
				    data: {
				        content: delData[0].commnet,
						videoId:this.videoId,
						token:this.token,
						userId:this.userId
				    },
				    success: (res) => {
						console.log(res);
					},
				})
			},
			delTip(index){
				this.$store.commit('initframedisp',true);
				this.$store.commit('inittipflag','comment');
				this.commentId = index;
			}
		},
		
	}
</script>

<style>
page{
	background-color: #363c52;
}
/* -------顶部------- */
.topMenu{
	width: 100%;
	height: 100rpx;
	position: fixed;
	top: var(--status-bar-height);
	left:0;
	line-height: 100rpx;
	background-color: #363c52;
	color: #fff;
	box-sizing: border-box;
	padding-left: 20rpx;
	z-index: 999;
}
.topMenu .iconfont{
	display: inline-block;
	width: 100rpx;
}
.topMenu .title{
	display: inline-block;
	width: 500rpx;
	text-align: center;
}
/* -----评论内容------- */
.mainContent{
	margin-top: 100rpx;
}
.messageBox{
	width: 750rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	margin-bottom: 50rpx;
	color: #fff;
	font-size: 30rpx;
	position: relative;
}
/* 删除----- */
.icons{
	position: absolute;
	right: 30rpx;
	top: 30rpx;
}
.icon-delete{
	color: #C73451;
	font-size: 43rpx;
}
.icon-tip{
	color: #ebcc54;
	font-size: 40rpx;
}

/* -------------- */
.person{
	height: 75rpx;
	display: flex;
	align-items: center;
}
.person .head{
	flex: 1;
	width: 65rpx;
	height: 65rpx;
	border-radius: 50%;
	border: 1px solid #747888;
	
}
.person > text{
	flex: 8;
	padding-left: 30rpx;
	font-size: 25rpx;
	color: #8d8d8d;
}
.icon-nan{
	color: #9ecffb;
	margin-left: 10rpx;
}
.icon-nv{
	color: #ee7aa6;
	margin-left: 10rpx;
}
.comment{
	margin: 20rpx 0;
	padding-left: 50rpx;
}
.commentTime{
	text-align: right;
	font-size: 25rpx;
	color: #8d8d8d;
}
/* --------------底部评论框------------- */
.commentBox{
	height: 100rpx;
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0rpx;
	padding-left: 20rpx;
	padding-bottom: 10rpx;
	background-color: #363c52;
	z-index: 9999;
}
.inputBox{
	width: 550rpx;
	height: 75rpx;
	border: 1px dashed rgba(204,204,204,0.6);
	color: #ccc;
	padding-left:20rpx; 
}
.commentBtn{
	width: 140rpx;
	height: 75rpx;
	line-height: 75rpx;
	position: absolute;
	right: 30rpx;
	bottom: 35rpx;
	background-color: #fe2b54;
	color: #fff;
}
.box{
	width: 750rpx;
	height: 125rpx;
}

</style>
