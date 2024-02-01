<template>
  <div class="app">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="el-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="6">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.username"
            clearable
            @clear="getUserList()"
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="请输入邮箱"
            v-model="queryInfo.email"
            clearable
            @clear="getUserList()"
          >
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
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.state"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改-->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!--删除-->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row)"
              ></el-button>
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
        :total="userList.total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="70px"
      >
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
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
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
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <!--内容主体区域-->
      <el-form
        :model="editUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用" prop="state">
          <el-select v-model="editUserForm.state" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
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
import { getById, removeById, saveOrUpdate, selectPage } from '../../api/user'

export default {
  name: 'index',
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      userList: {
        records: [],
        total: 0
      },
      // 添加的用户对象
      addUserForm: {
        state: 1
      },
      // 修改的用户对象
      editUserForm: {},
      // 添加用户的验证规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确格式的邮箱地址',
            trigger: 'blur'
          }
        ]
      },
      // 控制添加用户弹框的显示和隐藏
      addDialogVisible: false,
      // 控制修改用户弹框的显示和隐藏
      editDialogVisible: false,
      options: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      selectPage(this.queryInfo).then((res) => {
        this.userList.records = res.data.records
        this.userList.total = res.data.total
      })
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    stateChange(info) {
      saveOrUpdate(info).then(() => {
        this.$message.success('更新状态成功')
      })
    },
    showEditDialog(id) {
      getById({ id: id }).then((res) => {
        this.editUserForm = res.data
        this.editDialogVisible = true
      })
    },
    removeUserById(user) {
      // 弹框询问用户是否删除用户
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeById({ id: user.id }).then(() => {
            // 重新获取用户列表
            this.getUserList()
            this.$message.success('删除用户成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    addDialogClosed() {
      this.$refs['addUserRef'].resetFields()
    },
    addUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return
        saveOrUpdate(this.addUserForm).then(() => {
          this.$message.success('添加用户成功')
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        })
      })
    },
    editUserInfo() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return
        saveOrUpdate(this.editUserForm).then(() => {
          this.$message.success('修改用户成功')
          // 隐藏添加用户对话框
          this.editDialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        })
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
