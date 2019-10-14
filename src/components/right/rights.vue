<template>
  <el-card class="box-card">

    <MyBread leavl1="权限管理" leavl2="权限列表"></MyBread>

    <!--表单展示-->
    <el-table :data="rightList" border stripe style=" margin-top: 15px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template v-slot="rightList">
          {{rightList.row.level | digitalToChinese }}
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        rightList: [],
      }
    },
    created() {
      this.getRightList()
    },

    methods: {
      // 获取用户列表数据
      async getRightList() {

        // 发送请求数据
        const res = await this.$http.get(`rights/list`)

        // 结构化赋值
        const {data, meta: {msg, status}} = res.data

        if (status === 200) {
          // 获取成功，提示消息
          this.rightList = data

          this.$message.success(msg);
        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }
      }

    },

    filters: {
      digitalToChinese(v) {
        if (v === "1") {
          return "一级"
        }
        else if(v === "2"){
          return "二级"
        }
        else {
          return "三级"
        }
      },
    },

  }
</script>

<style>

</style>
