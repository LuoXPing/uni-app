<template>
	<view class="content">
		<view class="title-wrapper">
			<view class="title">
				<textarea v-model="description" placeholder="写合适的标题,能让更多的人看到 ~" />
				<!-- <image :src="path" mode="aspectFit"></image> -->
			</view>
		</view>
		<view class="main">
			<!-- <button type="primary" @click="cancle">取消</button> -->
			<!-- <view class="progress-box">
				<progress :percent="progress" active stroke-width="3" backgroundColor="#999" show-info />
			</view> -->
			<!-- #ifdef H5 -->
			<!-- <uni-list>
				<uni-list-item title="添加位置" show-extra-icon="true" :extra-icon="{ color: '#f3f6f9', size: '24', type: 'icon-location' }"></uni-list-item>
				<uni-list-item
					title="谁可以看"
					show-extra-icon="true"
					:extra-icon="{ color: '#f3f6f9', size: '24', type: 'icon-buoumaotubiao32' }"
					badge-text="公开"
				></uni-list-item>
			</uni-list> -->
			<!-- #endif -->
			<video :src="path" style="width: 100%;" controls></video>
		</view>
		<view class="footer">
			<button v-show="flag" type="default" class="btn" @click="upload()">
				<view class="iconfont icon-shangchuan"></view>
				发布
			</button>
			<view v-show="!flag" class="progress-box"><progress activeColor="#fe2d54" :percent="progress" show-info stroke-width="8" /></view>
		</view>
	</view>
</template>

<script>
import uniListItem from '../../components/uni-list-item/uni-list-item.vue';
import uniList from '../../components/uni-list/uni-list.vue';
import uniIcon from '../../components/uni-icons/uni-icons.vue';
import app from '../../static/js/config.js'
export default {
	data() {
		return {
			path: null,
			uploadTask: null,
			progress: null,
			totalBytesSent: null,
			totalBytesExpectedToSend: null,
			flag: true,
			description: '',
			userId:''
		};
	},
	onLoad(option) {
		this.path = option.path;
		this.userId = this.$store.state.userId;
	},
	methods: {
		upload() {
			uni.showLoading({
				title: '上传中，请稍等',
				mask: true
			});
			if (this.flag) {
				this.flag = false;
				// 文件上传
				let token = this.$store.state.token;
				this.uploadTask = uni.uploadFile({
					url: 'http://120.77.26.196:8800/video/upload', //仅为示例，非真实的接口地址
					filePath: this.path,
					name: 'file',
					formData: {
						description: this.description,
						token: token,
						userId:this.userId
					},
					success: uploadFileRes => {
						console.log('-----上传测试一---',uploadFileRes)
						let data = JSON.parse(uploadFileRes.data);
						if (data.success) {
							uni.showModal({
								title: 'Success',
								content: "上传成功",
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										uni.redirectTo({
											url: '../index'
										});
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						} else {
							this.flag = true;
							uni.showModal({
								title: 'Fail',
								content: data.rspDesc,
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					},
					fail: err => {
						console.log('-----失败-----');
						this.flag = true;
						uni.showModal({
							title: 'Fail',
							content: '上传失败,请稍后重试',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					},
					complete() {
						uni.hideLoading();
					}
				});
				this.uploadTask.onProgressUpdate(res => {
					this.progress = res.progress;
					this.totalBytesSent = res.totalBytesSent;
					this.totalBytesSent = res.totalBytesExpectedToSend;
				});
			}
		},
		cancle() {
			this.uploadTask && this.uploadTask.abort();
		}
	},
	watch: {
		progress(newVal, oldVal) {
			this.progress = newVal;
		},
		totalBytesSent(newVal, oldVal) {
			this.totalBytesSent = newVal;
		},
		totalBytesExpectedToSend(newVal, oldVal) {
			this.totalBytesExpectedToSend = newVal;
		}
	},
	components: {
		uniList,
		uniListItem,
		uniIcon
	},
	mounted() {}
};
</script>

<style>
@import url('../../static/css/iconfont.css');
</style>
<style lang="scss">
page {
	background-color: #161923;
	.content {
		border-top: 1rpx solid rgba($color: $uni-border-color, $alpha: 0.1);
		background-color: #161923;
		position: absolute;
		margin-top: 26rpx;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		.title-wrapper {
			.title {
				border-bottom: 1rpx solid rgba($color: $uni-border-color, $alpha: 0.1);
				margin: 26rpx;
				position: relative;
				textarea {
					color: #9ea0a8;
					font-size: $uni-font-size-sm;
					width: 100%;
					height: 236rpx;
				}
				image {
					width: 140rpx;
					height: 186rpx;
					display: inline-block;
					position: absolute;
					right: 26rpx;
					top: 0rpx;
				}
				video {
					width: 140rpx;
					height: 186rpx;
					display: inline-block;
					position: absolute;
					right: 26rpx;
					top: 0rpx;
				}
			}
		}
		.main {
			padding: 26rpx;
			.uni-list {
				.uni-list-item {
					background-color: #161923;
					border: none;
				}
			}
		}
		.footer {
			position: absolute;
			bottom: 26rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			.icon-shangchuan {
				display: inline-block;
				font-size: $uni-font-size-sm;
				color: #f3f6f9;
				margin-right: 20rpx;
				vertical-align: top;
			}
			.btn {
				width: 342rpx;
				height: 74rpx;
				border-radius: 3px;
				background-color: #fe2d54;
				line-height: 74rpx;
				text-align: center;
				color: #f3f6f9;
				font-size: $uni-font-size-sm;
			}
			.progress-box {
				color: #f3f6f9;
				width: 342rpx;
				text-align: center;
			}
		}
	}
}
</style>
