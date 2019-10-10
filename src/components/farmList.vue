<template>
      <div class="farmList">
      <Header></Header>
      <div class="title">
        <div class="w1200 clearfix">
          <div class="title-left fl">
            <span>农场列表 </span><b>全部农场数</b><i> {{objs.farmCount}}</i>
          </div>
          <div class="title-right fr">
              <div class="yishouxin">
              已授信 <b> {{objs.creditNum}}</b>
              <div class="shouxin-yes">
                <h4>已授信的农场 </h4>
                <ul>
                  <li v-for="item in creditsYes"><span @click="goDeatail(item.kxFarm)" :title="item.kxFarmName">{{item.kxFarmName}}</span><b>{{item.updateTime}} 授信成功</b><i @click="cancalShowxin(item.kxFarm)">取消授信</i></li>
                </ul>
              </div>
            </div>
            <div class="shouxinzhong">
              授信中 <b> {{objs.creditIngNum}}</b>
              <div class="shouxin-no">
                <h4>授信中的农场 </h4>
                <ul>
                  <li v-for="item in creditsIng"><span @click="goDeatail(item.kxFarm)" :title="item.kxFarmName">{{item.kxFarmName}}</span><b>{{item.updateTime}} 发送</b><i @click="shouxinFun(item.kxFarm)">再次发送</i></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w1200">
        <div class="content">
          <div class="shaixuan clearfix">
            <div class="shaixuan-left fl">
              <span>排序：</span>
              <span @click="zuixinFun" :class="{'cur':active==2}">最新发布(默认）</span>
              <span @click="scoreFun" class="icon1" :class="{'cur':active==0}">信誉分 <b></b></span>
              <span @click="operatingDateFun" class="icon2" :class="{'cur':active==1}">农场经营时长 <b></b></span>
            </div>
            <div class="shaixuan-right fr">
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
                  v-for="item in objs.kxCrops"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="list">
            <ul class="clearfix">
              <li class="clearfix fl" v-for="item in pageInfo">
                <div class="user fl">
                  <div class="img"><img :src="item.represent" alt=""></div>
                </div>
                <div class="msg fl">
                  <div class="msg-title clearfix" @click="goDeatail(item.id)">
                    <div class="img fl">
                      <img :src="item.log" alt="">
                      <b v-if="item.status==1"></b>
                    </div>
                    <div class="name fl">
                      <h4><span :title="item.name">{{item.name}}</span></h4>
                      <h5><span>{{item.operatingYear}}年</span><b>{{item.area}}亩</b></h5>
                    </div>
                    <div class="address fl" v-if="item.city">
                      <span><b></b>{{item.city}}</span>
                    </div>
                  </div>
                  <div class="fenshu">
                    <h4>农场信用分 </h4>
                    <div class="num">
                      <div class="youji">
                        <span v-if="item.organicScoreInt!=0">{{item.organicScoreInt}}</span>
                        <b v-if="item.onOrganicScoreInt!=0">{{item.onOrganicScoreInt}}</b>
                      </div>
                      <div class="lvse">
                        <span v-if="item.organicScoreInt!=0"></span><b v-if="item.onOrganicScoreInt!=0"></b>
                      </div>
                    </div>
                  </div>
                  <div class="zuowu">
                    <h4>可信作物 <a href="javascript:;" @click="goDeatail(item.id)">全部 ></a></h4>
                    <div class="zuowu-list clearfix">
                      <div class="zuowu-item fl" v-for="item1 in item.cropInfo">
                       <div class="img"> <img :src="item1.cropImg" alt=""></div>
                        <span>{{item1.cropName}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="shuzi clearfix">
                    <div class="shuliang fl">
                      <div class="txt">授信数量</div>
                      <div class="jia"><span>{{item.creditNum}}</span><b>家</b></div>
                    </div>
                    <div class="join fl">
                      <div class="txt">加入可信农场</div>
                      <div class="tian"><span>{{item.createDay}}</span><b>天</b></div>
                    </div>
                  </div>
                  <div class="shouquan" v-if="item.creditStatus==-1">
                    <span>未授信</span><b @click="shouxinFun(item.id)">发起授信</b>
                  </div>
                  <div class="shouquan" v-else-if="item.creditStatus==0 || item.creditStatus==1">
                    <span>授信中</span><b @click="shouxinFun(item.id)">再次发送</b>
                  </div>
                  <div class="shouquan" v-else-if="item.creditStatus==2">
                    <i>已授信</i>
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
</template>

<script type="text/ecmascript-6">
  import { regionDataPlus,CodeToText } from 'element-china-area-data'
  import Header from './header.vue'
  export default {
    name: '',
    data () {
      return {
        active: 2,//点击筛选
        zuowu: "",//作物筛选
        quyu:"",//区域筛选
        objs: "",//集合
        creditsIng:"",//授信中
        creditsYes:"",//授信中
        curPage: 1,//起始第几页
        pageSize: 4, //每页数据量【必传】
        pageNum: 1, //页码从1开始【必传】
        totalCount: 0,//总数
        pageInfo: "",//作物列表
        sort: "",//排序
        city: "",//市
        province: "",//省
        districtTown: "",//区
        options: regionDataPlus,
        selectedOptions: [],
      }
    },
    components: {
      Header
    },
    mounted(){
//      var allCity = { label:'全部', value: ''}
//      var fl = true
//      this.options.forEach((item,index)=>{
//        if(item.label == ''){
//          item.label = 111
//        }
//        if(item.label == '全部'){
//          fl = false
//        }
//        if(item.label == '台湾省'){
//          this.options.splice(index,1)
//        }
//      })
//      if(fl){
//        this.options.unshift(allCity)
//      }
      this.init()
      this.content()
      this.shouxinzhongFun()
      this.yishouxinFun()
    },
    methods: {
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
      content(){
        this.$http({
          url: '/index/getSassFarmInfo',
          method: 'post',
          params:{
            page: this.pageNum,//第几页
            limit: this.pageSize,//每页/条 数据
            sort: this.sort,
            province: this.province,
            city: this.city,//城市
            districtTown: this.districtTown,//区
            crop: this.zuowu,//作物id
          }
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.totalCount = res.objs.pageInfo.total
            this.pageInfo = res.objs.pageInfo.list
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //授信中农场
      shouxinzhongFun(){
        this.$http({
          url: '/index/getCreditIngFarm',
          method: 'post',
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.creditsIng = res.objs.credits
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //已授信的农场
      yishouxinFun(){
        this.$http({
          url: '/index/getCreditFarm',
          method: 'post',
        }).then(res => {
          console.log(res);
          if(res.code == 1){
            this.creditsYes = res.objs.credits
          }else{
            layer.msg(res.msg)
          }
        })
      },
      //三级联动
      addressChange(arr) {
        this.province = CodeToText[arr[0]];
        this.city = CodeToText[arr[1]];
        this.districtTown = CodeToText[arr[2]];
        if(this.city == "市辖区"){
          this.city =  ""
        }
        console.log(this.province)
        console.log(this.city)
        console.log(this.districtTown)
        this.content()
      },
      //时长排序
      operatingDateFun(){
        this.active = 1;
        if(this.sort != "operating_date asc"){
          this.sort = "operating_date asc"
          $(".shaixuan-left .icon2").addClass("cur")
          $(".shaixuan-left .icon2").removeClass("on")
        }else{
          this.sort = "operating_date desc";
          $(".shaixuan-left .icon2").addClass("on")
          $(".shaixuan-left .icon2").removeClass("cur")
        }
        this.content()
      },
      //信誉分排序
      scoreFun(){
        this.active = 0;
        if(this.sort != "score desc"){
          this.sort = "score desc"
          $(".shaixuan-left .icon1").addClass("cur")
          $(".shaixuan-left .icon1").removeClass("on")
        }else{
          this.sort = "score asc";
          $(".shaixuan-left .icon1").addClass("on")
          $(".shaixuan-left .icon1").removeClass("cur")
        }
        this.content()
      },
      //最新排序
      zuixinFun(){
        this.active = 2;
        this.sort = "";
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
            this.shouxinzhongFun()
            this.yishouxinFun()
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
              this.shouxinzhongFun()
              this.yishouxinFun()
            }else{
              layer.msg(res.msg)
            }
          })
        })
      },
      //跳转详情页面
      goDeatail(id){
        window.open("/farmDetail?id=" + id + "&url=farmList");
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/farmList.less";
</style>
