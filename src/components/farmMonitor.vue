<template>
    <div class="farmMonitor">
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
            <span>信誉监控</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="w1200">
          <div class="base clearfix">
            <div class="base-left fl">
              <div class="img"></div>
              <div class="txt"><span>农场总数</span><b>{{creditMonitoringInfo.farmCount}}</b></div>
            </div>
            <div class="base-right fl clearfix">
              <dl class="fl">
                <dt>{{creditMonitoringInfo.batchCount}}</dt>
                <dd>总监控批次总量<span title="所有已授信农场所有作物数量"></span></dd>
              </dl>
              <dl class="fl">
                <dt>{{creditMonitoringInfo.workInfoCount}}</dt>
                <dd>信用数据总量(条)<span title="所有已授信农场所有监控作物信用记录总量"></span></dd>
              </dl>
              <dl class="fl orange">
                <dt>{{creditMonitoringInfo.floatCount}}</dt>
                <dd>作物信誉降幅偏大(15日)<span title="相隔两次评分作物分数降低在10分及以上"></span></dd>
              </dl>
              <dl class="fl red">
                <dt>{{creditMonitoringInfo.warnCount}}</dt>
                <dd>食品安全风险严重 <span  title="批次分数60分及以下"></span></dd>
              </dl>
            </div>
          </div>
          <div class="zuowu-wrap">
            <div class="select clearfix">
              <div class="select-left fl">
                <span>排序：</span>
                <span @click="zuixinFun" :class="{'cur':active==0}">最新</span>
                <span class="icon1" @click="scoreFun" :class="{'cur':active==1}">信用分 <b></b></span>
              </div>
              <div class="select-right fr">
                <span>筛选：</span>
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="selectedOptions"
                  @change="addressChange"
                  placeholder="请选择市区"
                >
                </el-cascader>
                <el-select v-model="zuowu" placeholder="请选择作物" @change="zuowuFun">
                  <el-option value="全部">全部</el-option>
                  <el-option
                    v-for="item in crops"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="farm-list clearfix" v-for="item in farmList">
              <div class="farm-left fl">
                <h4 class="clearfix">
                  <div class="img fl"><img :src="item.log" alt=""><i></i></div>
                  <span class="name fl">{{item.name}}</span>
                  <span class="addree" v-if="item.city"><b></b>{{item.city}}</span>
                </h4>
                <h5>
                  <i v-if="item.operatingYear">{{item.operatingYear}}年</i>
                </h5>
                <div class="img"><img :src="item.represent" alt=""></div>
                <div class="txt"><span>已授信</span></div>
              </div>
              <div class="farm-right fr">
                <div class="fenshu clearfix">
                  <dl class="num">
                    <dt>农场信用分</dt>
                    <dd>
                      <div class="youji">
                        <span v-if="item.organicScoreInt!=0">{{item.organicScoreInt}}</span>
                        <b v-if="item.onOrganicScoreInt!=0">{{item.onOrganicScoreInt}}</b>
                      </div>
                      <div class="lvse">
                        <span v-if="item.organicScoreInt!=0"></span><b v-if="item.onOrganicScoreInt!=0"></b>
                      </div>
                    </dd>
                  </dl>
                  <dl class="zoushi">
                    <dt>信用走势（7日）</dt>
                    <dd @click="zoushiFun(item)"></dd>
                  </dl>
                  <dl class="green">
                    <dt>可信作物批次</dt>
                    <dd>{{item.batchCount}}</dd>
                  </dl>
                  <dl class="orange">
                    <dt>信用分降幅偏大作物</dt>
                    <dd>{{item.floatCount}}</dd>
                  </dl>
                  <dl class="red">
                    <dt>信食品安全风险严重</dt>
                    <dd>{{item.warnCount}}</dd>
                  </dl>
                </div>
                <div class="zuowu">
                  <h3>农场作物 <a href="javascript:;" @click="goDeatail(item.id)">全部</a></h3>
                  <ul class="clearfix">
                    <li class="clearfix" v-for="(item1,index1) in item.cropInfo" @click="goFarmFecord(item1,item)">
                      <div class="img fl"><img :src="item1.cropImg" alt=""></div>
                      <div class="txt fl">
                        <h4>{{item1.cropName}} {{item1.variety}}</h4>
                        <div class="zuowu-txt clearfix">
                          <div class="zuowu-left fl">
                            <div class="time">{{item1.createTime}}批次</div>
                            <div class="icon" v-if="item1.noOrganic==1">
                              <div v-if="item1.score >90"><span></span><span></span><span></span></div>
                              <div v-else-if="item1.score > 80 && item1.score < 90"><span></span><span></span></div>
                              <div v-else-if="item1.score > 60 && item1.score < 80"><span></span></div>
                              <div v-else-if="item1.score <= 60"></div>
                            </div>
                            <div class="icon1" v-else-if="item1.organic==1">
                              <div v-if="item1.score >90"><span></span><span></span><span></span></div>
                              <div v-else-if="item1.score > 80 && item1.score < 90"><span></span><span></span></div>
                              <div v-else-if="item1.score > 60 && item1.score < 80"><span></span></div>
                              <div v-else-if="item1.score <= 60"></div>
                            </div>
                          </div>

                          <div class="zuowu-right fr">
                            <div class="xinyu fl">
                              <div class="green" v-if="item1.score >90">
                                <div class="color">{{item1.score}}分</div>
                                <div class="color-txt">信誉极佳</div>
                              </div>
                              <div class="cyan" v-else-if="item1.score > 80 && item1.score < 90">
                                <div class="color">{{item1.score}}分</div>
                                <div class="color-txt">信誉优等</div>
                              </div>
                              <div class="yellow" v-else-if="item1.score > 70 && item1.score < 80">
                                <div class="color">{{item1.score}}分</div>
                                <div class="color-txt">信誉一般</div>
                              </div>
                              <div class="orange" v-else-if="item1.score > 60 && item1.score < 70">
                                <div class="color">{{item1.score}}分</div>
                                <div class="color-txt">信誉较差</div>
                              </div>
                              <div class="red" v-else-if="item1.score <= 60">
                                <div class="color">{{item1.score}}分</div>
                                <div class="color-txt">信誉极差</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
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
  import { regionData,CodeToText } from 'element-china-area-data'
  import Header from './header.vue'
  export default {
    name: '',
    data () {
      return {
        echarts: false,
        active: 0,
        zuowu: "",//作物
        quyu: "",//区域
        fenshu: "",//分数
        creditMonitoringInfo: "",//头部数据
        crops: "",//作物列表
        city: "",//城市
        sort: "",//排序
        districtTown: "",//区
        options: regionData,
        selectedOptions: [],
        curPage: 1,//起始第几页
        pageSize: 2, //每页数据量【必传】
        pageNum: 1, //页码从1开始【必传】
        totalCount: 0,//总数
        farmList: "",//农场列表
        kxFarmOrganicScoreInfo: "",//有机集合
        kxFarmNoOrganicScoreInfo: "",//绿色集合
      }
    },
    components: {
      Header
    },
    mounted(){
      var allCity = { label:'全部', value: ''}
      var fl = true
      this.options.forEach((item,index)=>{
        if(item.label == ''){
          item.label = 111
        }
        if(item.label == '全部'){
          fl = false
        }
        if(item.label == '台湾省'){
          this.options.splice(index,1)
        }
      })
      if(fl){
        this.options.unshift(allCity)
      }
      this.init()
      this.content()
    },
    methods: {
      init(){
        this.$http({
          url: '/index/getSassCreditMonitoringInfo',
          method: 'post',
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.creditMonitoringInfo = res.objs.creditMonitoringInfo;
            this.crops = res.objs.crops;
          }else{
            layer.msg(res.msg)
          }
        })
      },
      content(){
        this.$http({
          url: '/index/getSassCreditMonitoringFarm',
          method: 'post',
          params:{
            page: this.pageNum,//第几页
            limit: this.pageSize,//每页/条 数据
            sort: this.sort,
            city: this.city,//城市
            districtTown: this.districtTown,//区
            crop: this.zuowu,//作物id
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            if(res.objs.creditMonitoringFarmPageInfo){
              this.totalCount = res.objs.creditMonitoringFarmPageInfo.total
              this.farmList = res.objs.creditMonitoringFarmPageInfo.list
            }
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //三级联动
      addressChange(arr) {
        this.city = CodeToText[arr[1]];
        this.districtTown = CodeToText[arr[2]];
        if(this.city == "市辖区"){
          this.city = CodeToText[arr[0]]
        }
        console.log(this.city)
        this.content()
      },
      //作物筛选
      zuowuFun(){
        if(this.zuowu == "全部"){
          this.zuowu = "";
        }
        this.content()
      },
      //分页
      handleCurrentChange(val){
        console.log(val)
        this.pageNum = val;
        this.content();
        $('html,body').animate({scrollTop: 100},100);
      },
      //跳转详情页面
      goDeatail(id){
        window.open("/farmDetail?id=" + id);
      },
      //信誉分排序
      scoreFun(){
        this.active = 1;
        if(this.sort != "score desc"){
          this.sort = "score desc"
          $(".select-left .icon1").addClass("cur");
          $(".select-left .icon1").removeClass("on");
        }else{
          this.sort = "score asc";
          $(".select-left .icon1").addClass("on");
          $(".select-left .icon1").removeClass("cur");
        }
        this.content()
      },
      //最新排序
      zuixinFun(){
        this.active = 0;
        this.content()
      },
      //走势点击
      zoushiFun(item){
        this.echarts = true;
        this.drawLine1(item.kxFarmOrganicScoreInfo)
        this.drawLine2(item.kxFarmNoOrganicScoreInfo)
      },
      //有机走势图
      drawLine1(kxFarmOrganicScoreInfo){
        var time = [];
        var scode = [];
        kxFarmOrganicScoreInfo.forEach((item,index)=>{
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
      drawLine2(kxFarmNoOrganicScoreInfo){
        var time = [];
        var scode = [];
        kxFarmNoOrganicScoreInfo.forEach((item,index)=>{
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
      //跳转作物详情
      goFarmFecord(item1,item){
        this.$router.push({path:"/farmFecord",query:{batchId:item1.id,farmId: item.id}})
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/farmMonitor.less";
</style>
