<template>
  <el-card class="box-card">
    <MyBread leavl1="商品管理" leavl2="商品分类"></MyBread>

    <!--添加按钮-->
    <el-button type="primary" style="margin-top: 15px;" @click.prevent="showAddUser">添加按钮</el-button>

    <el-table :data="categoriesList" border stripe style=" margin-top: 15px;">
      <el-tree-grid prop="cat_name" label="分类名称" treeKey="cat_id" parentKey="cat_pid"
        levelKey="cat_level" childKey="children" :indentSize="30" folder-icon="">
      </el-tree-grid>
      <el-table-column prop="cat_level" label="层级">
        <template v-slot="categoriesList">
          <span v-if="categoriesList.row.cat_level === 0">一级</span>
          <span v-else-if="categoriesList.row.cat_level === 1">二级</span>
          <span v-else-if="categoriesList.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否可用">
        <template v-slot="categoriesList">
          {{ categoriesList.row.cat_deleted ? '无效' : '有效'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width>
        <template v-slot="userList">
          <el-button type="primary"  plain round icon="el-icon-edit"
                     @click.prevent="showEditUser(userList.row)"></el-button>
          <el-button type="primary"  plain round icon="el-icon-delete"
                     @click.prevent="delUser(userList.row.id)"></el-button>
          <el-button type="primary"  plain round icon="el-icon-check"
                     @click="showUserRole(userList.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>


  </el-card>
</template>

<script>



  var ElTreeGrid = require('element-tree-grid');

    export default {
      data(){
        return {
          categoriesList: [],
        }
      },
      created() {
        this.getCategoriesList()
      },
      methods:{
        // 获取级联选择器的值
        async getCategoriesList() {

          const res = await this.$http.get(`categories/?type=3`)

          console.log(res)

          const {data, meta: {msg, status}} = res.data

          if (status === 200) {
            // 获取成功，提示消息
            this.categoriesList = data

            // this.$message.success(msg);

          } else {
            // 登录失败，提示失败消息
            this.$message.error(msg);
          }
        },
      },
      components:{
        ElTreeGrid
      },
    }
</script>

<style>

</style>
