<template>
  <div class="hello">
    <slide-verify :l="42"
                  :r="10"
                  :w="310"
                  :h="155"
                  @success="onSuccess"
                  @fail="onFail"
                  @refresh="onRefresh"
                  :slider-text="text"
    ></slide-verify>
    <div>{{msg}}</div>
    <div>
      <viewer :images="signImages">
        <img v-for="src in signImages" :src="src" :key="src" width="50">
      </viewer>
    </div>
  </div>

</template>

<script>
  export default {
    name: '',
    data(){
      return {
        msg: '',
        text: '向右滑',
        signImages: [
          'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=85690711,3884201894&fm=27&gp=0.jpg',
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3564877025,796183547&fm=27&gp=0.jpg'
        ]
      }
    },
    mounted(){
      layer.msg("操作成功!");//提示框
    },
    methods: {
      onSuccess(){
        this.msg = 'login success'
      },
      onFail(){

        this.msg = ''
      },
      onRefresh(){
        this.msg = ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
