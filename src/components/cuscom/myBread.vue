<template>

  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{leavl1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{leavl2}}</el-breadcrumb-item>
  </el-breadcrumb>

</template>

<script>

  export default {
    name: 'MyBread',
    data() {
      return {}
    },
    props: ['leavl1', 'leavl2'],

  }
</script>


<style>

</style>
