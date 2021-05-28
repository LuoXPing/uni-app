const app = {
    apiUrl: 'http://120.77.26.196:8800/', //请求的地址
    baseRequest(obj) {
            const userToken = uni.getStorageSync('userToken');
			 obj.header={"Content-Type":"application/x-www-form-urlencoded"};
            obj.url = this.apiUrl + obj.url;
            uni.request(obj)
    },
}
export default app;