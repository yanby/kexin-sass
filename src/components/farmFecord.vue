<template>
    <div class="farmFecord">
      <Header></Header>
      <div class="title">
        <div class="w1200">
          <div class="title-left">
            <span><router-link to="farmList">农场列表</router-link> > <router-link :to="{path:'/farmDetail',query:{id:farmId}}">{{farmName}}</router-link> > 产品信用详情</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="msg clearfix">
            <div class="msg-left fl">
              <h4> <span></span>{{creditBatchInfo.cropName}} {{creditBatchInfo.variety}}</h4>
              <div class="msg-detail clearfix">
                <div class="zuowu fl">
                  <div class="img"><img :src="creditBatchInfo.img" alt=""></div>
                  <div class="txt">{{creditBatchInfo.createTime}}批次</div>
                </div>
                <div class="fenshu fl">
                  <div class="code" v-if="creditStatus">{{creditBatchInfo.source}}分</div>
                  <div class="code-no" v-else>授信后 <br/>展示</div>
                  <div class="txt">作物信用分</div>
                </div>
                <div class="xinyong fl">
                  <div v-if="creditStatus">
                    <div class="icon" v-if="creditBatchInfo.noOrganic==1">
                      <div v-if="creditBatchInfo.source >90"><span></span><span></span><span></span></div>
                      <div v-else-if="creditBatchInfo.source > 80 && creditBatchInfo.source < 90"><span></span><span></span></div>
                      <div v-else-if="creditBatchInfo.source > 60 && creditBatchInfo.source < 80"><span></span></div>
                      <div v-else-if="creditBatchInfo.source <= 60"></div>
                    </div>
                    <div class="icon1" v-else-if="creditBatchInfo.organic==1">
                      <div v-if="creditBatchInfo.source >90"><span></span><span></span><span></span></div>
                      <div v-else-if="creditBatchInfo.source > 80 && creditBatchInfo.source < 90"><span></span><span></span></div>
                      <div v-else-if="creditBatchInfo.source > 60 && creditBatchInfo.source < 80"><span></span></div>
                      <div v-else-if="creditBatchInfo.source <= 60"></div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="code-no">授信后 <br/>展示</div>
                  </div>
                  <div class="txt">信用等级<span title="可信农产品信用评价体系，用于区分作物信用级别
                  "></span></div>
                </div>
              </div>
            </div>
            <div class="msg-right fr clearfix">
              <dl class="zong fl">
                <dt>{{creditBatchInfo.workStakCount}}条</dt>
                <dd>该产品信誉数据总量</dd>
              </dl>
              <dl class="yichang fl">
                <dt>{{creditBatchInfo.abnormalDataCount}}条</dt>
                <dd>异常数据</dd>
              </dl>
            </div>
          </div>
          <div class="list">
            <div class="list-title">
              <span class="icon" @click="active=0" :class="{'cur':active==0}"><b></b>农事生产记录信用记录</span>
              <span class="icon1" @click="active=1" :class="{'cur':active==1}"><i></i>检测报告</span>
              <div class="radio clearfix" v-if="active==0" @change="pickedFun">
                <div class="one fl">
                  <input type="radio" id="one" value="0" v-model="picked">
                  <label for="one">全部</label>
                </div>
                <div class="two fl">
                  <input type="radio" id="two" value="1" v-model="picked">
                  <label for="two">只看异常</label>
                </div>
              </div>
            </div>
            <div class="list-jilu" v-if="active==0">
              <div class="list-head">
                <span>农事环节</span>
                <span>图片</span>
                <span>详细信息</span>
              </div>
              <div class="list-body">
                <ul class="clearfix" v-for="item in creditBatchInfo.batchInfoTakes">
                  <li>{{item.workName}}</li>
                  <li>
                    <viewer :images="item.imgs">
                      <img v-for="src in item.imgs" :src="src" :key="src" width="50">
                    </viewer>
                  </li>
                  <li>{{item.content}}</li>
                </ul>
              </div>
            </div>
            <div class="list-baogao" v-else-if="active==1 && creditStatus">
              <el-carousel arrow="hover" indicator-position="outside" height="842px">
                <el-carousel-item v-for="item in reports" :key="item.img">
                  <img :src="item.img" alt="">
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="other" v-if="!creditStatus">
            <div class="txt">若查看更多农事记录，需授信后方可查看</div>
            <div class="btn" @click="shouxinFun">发起授信</div>
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
        unusual: "",//异常数据
        batchId: "",//作物ID
        farmId: "",//农场id
        farmName: "",
        active: 0,//TAB切换
        picked: 0,//全部异常
        creditStatus: "",//授信状态
        creditBatchInfo:"",//作物信息
        reports:"",//监测报告
      }
    },
    components: {
      Header
    },
    mounted(){
      this.batchId = this.$route.query.batchId;
      this.farmId = this.$route.query.farmId;
      this.init()
    },
    methods: {
      init(){
        this.$http({
          url: '/index/getSassCreditBatchInfo',
          method: 'post',
          params: {
            batchId: this.batchId,
            farmId: this.farmId,
            unusual: this.unusual
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.creditStatus = res.objs.creditStatus;
            this.creditBatchInfo = res.objs.creditBatchInfo;
            this.reports = res.objs.reports;
            this.farmName =  res.objs.farmName;
          }else{
            layer.msg(res.msg)
          }
        })
      },
      pickedFun(){
        if(this.picked == 0){
          this.unusual = ""
        }else{
          this.unusual = "unusual"
        }
        this.init()
      },
      //点击发起授信
      shouxinFun(){
        if(this.creditStatus){
          this.$http({
            url: '/credit/startCredit',
            method: 'post',
            params:{
              kxFarm: id,
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              this.init()
            }else{
              layer.msg(res.msg)
            }
          })
        }else{
          this.$confirm('您尚未进行采购商认证，请先上传资料完成认证', '提示', {
            confirmButtonText: '去上传',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.init()
          })
        }
      },
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/farmFecord.less";
</style>
