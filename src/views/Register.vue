<template>
    <el-form ref="registerRef" :model="registerForm" label-width="80px" :rules="registerRules">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" type=""></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password1">
            <el-input v-model="registerForm.password1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
            <el-input v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" type="text"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
            <el-input v-model="registerForm.qq" type="text"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
            <el-input v-model="registerForm.phone" type="text"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
            <el-button @click="reset">重设</el-button>
            <el-button @click="toLogin">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
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
                registerForm: {
                    password1: "",
                    password: "",
                    username: "",
                    email: "",
                    qq: "",
                    phone: ""
                },
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
                    let {data: res} = await this.$http.post('/register', this.registerForm);
                    if (res.code !== 1) {
                        this.$message.error(res.msg)
                    } else {
                        this.$message.success('注册成功');
                        await this.$router.push('/login')
                    }
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

</style>
