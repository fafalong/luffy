<template>
  <el-card class="box-card">

    <!--面包屑-->
    <MyBread leavl1="用户管理" leavl2="用户列表"></MyBread>

    <!--搜索框-->
    <el-input placeholder="请输入内容" class="input-search" v-model="query" clearable @change="clearList">
      <el-button icon="el-icon-search" slot="append" @click.prevent="searchUser"></el-button>
    </el-input>

    <!--添加按钮-->
    <el-button type="primary" style="margin-top: 15px;" @click.prevent="showAddUser">添加按钮</el-button>

    <!--表单展示-->
    <!--<el-table :data="userList" border stripe style=" margin-top: 15px;" :default-sort="{prop: 'create_time', order: 'descending'}">-->
    <el-table :data="userList" border stripe style=" margin-top: 15px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <template v-slot="userList">
          {{userList.row.create_time | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template v-slot="userList">
          <el-switch v-model="userList.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                     @change="changeMgState(userList.row)"></el-switch>
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

    <!--添加用户-模态对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogAddUser">
      <el-form :model="userInfo">
        <el-form-item label="用户名">
          <el-input v-model.trim="userInfo.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model.trim="userInfo.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model.trim="userInfo.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model.trim="userInfo.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelAddUser">取 消</el-button>
        <el-button type="primary" @click.prevent="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑用户-模态对话框-->
    <el-dialog title="编辑用户" :visible.sync="dialogEditUser">
      <el-form :model="userInfo">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model.trim="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model.trim="userInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelEditUser">取 消</el-button>
        <el-button type="primary" @click.prevent="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--分配角色-模态对话框-->
    <el-dialog title="用户角色管理" :visible.sync="dialogUserRole">
      <el-form :model="userInfo">
        <el-form-item label="用户名:">
          {{userInfo.username}}
        </el-form-item>

        <el-select v-model="currentRole" placeholder="请选择">
          <el-option label="请选择" :value="-1"></el-option>
          <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName" :value="item.id"></el-option>
        </el-select>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelUserRole">取 消</el-button>
        <el-button type="primary" @click.prevent="UserRole">确 定</el-button>
      </div>
    </el-dialog>


  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        userList: [],
        query: '',
        pageList: [5, 10, 15, 20],
        pageNum: 1,
        pageSize: 10,
        total: -1,
        dialogAddUser: false,
        dialogEditUser: false,
        dialogUserRole: false,
        userInfo: {
          id: '',
          username: '',
          email: '',
          mobile: '',
          mg_state: '',
          password: '',
        },
        roleList: [],
        currentRole: -1,
      }
    },
    created() {
      this.getUserList()
    },
    methods: {

      // 获取当前用户的角色
      async getUserRole() {

        // 发送请求数据
        const res = await this.$http.get(`users/${this.userInfo.id}`)

        // console.log(res.data)

        // 结构化赋值
        const {data: {id, rid}, meta: {msg, status}} = res.data

        if (status === 200) {
          // 获取成功，提示消息
          this.currentRole = rid

          // this.$message.success(msg);

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }
      },

      // 获取全部角色
      async getRoleList() {

        // 发送请求数据
        const res = await this.$http.get(`roles`)

        // console.log(res)

        // 结构化赋值
        const {data, meta: {msg, status}} = res.data

        if (status === 200) {
          // 获取成功，提示消息
          this.roleList = data

          // console.log(this.roleList)

          // this.$message.success(msg);

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }
      },

      // 取消用户角色分配
      cancelUserRole() {
        this.dialogUserRole = false

        // 清空文本框
        this.userInfo = {}
      },

      // 用户角色分配
      async UserRole() {

        // 发送请求数据
        const res = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.currentRole})

        // console.log(res)

        const {data, meta: {msg, status}} = res.data

        if (status === 200) {
          // 获取成功，提示消息
          this.$message.success(msg)

          // 清空文本框
          this.userInfo = {}

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }

        // 关闭对话框
        this.dialogUserRole = false

      },

      // 打开分配角色对话框
      showUserRole(user) {

        this.dialogUserRole = true

        this.userInfo = user

        // 获取钱角色列表
        this.getRoleList()

        // 获取当前用户角色
        this.getUserRole()
      },

      // 修改用户状态
      async changeMgState(user) {

        // console.log(user.id)
        // console.log(user.mg_state)
        // console.log(user)

        // 发送请求数据
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)

        // console.log(res)

        const {data, meta: {msg, status}} = res.data

        if (status === 200) {
          // 获取成功，提示消息
          this.$message.success(msg)

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }

      },

      // 取消编辑
      cancelEditUser() {

        this.dialogEditUser = false

        // 清空文本框
        this.userInfo = {}

      },

      // 编辑用户
      async editUser() {

        // 发送请求数据
        const res = await this.$http.put(`users/${this.userInfo.id}`, this.userInfo)

        const {data, meta: {msg, status}} = res.data

        if (status === 200) {
          // 获取成功，提示消息
          this.$message.success(msg)

          // 更新数组
          this.getUserList()

          // 清空文本框
          this.userInfo = {}

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }

        // 关闭对话框
        this.dialogEditUser = false

      },

      // 打开编辑用户对话框
      showEditUser(user) {

        this.dialogEditUser = true
        // console.log(user)

        // 直接赋值就会出现问题，点击取消时，编辑后的内容也会显示在页面上
        // this.userInfo = user
        // console.log(this.userInfo)

        // ES6 浅拷贝
        this.userInfo = Object.assign({}, user);
      },

      // 删除用户
      delUser(userId) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          // 发送请求数据
          const res = await this.$http.delete(`users/${userId}`)
          // console.log(res)

          const {meta: {msg, status}} = res.data


          if (status === 200) {

            // 删除成功，提示消息
            this.$message.success(msg);
            this.pageNum = 1
            this.getUserList()

          }

        }).catch(() => {

          this.$message.info("已取消删除")

        });
      },

      // 取消添加
      cancelAddUser() {
        this.dialogAddUser = false

        // 清空文本框
        this.userInfo = {}
      },

      // 添加用户
      async addUser() {

        // 发送请求数据
        const res = await this.$http.post(`users`, this.userInfo)

        // console.log(res)
        const {data, meta: {msg, status}} = res.data

        if (status === 201) {
          // 获取成功，提示消息
          this.$message.success(msg)

          // 更新数组
          this.getUserList()

          // 清空文本框
          this.userInfo = {}

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }

        // 关闭对话框
        this.dialogAddUser = false


      },

      // 打开编辑用户对话框
      showAddUser() {
        this.dialogAddUser = true
        this.userInfo = {}
      },

      // 情况输入框，重新获取数据
      clearList() {
        this.getUserList()
      },

      // 搜索用户
      searchUser() {
        this.getUserList()
      },

      // 每页展示条数变化触发
      handleSizeChange(val) {
        this.pageNum = 1
        this.pageSize = val
        this.getUserList()
      },

      // 当前页改变触发
      handleCurrentChange(val) {
        this.pageNum = val
        this.getUserList()
      },

      // 获取用户列表数据
      async getUserList() {

        // 发送请求数据
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`)

        // console.log(res)

        // 结构化赋值
        const {data: {users, total}, meta: {msg, status}} = res.data

        // console.log(res)

        if (status === 200) {
          // 获取成功，提示消息
          this.userList = users
          this.total = total
          // this.$message.success(msg);
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
