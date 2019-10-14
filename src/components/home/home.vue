<template>

  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple"><img src="" alt="无法显示图片"></div>
        </el-col>
        <el-col :span="18" class="middle">
          <h3> luffy 冲鸭 </h3>
        </el-col>
        <el-col :span="2" class="loginout">
          <a href="" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">

        <el-menu class="el-menu-vertical-demo" router unique-opened active-text-color>
          <!--1级菜单-->
          <el-submenu :index="item1.order + ''" v-for="(item1, index) in menuList" :key="index">
            <template slot="title">
              <i v-if="item1.authName == '用户管理'" class="el-icon-news"></i>
              <i v-if="item1.authName == '权限管理'" class="el-icon-setting"></i>
              <i v-if="item1.authName == '商品管理'" class="el-icon-goods"></i>
              <i v-if="item1.authName == '订单管理'" class="el-icon-tickets"></i>
              <i v-if="item1.authName == '数据统计'" class="el-icon-menu"></i>
              <span>{{ item1.authName}}</span>
            </template>
            <!--2级菜单-->
            <el-menu-item-group>
              <el-menu-item :index="item2.path" v-for="(item2, index) in item1.children" :key="index">
                <i class="el-icon-location"></i>{{ item2.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>

      </el-aside>

      <el-main class="main">
        <router-view/>
      </el-main>

    </el-container>
  </el-container>

</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
      }
    },
    beforeCreate() {
      // 获取token
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')

      if (!token) {
        this.$router.push({name: 'login'})
      }
    },
    created() {
      this.getMenus()
    },
    methods: {
      logout() {
        // 清除token值
        localStorage.clear()
        // 跳转到登录页面
        this.$router.push({name: 'login'})
        // 弹出提示消息
        this.$message.success("退出成功");
      },
      async getMenus() {

        const res = await this.$http.get(`menus`)

        // 结构化赋值
        const {data, meta: {msg, status}} = res.data

        console.log(data)

        this.menuList = data

        if (status === 200) {

          // this.$message.success(msg);

        } else {

          this.$message.error(msg);

        }
      },

    },

    filters:{
      ToMenuIcon(v){

      },
    },
  }
</script>

<style>

  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }

  .aside {
    background-color: #d3dce6;
    height: 100%;
  }

  .main {
    background-color: #e9eef3;
    height: 100%;
  }

  /*头部样式*/
  .middle {
    text-align: center;
  }

  .loginout {
    line-height: 60px;
    text-decoration: none;
  }

</style>
