<template>
    <div class="updatePassword">
      <Header></Header>
      <div class="title">
        <div class="w1200">
          <div class="title-left">
            <span><router-link to="account">账户信息</router-link> > 修改密码</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="list">
            <ul>
              <li><span><i>*</i>请输入原密码</span><input type="password" placeholder="请输入原密码" v-model="oldPassword"></li>
              <li><span><i>*</i>请输入新密码</span><input type="password" v-model="newPassword" placeholder="新密码（英文+数字组合，最少8位字符）"></li>
              <li><span><i>*</i>确认新密码</span><input type="password" v-model="repeatPassword" placeholder="请确认新密码"></li>
            </ul>
            <div class="btn" @click="go">保存新密码</div>
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
        active: 0,
        oldPassword: "",//旧密码
        newPassword: "",//新密码
        repeatPassword: "",//重复密码
      }
    },
    components: {
      Header
    },
    methods: {
      go(){
        var passwordReg = /^[a-zA-Z0-9]{8,21}$/;

        if(this.oldPassword == ""){
          layer.msg("请输入旧密码！")
          return
        }else if(this.newPassword == ""){
          layer.msg("请输入新密码！")
          return
        }else if(!passwordReg.test(this.newPassword)){
          layer.msg("密码格式错误，应为英文+数字组合格式！")
          return
        }else if(this.repeatPassword != this.newPassword){
          layer.msg("新密码不一致！")
          return
        }else{
          this.$http({
            url: '/user/updateUserPassword',
            method: 'post',
            params: {
              password: this.oldPassword,
              newPassword: this.newPassword
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              layer.msg("保存成功")
              localStorage.clear();
              this.$router.push({path: "/login"})
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
  @import "../../static/css/updatePassword.less";
</style>
