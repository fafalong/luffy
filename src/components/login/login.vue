<template>
  <div class="login-wrap" :style="note">

    <el-form label-position="top" label-width="80px" :model="loginForm" class="login-form">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input  type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 设置背景图片
        note: {
          backgroundImage: "url(" + require("../../assets/1.jpg") + ")",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        },

        // 登录表单
        loginForm: {
          username: '',
          password: '',
        },
        rules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
        },
      };
    },
    methods: {
      // 登录请求
      async handleLogin() {
        const res = await this.$http.post(`login`, this.loginForm)
        // console.log(res)
        const {data, meta: {msg, status}} = res.data

        if (status === 200) {
          // 登录成功弹出提示消息，存储token值，跳转到到home页面
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)

          // this.$message.success(msg);

          this.$router.push({name: 'home'})

        } else {
          // 登录失败，提示失败消息
          this.$message.error(msg);
        }

      },
    },

  }
</script>

<style>

  .login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    background-color: #ffff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }

  .login-wrap .login-form .login-btn {
    width: 100%;
  }

</style>
