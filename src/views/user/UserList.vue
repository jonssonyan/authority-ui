<template>
    <div class="app">
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="el-card">
            <el-row :gutter="20">
                <!--搜索与添加区域-->
                <el-col :span="6">
                    <el-input placeholder="请输入用户名" v-model="queryInfo.username" clearable @clear="getUserList()">
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="请输入邮箱" v-model="queryInfo.email" clearable @clear="getUserList()">
                    </el-input>
                </el-col>
                <!--搜索按钮-->
                <el-col :span="4">
                    <el-button type="primary" @click="getUserList">搜索</el-button>
                </el-col>
                <!--添加区域-->
                <el-col :span="4">
                    <el-button type="primary" @click="showAddDialog">添加用户</el-button>
                </el-col>
            </el-row>
            <!--用户列表区域-->
            <el-table :data="userList.records" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="是否禁用">
                    <template slot-scope="scope">
                        <el-switch
                                :active-value=0
                                :inactive-value=1
                                v-model="scope.row.state"
                                @change="stateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!--删除-->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="userList.total">
            </el-pagination>
        </el-card>
        <!--添加用户的对话框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed">
            <!--内容主体区域-->
            <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="addUserForm.state" placeholder="请选择">
                        <el-option v-for="(item,index) in options"
                                   :key="index"
                                   :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户的对话框-->
        <el-dialog
                title="修改分类"
                :visible.sync="editDialogVisible"
                width="50%">
            <!--内容主体区域-->
            <el-form :model="editUserForm" :rules="addUserRules" ref="addCategoryRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="是否禁用" prop="state">
                    <el-select v-model="editUserForm.state" placeholder="请选择">
                        <el-option v-for="(item,index) in options"
                                   :key="index"
                                   :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "userList",
        data() {
            return {
                queryInfo: {
                    pageNum: 1,
                    pageSize: 10
                },
                userList: {
                    records: [],
                    total: 0,
                },
                // 添加的用户对象
                addUserForm: {
                    state: 1
                },
                // 修改的用户对象
                editUserForm: {},
                // 添加分类的验证规则
                addUserRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确格式的邮箱地址', trigger: 'blur'}
                    ]
                },
                // 控制添加用户弹框的显示和隐藏
                addDialogVisible: false,
                // 控制修改用户弹框的显示和隐藏
                editDialogVisible: false,
                options: [
                    {label: '正常', value: 1},
                    {label: '禁用', value: 0}
                ]
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            async getUserList() {
                let {data: res} = await this.$http.post(`/api/user/selectPage`, this.queryInfo);
                if (res.code !== 1) return this.$message.error("获取用户列表失败！");
                this.userList.records = res.data.records;
                this.userList.total = res.data.total
            },
            async showAddDialog() {
                this.addDialogVisible = true;
            },
            async stateChange(info) {
                let {data: res} = await this.$http.post(`/api/user/saveOrUpdate`, info);
                if (res.code !== 1) {
                    info.state = !info.state;
                    return this.$message.error(res.msg)
                }
                this.$message.success("更新状态成功")
            },
            async showEditDialog(id) {
                let user = {};
                user.id = id;
                const {data: res} = await this.$http.post(`/api/user/getById`, user);
                if (res.code !== 1) {
                    this.$message.error(res.msg)
                }
                this.editUserForm = res.data;
                this.editDialogVisible = true;
            },
            async removeUserById(id) {
                // 弹框询问用户是否删除分类
                await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // 删除分类
                    const user = {
                        ids: []
                    };
                    user.ids[0] = id;
                    const {data: res} = await this.$http.post(`/api/user/removeById`, user);
                    if (res.code !== 1) return this.$message.error("删除用户失败");
                    this.$message.success("删除用户成功");
                    // 重新获取分类列表
                    this.getUserList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.getUserList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage;
                this.getUserList()
            },
            addDialogClosed() {
                this.$refs['addUserRef'].resetFields();
            },
            addUser() {
                this.$refs.addUserRef.validate(async valid => {
                    if (!valid) return;
                    // 发起添加用户的网络请求
                    const {data: res} = await this.$http.post('/api/user/saveOrUpdate', this.addUserForm);
                    if (res.code !== 1) {
                        return this.$message.error(res.msg)
                    }
                    this.$message.success("添加用户成功");
                    // 隐藏添加分类对话框
                    this.addDialogVisible = false;
                    // 重新获取分类列表
                    this.getUserList();
                })
            },
            editUserInfo() {
                this.$refs.addCategoryRef.validate(async valid => {
                    if (!valid) return;
                    // 发起修改用户的网络请求
                    const {data: res} = await this.$http.post(`/api/user/saveOrUpdate`, this.editUserForm);
                    if (res.code !== 1) {
                        return this.$message.error(res.msg)
                    }
                    this.$message.success("修改用户成功");
                    // 隐藏添加分类对话框
                    this.editDialogVisible = false;
                    // 重新获取分类列表
                    this.getUserList();
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-table {
        margin-top: 15px;
        font-size: 12px;
    }

    .el-pagination {
        margin-top: 15px;
    }

    .app .el-card {
        width: 99%;
    }
</style>
