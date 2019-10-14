<template>
  <el-card class="box-card">

    <MyBread leavl1="商品管理" leavl2="商品列表"></MyBread>

    <!--搜索框-->
    <el-input placeholder="请输入内容" class="input-search" v-model="query" clearable @change="clearList">
      <el-button icon="el-icon-search" slot="append" @click.prevent="searchGood"></el-button>
    </el-input>

    <!--添加按钮-->
    <el-button type="primary" style="margin-top: 15px;" @click="$router.push({name:'goodsadd'})">添加按钮</el-button>

    <!--表单展示-->
    <el-table :data="goodList" border stripe style=" margin-top: 15px;">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <template v-slot="userList">
          {{userList.row.create_time | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width>
        <template v-slot="userList">
          <el-button type="primary"  plain round icon="el-icon-edit"
                     @click.prevent="showEditUser(goodList.row)"></el-button>
          <el-button type="primary"  plain round icon="el-icon-delete"
                     @click.prevent="delUser(goodList.row.id)"></el-button>
          <el-button type="primary"  plain round icon="el-icon-check"
                     @click="showUserRole(goodList.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页展示-->
    <div class="block" style="margin-top: 15px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageNum"
                     :page-sizes="pageList"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

  </el-card>
</template>

<script>
    export default {
      data(){
        return {
          goodList: [],
          query: '',
          pageList: [5, 10, 15, 20],
          pageNum: 1,
          pageSize: 5,
          total: -1,
        }
      },
      created() {
        this.getGoodList()
      },
      methods:{

        // 情况输入框，重新获取数据
        clearList() {
          this.getGoodList()
        },

        // 搜索用户
        searchGood() {
          this.getGoodList()
        },

        // 每页展示条数变化触发
        handleSizeChange(val) {
          this.pageNum = 1
          this.pageSize = val
          this.getGoodList()
        },

        // 当前页改变触发
        handleCurrentChange(val) {
          this.pageNum = val
          this.getGoodList()
        },

        // 获取用户列表数据
        async getGoodList() {

          // 发送请求数据
          const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`)

          // console.log(res)

          // 结构化赋值
          const {data: {goods, total}, meta: {msg, status}} = res.data

          console.log(res)

          if (status === 200) {
            // 获取成功，提示消息
            this.goodList = goods
            this.total = total
            this.$message.success(msg);
          } else {
            // 登录失败，提示失败消息
            this.$message.error(msg);
          }
        }
      },
    }
</script>

<style>
  .box-card {
    height: 100%;
  }

  .input-search {
    margin-top: 15px;
    width: 500px
  }
</style>
