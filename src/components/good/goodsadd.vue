<template>
  <el-card class="box-card">
    <MyBread leavl1="商品管理" leavl2="商品列表"></MyBread>


    <el-alert :closable="false" title="添加商品信息" type="success" center show-icon style="margin-top: 15px;"></el-alert>

    <el-steps :active="active * 1" align-center style="margin-top: 15px;">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <el-form :model="goodInfo">
      <el-tabs v-model="active" tab-position="left" style="height:600px; margin-top: 15px; overflow: auto"
               @tab-click="tabChange">
        <el-tab-pane name="1" label="基本信息" style="width:80%;">
          <el-form-item label="商品名称" >
            <el-input v-model.trim="goodInfo.goods_name" auto-complete="off"  ></el-input>
          </el-form-item>
          <el-form-item label="商品价格" >
            <el-input v-model.trim="goodInfo.goods_price" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="商品重量" >
            <el-input v-model.trim="goodInfo.goods_weight" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="商品数量" >
            <el-input v-model.trim="goodInfo.goods_number" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="demonstration">商品分类</span>
            <div>
              <el-cascader :options="categoriesList" v-model="selectCategories" :props="defaultProps"
                           @change="handleChange" clearable></el-cascader>
            </div>
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name + ':'" v-for="(item1,index) in dynamicAttr" :key="index">
            <el-checkbox-group v-model="item1.attr_vals">
              <span>{{"大"}}</span>
              <div>
                <el-checkbox border :label="item2" v-for="(item2,index) in item1.attr_vals" :key="index"></el-checkbox>
              </div>
            </el-checkbox-group>

          </el-form-item>


        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,index) in staticAttr" :key="index">
            <el-input v-model.trim="item.attr_vals" auto-complete="off" label-width="180px"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <quillEditor></quillEditor>
            <el-button type="primary" style="margin-top: 15px;" @click="addGoods">添加按钮</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </el-card>
</template>

<script>

  // 局部使用富文本编辑器
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor} from 'vue-quill-editor'


  export default {
    data() {
      return {
        active: "1",
        goodInfo: {
          goods_name: "",
          goods_cat: "",
          goods_price: -1,
          goods_number: -1,
          goods_weight: -1,
          pics: [],
          attrs: [],
        },
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
        headers: {
          Authorization: localStorage.getItem('token')
        },
      }
    },

    created() {
      this.getCategoriesList()

    },
    methods: {

      // 添加商品
      async addGoods() {

        // 商品分类 处理
        this.goodInfo.goods_cat = this.selectCategories.join(',')

        // 商品图片路径 处理

        // 商品d参数 处理
        let arr1 = this.dynamicAttr.map((item)=>{
          return {attr_id:item.attr_id, attr_vals:item.attr_vals}
        })
        let arr2 = this.staticAttr.map((item)=>{
          return {attr_id:item.attr_id, attr_vals:item.attr_vals}
        })

        this.goodInfo.attrs = [...arr1,...arr2]


        const res = await this.$http.post(`goods`, this.goodInfo)

        console.log(res)

        const {data, meta: {msg, status}} = res.data

        if (status === 201) {
          // 获取成功，提示消息

          this.$message.success(msg);
          this.$router.push({name: 'goods'})

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }
      },

      // 图片预览
      handlePreview(file) {
        console.log(1)
        console.log(file)

      },

      // 图片删除
      handleRemove(file) {
        console.log(2)
        console.log(file)

        let Index = this.goodInfo.pics.findIndex((item)=>{
          if(item.pics === file.response.data.tmp_path){
            this.goodInfo.pics.splice(Index, 1)
            // console.log(this.goodInfo.pics)
          }

        })
      },

      // 图片上传成功
      handleSuccess(file) {
        console.log(3)
        console.log(file)

        const {data, meta: {msg, status}} = file

        if (status === 200) {

          this.goodInfo.pics.push({
            pic: data.tmp_path
          })

          this.$message.success(msg);

        } else {

          this.$message.error(msg);

        }

      },

      // 点击切换标签
      tabChange() {
        if (this.active === '2') {
          if (this.selectCategories.length !== 3) {
            this.$message.error("请先选择商品的三级分类")
            return
          }
          this.getDynamicAttr()
        } else if (this.active === '3') {

          if (this.selectCategories.length !== 3) {
            this.$message.error("请先选择商品的三级分类")
            return
          }
          this.getStaticAttr()
        }

      },

      // 获取商品的动态参数列表
      async getDynamicAttr() {
        const res = await this.$http.get(`categories/${this.selectCategories[2]}/attributes/?sel=many`)

        console.log(res)
        const {data, meta: {msg, status}} = res.data
        this.dynamicAttr = data

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

      //获取商品分类列表
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

      handleChange() {

      },
    },
    components: {
      quillEditor
    }

  }
</script>

<style>
  .ql-editor {
    height: 400px;
  }
</style>
