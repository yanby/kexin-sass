<template>
    <div class="account">
      <Header></Header>
      <div class="title">
        <div class="w1200">
          <div class="title-left">
            <span>账户信息</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="list">
            <ul>
              <li><span>公司名称</span><b>{{objs.name}}</b></li>
              <li><span>企业编号</span><b>{{objs.number}}</b></li>
              <!--<li><span>所在城市</span><b>{{objs.city}}</b></li>-->
              <li><span>负责人联系方式</span><b>{{objs.phone}}</b><i @click="changePhone">更换</i></li>
              <li><span>负责人邮箱</span><b>{{objs.mail}}</b></li>
              <li><span>密码</span><b>******</b><router-link to="updatePassword">更换</router-link></li>
            </ul>
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
        objs: ""
      }
    },
    components: {
      Header
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.$http({
          url: '/user/getUserBuyerInfo',
          method: 'post',
        }).then(res => {
          console.log(res);
          if(res.code == 1){
           this.objs = res.objs.buyer
          }else{
            layer.msg(res.msg)
          }
        })
      },
      changePhone(){
        this.$prompt('请输入新的手机号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^1[3456789]\d{9}$/,
          inputErrorMessage: '手机格式不正确'
        }).then(({ value }) => {
          this.$http({
            url: '/user/updateBuyerPhone',
            method: 'post',
            params:{
              phone: value
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              layer.msg("修改成功")
              this.init()
            }else{
              layer.msg(res.msg)
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/account.less";
</style>
