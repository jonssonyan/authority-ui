<template>
  <div class="app">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="el-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="6">
          <el-input placeholder="请输入角色名称" v-model="queryInfo.name" clearable @clear="getRoleList()">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList()"></el-button>
          </el-input>
        </el-col>
        <!--添加区域-->
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="roleList.records" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <el-switch :active-value=1
                       :inactive-value=0
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
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!--删除-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeById(scope.row)"></el-button>
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
          :total="roleList.total">
      </el-pagination>
    </el-card>
    <!--添加角色的对话框-->
    <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="addRoleForm.state" placeholder="请选择">
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
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改角色的对话框-->
    <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%">
      <!--内容主体区域-->
      <el-form :model="editRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editRoleForm.state" placeholder="请选择">
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
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getById, removeById, saveOrUpdate, selectPage} from "../../api/role";

export default {
  name: "Role",
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      roleList: {
        records: [],
        total: 0
      },
      // 控制添加角色弹框的显示和隐藏
      addDialogVisible: false,
      // 控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 添加的角色对象
      addRoleForm: {
        state: 1
      },
      // 修改的角色对象
      editRoleForm: {},
      // 添加角色的验证规则
      addRoleRules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        state: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      },
      options: [
        {label: '有效', value: 1},
        {label: '无效', value: 0}
      ]
    }
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      selectPage(this.queryInfo).then(res => {
        this.roleList.total = res.data.total;
        this.roleList.records = res.data.records;
      });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getRoleList()
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getRoleList()
    },
    stateChange(info) {
      saveOrUpdate(info).then(() => {
        this.$message.success("更新状态成功")

      });
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs['addRoleRef'].resetFields();
    },
    // 点击按钮添加新角色
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return;
        // 发起添加角色的网络请求
        saveOrUpdate(this.addRoleForm).then(() => {
          this.$message.success("添加角色成功");
          // 隐藏添加角色对话框
          this.addDialogVisible = false;
          // 重新获取角色列表
          this.getRoleList();
        });
      })
    },
    // 展示修改角色的对话框
    showEditDialog(role) {
      getById({id: role.id}).then(res => {
        this.editRoleForm = res.data;
        this.editDialogVisible = true;
      });
    },
    // 展示添加角色的对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return;
        // 发起修改角色的网络请求
        saveOrUpdate(this.editRoleForm).then(() => {
          this.$message.success("修改角色成功");
          // 重新获取角色列表
          this.getRoleList();
          // 隐藏添加角色对话框
          this.editDialogVisible = false;
        });
      })
    },
    // 根据id删除角色信息
    removeById(role) {
      // 弹框询问用户是否删除角色
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色
        removeById({id: role.id}).then(() => {
          this.$message.success("删除角色成功");
          // 重新获取角色列表
          this.getRoleList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
