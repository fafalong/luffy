<template>
  <el-card class="box-card">
    <MyBread leavl1="商品管理" leavl2="商品参数"></MyBread>

    <el-alert :closable="false" title="只允许添加第三级分类" type="warning" center show-icon style="margin-top: 15px;"></el-alert>

    <el-form style="margin-top: 15px;">
      <el-form-item label="商品分类：">
        <el-cascader :options="categoriesList" v-model="selectCategories" :props="defaultProps"
                     @change="handleChange" clearable></el-cascader>
      </el-form-item>
    </el-form>

    <!--添加按钮-->
    <el-button type="primary"  @click.prevent="showAddUser">添加按钮</el-button>

    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-table :data="dynamicAttr" style="width: 80%">
          <el-table-column type="expand">
            <template v-slot="dynamicAttr">
              <el-tag :key="index" v-for="(tag,index) in dynamicAttr.row.attr_vals"
                      closable :disable-transitions="false"
                      @close="handleClose(dynamicAttr.row,tag)">{{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="newTag" ref="saveTagInput" size="small"
                        @keyup.enter.native="handleInputConfirm(dynamicAttr.row)"
                        @blur="handleInputConfirm(dynamicAttr.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" min-width>
            <template v-slot="dynamicAttr">
              <el-button type="primary" plain round icon="el-icon-edit"
                         @click.prevent="showEditUser(dynamicAttr.row)"></el-button>
              <el-button type="primary" plain round icon="el-icon-delete"
                         @click.prevent="delUser(dynamicAttr.row.id)"></el-button>
              <el-button type="primary" plain round icon="el-icon-plus"
                         @click="showUserRole(dynamicAttr.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-table :data="staticAttr" style="width: 80%">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
          <el-table-column label="操作" min-width>
            <template v-slot="dynamicAttr">
              <el-button type="primary" plain round icon="el-icon-edit"
                         @click.prevent="showEditUser(dynamicAttr.row)"></el-button>
              <el-button type="primary" plain round icon="el-icon-delete"
                         @click.prevent="delUser(dynamicAttr.row.id)"></el-button>
              <el-button type="primary" plain round icon="el-icon-plus"
                         @click="showUserRole(dynamicAttr.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-tab-pane>
    </el-tabs>


  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        active: "1",
        // 级联选择器绑定数据
        categoriesList: [],
        selectCategories: [],
        defaultProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        dynamicAttr: [],
        staticAttr: [],
        inputVisible: false,
        newTag: '',
      }
    },
    methods: {


      // 点击 + 按钮
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      // 回车键 or 失去焦点
      async handleInputConfirm(attr) {
        console.log(attr)

        let inputValue = this.newTag;
        if (inputValue) {
          attr.attr_vals.push(inputValue);

          let attrDate = {
            attr_name: attr.attr_name,
            attr_sel: 'many',
            attr_vals: attr.attr_vals.join(','),
          }

          const res = await this.$http.put(`categories/${this.selectCategories[2]}/attributes/${attr.attr_id}`, attrDate)

          const {meta: {msg, status}} = res.data

          if (status === 200) {

            this.$message.success(msg);

          } else {
            // 登录失败，提示失败消息
            this.$message.error(msg);
          }
        }
        this.inputVisible = false;
        this.newTag = ''


      },

      // 删除tag
      async handleClose(attr, tag) {
        console.log(attr.attr_vals)
        // console.log(tag)
        attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);

        // :id	分类 ID	不能为空携带在url中
        // attr_name	参数名称	不能为空
        // attr_sel	[only,many]	不能为空
        // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔

        let attrDate = {
          attr_name: attr.attr_name,
          attr_sel: 'many',
          attr_vals: attr.attr_vals.join(','),
        }

        const res = await this.$http.put(`categories/${this.selectCategories[2]}/attributes/${attr.attr_id}`, attrDate)


        const {meta: {msg, status}} = res.data

        if (status === 200) {

          this.$message.success(msg);

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }

      },

      // 获取商品的动态参数列表
      async getDynamicAttr() {
        const res = await this.$http.get(`categories/${this.selectCategories[2]}/attributes/?sel=many`)

        const {data, meta: {msg, status}} = res.data
        this.dynamicAttr = data

        console.log(res)

        this.dynamicAttr.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          // console.log(item.attr_vals)
        })

      },

      // 获取商品的静态参数列表
      async getStaticAttr() {
        const res = await this.$http.get(`categories/${this.selectCategories[2]}/attributes/?sel=only`)

        // console.log(res)
        const {data, meta: {msg, status}} = res.data
        this.staticAttr = data

        // this.staticAttr.forEach(item => {
        //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        //   // console.log(item.attr_vals)
        // })
      },

      // 点击静态参数 标签 获取静态参数值
      handleClick() {
        if (this.active === '2') {
          if (this.selectCategories.length === 3) {

            this.getStaticAttr()

          } else {
            this.staticAttr = []
            this.$message.error("请先选三级分类");
          }
        }

      },

      // 点击动态参数 标签 获取动态参数值
      handleChange() {

        if (this.selectCategories.length === 3) {
          this.getDynamicAttr()
        } else {
          this.dynamicAttr = []
          this.$message.error("请先选三级分类");


        }
      },

      // 获取级联选择器的值
      async getCategoriesList() {

        const res = await this.$http.get(`categories/?type=3`)

        // console.log(res)

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

    created() {
      this.getCategoriesList()
    },

  }
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
