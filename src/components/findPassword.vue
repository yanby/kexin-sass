<template>
  <div class="findPassword">
    <Header></Header>
    <div class="w1200">
      <div class="title">
        欢迎使用可信农场——采购商管理中心
        <span></span>
      </div>
      <div class="content clearfix">
        <div class="left">
          <div class="url"><a href="http://wxfarms.fpchy.com">可信农场官网</a></div>
        </div>
        <div class="right">
          <div class="biaoti">
            <span>找回密码</span>
          </div>
          <ul class="write">
            <li><input type="text" placeholder="请输入企业编号" v-model="name"></li>
            <li><input type="text" placeholder="请输入注册时的企业邮箱" v-model="email"></li>
            <li class="other">
              <input type="text" placeholder="请输入邮箱验证码" v-model="code">
              <button v-show="sendCode" @click="getAuthCode">获取验证码</button>
              <button v-show="!sendCode">{{sendTime}}s后重新获取</button>
            </li>
            <li><input type="password" placeholder="密码(英文+数字组合，最少8位字符)" v-model="password"></li>
            <li><input type="password" placeholder="请确认密码" v-model="repeatPassword"></li>
          </ul>
          <div class="btn" @click="go">重置密码</div>
          <div class="back"><router-link to="login">返回登录</router-link></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from './header.vue'
  export default {
    data () {
      return {
        name: "",//企业名称
        password: "",//密码
        email: "",//邮箱
        code: "",//验证码
        password: "",//密码
        repeatPassword: "",//重复密码
        sendCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        sendTime: 0, /*倒计时 计数器*/
      }
    },
    components: {
      Header
    },
    methods: {
      //控制弹窗
      tiaokuanModalShow(){
        this.tiaokuanModal = true
      },
      tiaokuanModalHide(){
        this.tiaokuanModal = false
      },
      //点击获取验证码
      getAuthCode() {
        var that = this;
        var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(this.name == ""){
          layer.msg("企业名称不能为空！")
          return
        }else if(this.email == ""){
          layer.msg("企业邮箱不能为空！")
          return
        }else if(!emailReg.test(this.email)){
          layer.msg("企业邮箱格式错误！")
          return
        }else{
          this.sendCode = false;
          this.sendTime = 300;
          var auth_timetimer = setInterval(()=> {
            that.sendTime--;
            if (that.sendTime <= 0) {
              that.sendCode = true;
              clearInterval(auth_timetimer);
            }
          }, 1000);
          this.$http({
            url: '/user/sendUpdatePasswordVailMail',
            method: 'post',
            params: {
              mail: this.email,
              buyerCode: this.name
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              layer.msg("请到您的邮箱查看验证码")
            }else{
              that.sendCode = true;
              clearInterval(auth_timetimer);
              layer.msg(res.msg)
            }
          })
        }
      },
      //点击登录
      go(){
        var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        var passwordReg = /^(\w){8,20}$/;
        if(this.name == ""){
          layer.msg("企业编号不能为空！")
          return
        }else if(this.email == ""){
          layer.msg("企业邮箱不能为空！")
          return
        }else if(!emailReg.test(this.email)){
          layer.msg("企业邮箱格式错误！")
          return
        }else if(this.code == ""){
          layer.msg("验证码不能为空！")
          return
        }else if(this.password == ""){
          layer.msg("请输入密码！")
          return
        }else if(!passwordReg.test(this.password)){
          layer.msg("密码格式错误，应为英文+数字组合格式！")
          return
        }else if(this.repeatPassword != this.password){
          layer.msg("密码不一致！")
          return
        }else{
          this.$http({
            url: '/user/updatePassword',
            method: 'post',
            params: {
              mail: this.email,
              buyerCode: this.name,
              code: this.code,
              password: this.password
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              layer.msg("重置密码成功")
            }else{
              layer.msg(res.msg)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/findPassword.less";
</style>
