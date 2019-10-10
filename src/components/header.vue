<template>
    <div class="header">
      <div class="w1200 clearfix">
        <div class="logo fl" @click="homeFun">
          <span></span>
        </div>
        <div class="list fl clearfix" v-if="token">
          <ul class="list-page fl clearfix">
            <li :class="{'cur':active1}"><router-link to="farmList">农场列表</router-link></li>
            <li :class="{'cur':active2}"><router-link to="farmMonitor">信誉监控 <b>（{{objs.creditNum}}）</b></router-link></li>
          </ul>
          <div class="qiye fr clearfix">

            <div class="user-msg fr" :title="name"><span>{{oldName}}</span>
              <ul class="list-item">
                <li><router-link to="account">账户信息</router-link></li>
                <li @click="logoutFun">退出</li>
              </ul>
            </div>
            <div class="message fr" @click="messageFun"><span><b v-if="objs.msgNum>0"></b></span></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: '',
        data () {
            return {
              active1: false,
              active2: false,
              token: localStorage.token,
              name: "",
              oldName: "",
              objs: ""
            }
        },
        mounted(){
          var filename = window.location.href;
          if(filename.indexOf("farmList") != -1){
            this.active1 = true;
          }else if(filename.indexOf("farmMonitor") != -1){
            this.active2 = true;
          }else{
            this.active1 = false;
            this.active2 = false;
          }

          if(localStorage.token){
            this.init()
            this.name = localStorage.name;
            if(this.name.length >= 10){
              this.oldName = this.name.slice(0,10) + "..."
            }else{
              this.oldName = this.name;
            }
          }
        },
        methods:{
          init(){
            this.$http({
              url: '/index/getSassIndexInfo',
              method: 'post',
            }).then(res => {
              console.log(res);
              if(res.code == 1){
                this.objs = res.objs
              }else{
                layer.msg(res.msg)
              }
            })
          },
          messageFun(){
            this.$router.push({path:"/message"})
          },
          logoutFun(){
            this.$confirm('确定要退出登录么?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              localStorage.removeItem("token");
              layer.msg("退出成功")
              this.$router.push({path:"/login"})
            })
          },
          homeFun(){
            this.$router.push({path:"/farmList"})
          }
        }
    }
</script>

<style scoped lang="less" type="text/less">
 @import "../../static/css/header.less";
</style>
