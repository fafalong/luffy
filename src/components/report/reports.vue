<template>
  <!-- 用来初始化 Echarts 的区域 -->
  <el-card class='box-card area'>
    <MyBread leavl1="数据统计" leavl2="数据报表"></MyBread>

    <div ref='ecartsArea' style='width: 800px; height: 500px'></div>
  </el-card>
</template>

<script>
  import echarts from 'echarts'

  export default {
    data () {
      return {
        option: {}
      }
    },
    methods: {
      async loadData () {
        const { data: { data } } = await this.$http.get(`reports/type/1`)
        const optionEcharts = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          }
        }
        this.option = {...data, ...optionEcharts}
        // console.log(this.option)

        const charts = echarts.init(this.$refs.ecartsArea)
        charts.setOption(this.option)
      }
    },
    created () {
      this.loadData()
    }
  }
</script>

<style>
  .area {
    margin-top: 20px
  }
</style>
