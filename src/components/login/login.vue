<template>
  <div class="login-wrap">
    <el-form label-position="top" :model="formData" class="login-form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-button" @click.prevent="checkLogin()">登录</el-button>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formData: {
        }
      }
    },
    methods: {
      async checkLogin() {
        const res = await this.$http.post('login', this.formData);
        console.log(res);
        const { data, meta: { msg, status } } = res.data;
        if (status === 200) {
          localStorage.setItem('token', data.token);
          this.$message.success(msg);
          this.$router.push({ name: 'home' });
        } else {
          this.$message.error(msg)
        }
      }
    }
  }
</script>
<style>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #324152;
}

.login-wrap .login-form {
  background: #fff;
  width: 400px;
  padding: 30px;
  margin: 5px;
}

.login-wrap .login-button {
  width: 100%;
}

</style>
