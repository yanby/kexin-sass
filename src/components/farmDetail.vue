<template>
    <div class="farmDetail">
      <Header></Header>
      <!--创建一个echarts的容器-->
      <div class="echarts" v-show="echarts">
        <div class="echarts-wrap" @click="echarts = false"></div>
        <div class="echarts-msg">
          <div id="myChart1"></div>
          <div id="myChart2"></div>
        </div>
      </div>

      <div class="title">
        <div class="w1200">
          <div class="title-left">
            <span><router-link to="farmList">农场列表</router-link> > {{sassCreditFarmInfo.name}}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="base clearfix">
            <div class="base-left fl">
              <h3><img :src="sassCreditFarmInfo.log" alt=""><b :title="sassCreditFarmInfo.name">{{sassCreditFarmInfo.name}} </b><i title="企业信誉认证符号：蓝色角标表示已完成认证"></i><s v-if="sassCreditFarmInfo.organicBatchCount > 0"></s><em v-if="sassCreditFarmInfo.onOrganicBatchCount > 0"></em></h3>
              <div class="img"><img :src="sassCreditFarmInfo.represent" alt=""></div>
              <div class="btn-yes" v-if="creditStatus"><span>已授信</span><b @click="cancalShowxin(sassCreditFarmInfo.id)">取消</b></div>
              <div v-else class="btn" @click="shouxinFun(sassCreditFarmInfo.id)">发起授信</div>
            </div>
            <div class="base-right fr">
              <ul>
                <li class="clearfix">
                  <div class="icon fl">
                    <div class="img"></div>
                    <div class="txt">基本信息</div>
                  </div>
                  <div class="msg fl">
                    <div class="txt">
                      <span v-if="sassCreditFarmInfo.city">区域：{{sassCreditFarmInfo.city}}{{sassCreditFarmInfo.districtTown}}</span>
                      <span v-else>区域：暂无</span>
                      <span v-if="sassCreditFarmInfo.operatingDateStr">时间：{{sassCreditFarmInfo.operatingDateStr}}成立</span>
                      <span v-else>时间：暂无</span>
                      <span>营业执照: <a :href="sassCreditFarmInfo.userQuaBusiness" v-if="creditStatus" target="_blank">点击查看</a><b v-else>授信后可查看</b></span>
                    </div>
                    <div class="txt">
                      <span>总面积: <i>{{sassCreditFarmInfo.area}}亩</i></span>
                      <span>种植标准: <em v-if="sassCreditFarmInfo.onOrganicBatchCount>0" title="种植标准：无化学农药、化肥、人工合成激素"></em><s v-if="sassCreditFarmInfo.organicBatchCount>0" title="种植标准：合理使用化学农药、化肥、人工合成激素"></s></span>
                    </div>
                  </div>
                </li>
                <li class="clearfix">
                  <div class="icon icon1 fl">
                    <div class="img"></div>
                    <div class="txt">信誉详情</div>
                  </div>
                  <div class="msg fl">
                    <div class="txt">
                      <span>农场信用分: <i v-if="sassCreditFarmInfo.onOrganicBatchCount > 0">{{sassCreditFarmInfo.onOrganicScoreInt}} <em></em></i> <i v-if="sassCreditFarmInfo.organicBatchCount > 0">{{sassCreditFarmInfo.organicScoreInt}} <s></s></i></span>
                      <span>农场信用分走势: <a href="javascript:;" v-if="creditStatus" @click="echarts=true">点击查看</a><b v-else>授信后可查看</b></span>
                      <span>农场可信面积: <i v-if="creditStatus">{{sassCreditFarmInfo.kexinScale}}</i><b v-else>授信后可查看</b></span>
                    </div>
                    <div class="txt">
                      <span>所有作物品种: <i>{{sassCreditFarmInfo.plantCropNum}}</i></span>
                      <span>所有可信作物批次  <i>{{sassCreditFarmInfo.batchNum}}</i></span>
                    </div>
                  </div>
                </li>
                <li class="clearfix">
                  <div class="icon icon2 fl">
                    <div class="img"></div>
                    <div class="txt">联系方式</div>
                  </div>
                  <div class="msg fl">
                    <div class="txt">
                      <span>联系人: <i>{{sassCreditFarmInfo.contactsPersion | zanwu}}</i></span>
                      <span>联系方式: <i v-if="creditStatus">{{sassCreditFarmInfo.contactsPhone | zanwu}}</i><b v-else>授信后可查看</b></span>
                      <span>邮箱: <i v-if="creditStatus">{{sassCreditFarmInfo.contactsMail | zanwu}}</i><b v-else>授信后可查看</b></span>
                    </div>
                    <div class="txt">
                      <span class="other">农场地址: <i v-if="creditStatus">{{sassCreditFarmInfo.path | zanwu}}</i><b v-else>授信后可查看</b></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="zuowu-wrap">
            <div class="select-title">所有可信作物（{{batchPages.total}}）</div>
            <div class="select clearfix">
              <div class="select-left fl">
                <span>排序：</span>
                <span @click="zuixinFun" :class="{'cur':active==0}">最新</span>
                <span @click="xinyuFun" class="icon1" :class="{'cur':active==1}">信誉分 <b></b></span>
              </div>
              <div class="select-right fr">
                <span>筛选：</span>
                <el-select v-model="zuowu" placeholder="请选择作物" @change="zuowuFun">
                  <el-option value="全部">全部</el-option>
                  <el-option
                    v-for="item in crops"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="biaozhun" placeholder="请选择种植标准" @change="biaozhunFun">
                  <el-option value="全部">全部</el-option>
                  <el-option
                    v-for="item in biaozhunList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="zuowu-list">
              <ul class="clearfix">
                <li class="clearfix" v-for="item in batchPages.list" @click="goFarmFecord(item)">
                  <div class="img fl"><img :src="item.img" alt=""></div>
                  <div class="txt fl">
                    <h4><span>{{item.cropName}}</span> <b>{{item.variety}}</b></h4>
                    <div class="zuowu-txt clearfix">
                      <div class="zuo-left fl">
                        <div class="time">{{item.createTime}}批次</div>
                        <div class="icon" v-if="item.noOrganic==1">
                          <div v-if="item.kxBatchScore >90"><span></span><span></span><span></span></div>
                          <div v-else-if="item.kxBatchScore > 80 && item.kxBatchScore < 90"><span></span><span></span></div>
                          <div v-else-if="item.kxBatchScore > 60 && item.kxBatchScore < 80"><span></span></div>
                          <div v-else-if="item.kxBatchScore <= 60"></div>
                        </div>
                        <div class="icon1" v-else-if="item.organic==1">
                          <div v-if="item.kxBatchScore >90"><span></span><span></span><span></span></div>
                          <div v-else-if="item.kxBatchScore > 80 && item.kxBatchScore < 90"><span></span><span></span></div>
                          <div v-else-if="item.kxBatchScore > 60 && item.kxBatchScore < 80"><span></span></div>
                          <div v-else-if="item.kxBatchScore <= 60"></div>
                        </div>
                      </div>
                      <div class="zuowu-right fr" >
                        <div class="xinyu" v-if="creditStatus">
                          <div class="green" v-if="item.kxBatchScore >90">
                            <div class="color">{{item.kxBatchScore}}分</div>
                            <div class="color-txt">信誉极佳</div>
                          </div>
                          <div class="cyan" v-else-if="item.kxBatchScore > 80 && item.kxBatchScore < 90">
                            <div class="color">{{item.kxBatchScore}}分</div>
                            <div class="color-txt">信誉优等</div>
                          </div>
                          <div class="yellow" v-else-if="item.kxBatchScore > 70 && item.kxBatchScore < 80">
                            <div class="color">{{item.kxBatchScore}}分</div>
                            <div class="color-txt">信誉一般</div>
                          </div>
                          <div class="orange" v-else-if="item.kxBatchScore > 60 && item.kxBatchScore < 70">
                            <div class="color">{{item.kxBatchScore}}分</div>
                            <div class="color-txt">信誉较差</div>
                          </div>
                          <div class="red" v-else-if="item.kxBatchScore <= 60">
                            <div class="color">{{item.kxBatchScore}}分</div>
                            <div class="color-txt">信誉极差</div>
                          </div>
                        </div>
                        <div class="xinyu" v-else>
                          <div class="gray">
                            <div class="color">授信后<br/>展示</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="page">
              <el-pagination background layout="prev, pager, next"
                             :current-page="curPage"
                             :page-size="pageSize"
                             :total="totalCount"
                             @current-change="handleCurrentChange">
              </el-pagination>
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
        id: "",
        url: "",
        zuowu: "",
        biaozhun: "",
        fenshu: "",
        batchPages: "",//列表集合
        sassCreditFarmInfo: "",//农场集合
        creditStatus: "",//是否授信
        curPage: 1,//起始第几页
        pageSize: 12, //每页数据量【必传】
        pageNum: 1, //页码从1开始【必传】
        totalCount: 0,//总数
        crops: "",//作物集合
        active: 0,
        echarts: false,
        biaozhunList:[{name:"无化学农药、化肥、激素",value:"organic"},{name:"合理使用化学农药、化肥、激素",value:"noOrganic"}],
        kxFarmOrganicScoreInfo: "",//有机集合
        kxFarmNoOrganicScoreInfo: "",//绿色集合
      }
    },
    components: {
      Header
    },
    mounted(){
      this.id = this.$route.query.id;
      this.url = this.$route.query.url;
      if(this.url){
        $('html,body').animate({scrollTop:"500px"},500);
      }


      this.init()
      this.content()
    },
    updated(){

    },
    filters: {
      zanwu: function (value) {
        if (value != "" && value != "null"){
          return value;
        } else{
          return "暂无"
        }
      }
    },
    methods: {
      init(){
        this.$http({
          url: '/index/getCreditFarmInfo',
          method: 'post',
          params: {
            farmId: this.id
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.sassCreditFarmInfo = res.objs.sassCreditFarmInfo;
            this.kxFarmOrganicScoreInfo = res.objs.sassCreditFarmInfo.kxFarmOrganicScoreInfo;
            this.kxFarmNoOrganicScoreInfo = res.objs.sassCreditFarmInfo.kxFarmNoOrganicScoreInfo;
            this.creditStatus = res.objs.creditStatus;
            this.crops = res.objs.crops

            if(this.creditStatus){
              this.drawLine1();
              this.drawLine2();
            }
          }else{
            layer.msg(res.msg)
          }
        })
      },
      content(){
        this.$http({
          url: '/index/getSassCreditBatch',
          method: 'post',
          params: {
            farmId: this.id,
            page: this.pageNum,//第几页
            limit: this.pageSize,//每页/条 数据
            crop: this.zuowu,
            organic: this.biaozhun,
            sort: this.fenshu
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.batchPages = res.objs.batchPages;
            this.totalCount = res.objs.batchPages.total;
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //取消授信
      cancalShowxin(id){
        this.$confirm('您将取消对该农场的授信', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$http({
            url: '/credit/cancelCredit',
            method: 'post',
            params: {
              farmId: id
            }
          }).then(res => {
            console.log(res);
            if(res.code == 1){
              layer.msg("取消成功")
              this.init()
              this.content()
            }else{
              layer.msg(res.msg)
            }
          })
        })
      },
      //有机走势图
      drawLine1(){
        var time = [];
        var scode = [];
        this.kxFarmOrganicScoreInfo.forEach((item,index)=>{
          time.push(item.createTime)
          scode.push(item.score)
        })
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('myChart1'))
        // 绘制图表
        myChart.setOption({
          color: ['#69BC19'],
          title: { text: '有机信用分走势'},
          tooltip: {},
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: scode,
            type: 'line',
            areaStyle: {}
          }]
        });
      },
      //绿色走势图
      drawLine2(){
        var time = [];
        var scode = [];
        this.kxFarmNoOrganicScoreInfo.forEach((item,index)=>{
          time.push(item.createTime)
          scode.push(item.score)
        })
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('myChart2'))
        // 绘制图表
        myChart.setOption({
          color: ['#69BC19'],
          title: { text: '绿色信用分走势'},
          tooltip: {},
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: scode,
            type: 'line',
            areaStyle: {}
          }]
        });
      },
      //作物筛选
      zuowuFun(){
        if(this.zuowu == "全部"){
          this.zuowu = "";
        }
        this.content()
      },
      //种植标准筛选
      biaozhunFun(){
        if(this.biaozhun == "全部"){
          this.biaozhun = "";
        }
        this.content()
      },
      //最新排序
      zuixinFun(){
        this.active = 0;
        this.fenshu = "";
        this.content()
      },
      //信誉分排序
      xinyuFun(){
        this.active = 1;
        if(this.fenshu != "kx_batch_score desc"){
          this.fenshu = "kx_batch_score desc"
          $(".select-left .icon1").addClass("cur");
          $(".select-left .icon1").removeClass("on");
        }else{
          this.fenshu = "kx_batch_score asc";
          $(".select-left .icon1").addClass("on");
          $(".select-left .icon1").removeClass("cur");
        }
        this.content()
      },
      //点击发起授信
      shouxinFun(id){
        this.$http({
          url: '/credit/startCredit',
          method: 'post',
          params:{
            kxFarm: id,
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            layer.msg("发送成功")
            this.init()
            this.content()
          }else if(res.code == -30){
            this.$confirm('您尚未进行采购商认证，请先上传资料完成认证', '提示', {
              confirmButtonText: '去上传',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$router.push({path:"/perfect"})
            })
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //分页
      handleCurrentChange(val){
        console.log(val)
        this.pageNum = val;
        this.content();
        $('html,body').animate({scrollTop: 100},100);
      },
      //跳转作物详情
      goFarmFecord(item){
        window.open("/farmFecord?batchId=" + item.id + "&farmId=" + this.id);
//        this.$router.push({path:"/farmFecord",query:{batchId:item.id,farmId: this.id}})
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/farmDetail.less";
</style>
