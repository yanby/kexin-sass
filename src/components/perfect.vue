<template>
    <div class="perfect">
      <Header></Header>
      <div class="title">
        <div class="w1200">
          <div class="title-left">
            <span>完善资料</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="msg">
            <h4>发起授信申请需要您完善认证资质，并审核通过。</h4>
            <div class="img" v-if="buyerStatus == 1">
              <img :src="imageUrl" class="avatar">
            </div>
            <div class="img" v-else>

              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :http-request="myLoad"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>

            <div class="txt">点击上传营业执照</div>

          </div>
          <div class="msg">
            <div class="img" v-if="buyerStatus == 1">
              <img :src="imageUrl1" class="avatar">
            </div>
            <div class="img" v-else>
              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :http-request="myLoad1"
              >
                <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>

            <div class="txt">点击上传食品流通许可证</div>
          </div>
          <div class="shangchuan" @click="upLoad">上传</div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import Header from './header.vue'
  export default {
    name: '',
    data() {
      return {
        imageUrl: '',
        imageUrl1: '',
        buyerStatus: "",//审核状态，1通过
        getUrl: "",
        getUrl1: ""
      }
    },
    components: {
      Header
    },
    mounted(){
      this.init()
    },
    methods:{
      init(){
        this.$http({
          url: '/user/getBuyerInfo',
          method: 'post',
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.buyerStatus = res.objs.buyerStatus
            if(this.buyerStatus == 1){
              this.imageUrl = res.objs.buyerInfo.businessLicence
              this.imageUrl1 = res.objs.buyerInfo.foodLicence
            }
          }else{
            layer.msg(res.msg)
          }
        })
      },
      handleAvatarSuccess(res, file) {
        console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess1(res, file) {
        console.log(file)
        this.imageUrl1 = URL.createObjectURL(file.raw);
      },
      // 自定义上传的方式 作者：曾经的水哥 https://www.cnblogs.com/cengjingdeshuige/
      myLoad (param) {
        var that = this;
        const loading = this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let file = param.file // 得到文件的内容
        console.log(file)
        let index = file.name.indexOf(".")
        let nameEnd = file.name.substr(index)
        // 获取oss签名
        this.$http({
          url: '/buyer/info/oss',
          method: 'post',
        }).then((res) => {
          console.log(res)
          if (res.code == 1) { //eslint-disable-line
            let json = res.objs.oss
            let ossUrl = json.host
            let nameStart = new Date().getTime() + "" + Math.ceil(Math.random() * 100)
            let name = "businessLicence" + nameEnd
            this.getUrl = json.host + "/" + json.dir + name // 上传后的文件地址
            let sendData = new FormData() // 上传文件的data参数
            sendData.append("OSSAccessKeyId", json.accessid)
            sendData.append("policy", json.policy)
            sendData.append("Signature", json.signature)
            sendData.append("keys", json.dir)
            sendData.append("key", json.dir + name)
            sendData.append("success_action_status", 200) // 指定返回的状态码
            sendData.append("callback", json.callback);
            sendData.append("type", "image/jpeg")
            sendData.append("file", file)
            this.$http.post(ossUrl, sendData,{headers: {"Access-Control-Allow-Origin": "*"}}).then((res1) => {
              console.log(res1)
              loading.close();
              this.imageUrl = this.getUrl;
            })
          }else{
            loading.close();
            layer.msg(res.msg)
          }
        })
      },
      myLoad1 (param)  {
        var that = this;
        const loading = this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let file = param.file // 得到文件的内容
        console.log(file)
        let index = file.name.indexOf(".")
        let nameEnd = file.name.substr(index)
        // 获取oss签名
        this.$http({
          url: '/buyer/info/oss',
          method: 'post',
        }).then((res) => {
          console.log(res)
          if (res.code == 1) { //eslint-disable-line
            let json = res.objs.oss
            let ossUrl = json.host
            let nameStart = new Date().getTime() + "" + Math.ceil(Math.random() * 100)
            let name = "foodLicence" + nameEnd
            this.getUrl1 = json.host + "/" + json.dir + name // 上传后的文件地址
            let sendData = new FormData() // 上传文件的data参数
            sendData.append("OSSAccessKeyId", json.accessid)
            sendData.append("policy", json.policy)
            sendData.append("Signature", json.signature)
            sendData.append("keys", json.dir)
            sendData.append("key", json.dir + name)
            sendData.append("success_action_status", 200) // 指定返回的状态码
            sendData.append("callback", json.callback);
            sendData.append("type", "image/jpeg")
            sendData.append("file", file)
            this.$http.post(ossUrl, sendData,{headers: {"Access-Control-Allow-Origin": "*"}}).then((res1) => {
              console.log(res1)
              loading.close();
              this.imageUrl1 = this.getUrl1;
            })
          }else{
            loading.close();
            layer.msg(res.msg)
          }
        })
      },
      upLoad(){
        var that = this;
        if(this.imageUrl == ""){
          layer.msg("请上传营业执照")
        }else if(this.imageUrl1 == ""){
          layer.msg("请上传食品流通许可证")
        }else{
          this.$http({
            url: '/user/uploadBusinessLicence',
            method: 'post',
            params: {
              businessLicence: this.getUrl,
              foodLicence: this.getUrl1
            }
          }).then(res1 => {
            console.log(res1);
            if(res1.code == 1){

              this.$alert('上传成功，请等待审核', '提示', {
                confirmButtonText: '返回农场列表',
                center: true,
                callback: action => {
                  that.$router.push({path:"/farmList"})
                }
              });
            }else{
              layer.msg(res1.msg)
            }
          })
        }
      }
    },
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/perfect.less";
</style>
