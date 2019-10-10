<template>
    <div class="message">
      <Header></Header>
      <div class="title">
        <div class="w1200">
          <div class="title-left">
            <span>消息中心</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="msg">
            <h3>
              <span>有 <b>{{unreadNum}}</b> 条未读消息</span>
              <span class="fr" @click="allReadFun">标为全部已读</span>
            </h3>
            <div class="list">
              <dl @click="listFun(item,index)" v-for="(item,index) in buyerMsgs">
                <dt><span>{{item.title}} </span><b>{{item.createTime}}</b><i v-if="item.readsStatus==0"></i></dt>
                <dd>{{item.msg}}<router-link to="perfect" v-if="item.type=='auditing'">去处理</router-link></dd>
              </dl>
            </div>
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
        read: "",//已读信息
        buyerMsgs: "",//消息列表
        unreadNum: "",//已读信息
      }
    },
    components: {
      Header
    },
    mounted(){
      this.init()
    },
    methods: {
      init(){
        this.$http({
          url: '/user/getBuyerMsg',
          method: 'post',
          params: {
            read: this.read
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.buyerMsgs = res.objs.buyerMsgs
            this.unreadNum = res.objs.unreadNum
          }else{
            layer.msg(res.msg)
          }
        })
      },
      listFun(item,index){
        this.$http({
          url: '/user/buyerMsgRead',
          method: 'post',
          params: {
            id: item.id
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            $(".list dl").eq(index).addClass("cur").siblings().removeClass("cur");
            this.init()
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //点击全部
      allFun(){
        this.active = 0;
        this.read = "";
        this.init()
      },
      //点击未读
      noFun(){
        this.active = 1;
        this.read = 0;
        this.init()
      },
      //点击全部已读
      allReadFun(){
        this.$http({
          url: '/user/buyerMsgAllRead',
          method: 'post',
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.init()
          }else{
            layer.msg(res.msg)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/message.less";
</style>
