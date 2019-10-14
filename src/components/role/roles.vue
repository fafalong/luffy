<template>

  <el-card class="box-card">

    <!--面包屑-->
    <MyBread leavl1="权限管理" leavl2="角色列表"></MyBread>

    <!--添加按钮-->
    <el-button type="primary" style="margin-top: 15px;" @click="showAddRole">新增</el-button>

    <!--表单展示-->
    <el-table :data="roleList" border stripe style=" margin-top: 15px;">
      <el-table-column label="#" type="expand">
        <template v-slot="roleList">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row v-for="(item1, index) in roleList.row.children" :key="index">
              <el-col :span="4">
                <el-tag closable type="info" @close="delRight(roleList.row,item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item2, index) in item1.children" :key="index">
                  <el-col :span="4">
                    <el-tag @close="delRight(roleList.row,item2.id)" closable type="success">{{ item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i></el-col>
                  <el-col :span="20 ">
                    <el-row>
                      <el-col :span="4"></el-col>
                      <el-col :span="20">
                        <el-tag closable @close="delRight(roleList.row,item3.id)"
                                v-for="(item3, index) in item2.children" :key="index">{{item3.authName}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="roleList.row.children.length===0"> 该角色暂未分配权限</el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="level" label="操作">
        <template v-slot="roleList">
          <el-button type="primary" plain round icon="el-icon-edit"
                     @click.prevent="showEditRole(roleList.row)">编辑</el-button>
          <el-button type="primary" plain round icon="el-icon-delete"
                     @click.prevent="delRole(roleList.row.id)">删除</el-button>
          <el-button type="primary" plain round icon="el-icon-check"
                     @click="showEditRight(roleList.row)">修改权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑角色-模态对话框-->
    <el-dialog title="编辑角色" :visible.sync="dialogEditRole">
      <el-form :model="roleInfo">
        <el-form-item label="角色名称">
          <el-input v-model.trim="roleInfo.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model.trim="roleInfo.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelEditRole">取 消</el-button>
        <el-button type="primary" @click.prevent="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增角色-模态对话框-->
    <el-dialog title="新增角色" :visible.sync="dialogAddRole">
      <el-form :model="roleInfo">
        <el-form-item label="角色名称">
          <el-input v-model.trim="roleInfo.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model.trim="roleInfo.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelAddRole">取 消</el-button>
        <el-button type="primary" @click.prevent="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--设置权限-模态对话框-->
    <el-dialog title="修改权限" :visible.sync="dialogEditRight">
      <el-tree ref="tree" :data="rightList" show-checkbox node-key="id"
               :default-expanded-keys="defaultExpandKeys"
               :default-checked-keys="defaultCheckedKeys"
               :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelEditRight">取 消</el-button>
        <el-button type="primary" @click.prevent="editRight">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>

</template>

<script>
  export default {

    data() {
      return {
        dialogEditRole:false,
        dialogAddRole:false,
        dialogEditRight: false,
        roleList: [],
        rightList: [],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        defaultExpandKeys: [],
        defaultCheckedKeys: [],
        currentRoleId:-1,
        roleInfo:{
          roleName:"",
          roleDesc:"",
        },
      }
    },
    created() {
      this.getRoleList()

    },
    methods: {

      // 删除角色
      delRole(roleId){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          // 发送请求数据
          const res = await this.$http.delete(`roles/${roleId}`)
          // console.log(res)

          const {meta: {msg, status}} = res.data


          if (status === 200) {

            // 删除成功，提示消息
            this.$message.success(msg);
            this.getRoleList()

          }

        }).catch(() => {

          this.$message.info("已取消删除")

        });
      },

      // 取消编辑角色
      cancelEditRole(){

        this.dialogEditRole = false
      },

      // 编辑角色
      async editRole(){
        const res = await this.$http.put(`roles/${this.currentRoleId}`, this.roleInfo)

        const {data, meta: {msg, status}} = res.data

        if (status===200){

          this.getRoleList()

        } else {

          this.$message.error(msg);
        }

        this.dialogEditRole = false
      },

      // 打开编辑角色的对话框
      showEditRole(role){

        this.roleInfo = Object.assign({},role)

        this.currentRoleId = role.id

        this.dialogEditRole = true
      },

      // 取消新增角色
      cancelAddRole(){

        this.dialogAddRole = false
      },

      // 新增角色
      async addRole(){
       const res = await this.$http.post(`roles`, this.roleInfo)

        const {data, meta: {msg, status}} = res.data

        if (status===201){

          this.getRoleList()

        } else {

          this.$message.error(msg);
        }

        this.dialogAddRole = false
      },

      // 打开新增角色的对话框
      showAddRole(){
        this.roleInfo = {}
        this.dialogAddRole = true
      },

      // 取消编辑权限的对话框
      cancelEditRight() {
        this.dialogEditRight = false
      },

      // 编辑提交权限的对话框
      async editRight() {

        let checkKeys = this.$refs.tree.getCheckedKeys()
        let checkHalfKeys = this.$refs.tree.getHalfCheckedKeys()
        let checkAllKeys = [...checkKeys, ...checkHalfKeys]

        // console.log(checkKeys)
        // console.log(checkHalfKeys)
        // console.log(checkAllKeys)

        const res = await this.$http.post(`roles/${this.currentRoleId}/rights`,{rids: checkAllKeys.join(',')})

        const {data, meta:{msg, status}} = res.data

        if (status === 200){

          this.getRoleList()

          this.dialogEditRight = false

          this.$message.success(msg);

        } else {
          this.$message.error(msg);
        }
      },

      // 打开编辑权限的对话框
      showEditRight(role) {

        this.currentRoleId = role.id

        this.dialogEditRight = true

        // 获取全部的权限
        this.getRightList(role)
      },

      // 获取权限
      async getRightList(role) {

        const res = await this.$http.get(`rights/tree`)

        const {data, meta: {msg, status}} = res.data

        this.rightList = data

        // 获取全部的权限
        // 遍历第1层
        let temp1 = []
        this.rightList.forEach(v1 => {
          temp1.push(v1.id)
          // 遍历第2层
          v1.children.forEach(v2 => {
            temp1.push(v2.id)
            // 遍历第3层
            v2.children.forEach(v3 => {
              temp1.push(v3.id)
            })
          })
        });
        this.defaultExpandKeys = temp1

        // 获取当前用户的权限
        // 遍历第1层
        let temp2 = []
        role.children.forEach(v1 => {
          // temp2.push(v1.id)
          // 遍历第2层
          v1.children.forEach(v2 => {
            // temp2.push(v2.id)
            // 遍历第3层
            v2.children.forEach(v3 => {
              temp2.push(v3.id)
            })
          })
        });
        this.defaultCheckedKeys = temp2

        if (status === 200) {

          this.$message.success(msg)

        } else {

          this.$message.error(msg)

        }

      },

      // 删除权限
      async delRight(role, rightId) {

        const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

        const {data, meta: {msg, status}} = res.data

        console.log(data)

        if (status === 200) {

          role.children = data

          this.$message.success(msg)

        } else {

          this.$message.error(msg)

        }

      },

      // 获取全部角色列表
      async getRoleList() {

        const res = await this.$http.get(`roles`)

        const {data, meta: {msg, status}} = res.data

        // console.log(res.data)

        this.roleList = data

      },

    },
  }
</script>

<style>

</style>
