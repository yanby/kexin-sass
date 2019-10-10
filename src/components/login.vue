<template>
    <div class="login">
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
              <span>登录</span>
              <div class="register"><b>没有账号？</b> <router-link to="register">点击注册</router-link></div>
            </div>
            <ul class="write">
              <li><input type="text" placeholder="企业编号" v-model="mark"></li>
              <li><input type="text" placeholder="注册企业的邮箱" v-model="email"></li>
              <li><input type="password" placeholder="密码" v-model="password"></li>
            </ul>
            <div class="wangji">
              <label for="label">
                <input type="checkbox" id="label" v-model="checkVal">记住我
              </label>
              <router-link to="findPassword">忘记密码?</router-link>
            </div>
            <div class="btn" @click="go">登录</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import Header from './header.vue'
  export default {
    name: '',
    data () {
      return {
        mark: localStorage.mark || "",//企业编号
        email: localStorage.email || "",//注册企业的邮箱
        password: localStorage.password || "",//密码
        checkVal: "",//记住我
        name: "",//公司名称
      }
    },
    components: {
      Header
    },
    mounted(){
      if(localStorage.token){
        this.$router.push({path:"/farmList"})
      }
    },
    methods: {
      //点击登录
      go(){
        var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        var passwordReg = /^(\w){8,20}$/;
        if(this.mark == ""){
          layer.msg("企业编号不能为空！")
          return
        }else if(this.email == ""){
          layer.msg("邮箱不能为空！")
          return
        }else if(!emailReg.test(this.email)){
          layer.msg("邮箱格式不正确！")
          return
        }else if(this.password == ""){
          layer.msg("请输入密码！")
          return
        }else if(!passwordReg.test(this.password)){
          layer.msg("密码格式不正确！")
          return
        }else{
          this.$http({
            url: '/user/userLogin',
            method: 'post',
            params: {
              buyerCode: this.mark,
              username: this.email,
              password: this.password
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              layer.msg("登录成功")
              if(this.checkVal){
                localStorage.mark = this.mark;
                localStorage.email = this.email;
                localStorage.password = this.password;
              }
              localStorage.token = res.objs.token;
              localStorage.name = res.objs.buyer.name;
              this.$router.push({path: "/farmList"})
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
  @import "../../static/css/login.less";
</style>
