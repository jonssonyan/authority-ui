<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../../assets/logo.png">
      </div>
      <el-form ref="registerRef" :model="registerForm" label-width="80px" :rules="registerRules"
               class="login_form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password1">
          <el-input v-model="registerForm.password1" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input v-model="registerForm.password" placeholder="请再次输入用户名" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" type="text"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="registerForm.qq" placeholder="请输入QQ" type="text"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号码" type="text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button @click="reset">重设</el-button>
          <el-button @click="toLogin">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {register} from '../../api/user'

export default {
  name: 'Register',
  data() {
    // 自定义校验规则
    const validatePassword = (rule, value, callback) => {
      if (this.registerForm.password1 !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {},
      registerRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 5 到 5 个字符', trigger: 'blur'}
        ],
        password1: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'},
          {validator: validatePassword, trigger: "blur"}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'},
          {validator: validatePassword, trigger: "blur"}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确格式的邮箱地址', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    register() {
      this.$refs.registerRef.validate(async valid => {
        if (!valid) return;
        register(this.registerForm).then(() => {
          this.$router.push('/login')
          this.$message.success('注册成功');
        });
      })
    },
    reset() {
      this.$refs['registerRef'].resetFields();
    },
    toLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="less">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 550px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
