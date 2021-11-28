<template>
  <div class="app">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="el-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="6">
          <el-input placeholder="请输入权限名称" v-model="queryInfo.name" clearable @clear="getPowerList()">
            <el-button slot="append" icon="el-icon-search" @click="getPowerList()"></el-button>
          </el-input>
        </el-col>
        <!--添加区域-->
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加权限</el-button>
        </el-col>
      </el-row>
      <!--权限列表区域-->
      <el-table :data="powerList.records" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色" prop="role.name"></el-table-column>
        <el-table-column label="权限描述" prop="permission.description"></el-table-column>
        <el-table-column label="权限值" prop="permission.name"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="是否生效">
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
          :total="powerList.total">
      </el-pagination>
    </el-card>
    <!--添加权限的对话框-->
    <el-dialog
        title="添加权限"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addPowerForm" :rules="powerRules" ref="powerRef" label-width="70px">
        <el-form-item label="角色" prop="roleId">
          <el-select filterable v-model="addPowerForm.roleId" placeholder="请选择">
            <el-option v-for="item in roleList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permissionId">
          <el-select filterable v-model="addPowerForm.permissionId" placeholder="请选择">
            <el-option v-for="item in permissionList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否生效" prop="state">
          <el-select v-model="addPowerForm.state" placeholder="请选择">
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
    <el-button type="primary" @click="addPower">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改权限的对话框-->
    <el-dialog
        title="修改权限"
        :visible.sync="editDialogVisible"
        width="50%">
      <!--内容主体区域-->
      <el-form :model="editRoleForm" :rules="powerRules" ref="powerRef" label-width="70px">
        <el-form-item label="角色" prop="roleId">
          <el-select filterable v-model="editRoleForm.roleId" placeholder="请选择">
            <el-option v-for="item in roleList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item filterable label="权限" prop="permissionId">
          <el-select v-model="editRoleForm.permissionId" placeholder="请选择">
            <el-option v-for="item in permissionList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否生效" prop="state">
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
import {getById, removeById, saveOrUpdate, selectPage} from "../../api/rolePermission";
import {select} from "../../api/role";
import {selectPermission} from "../../api/permission";

export default {
  name: "Power",
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      powerList: {
        records: [],
        total: 0
      },
      // 控制添加权限弹框的显示和隐藏
      addDialogVisible: false,
      // 控制修改权限对话框的显示与隐藏
      editDialogVisible: false,
      // 添加的权限对象
      addPowerForm: {
        roleId: null,
        permissionId: null,
        state: 1
      },
      // 修改的权限对象
      editRoleForm: {
        roleId: null,
        permissionId: null
      },
      // 添加权限的验证规则
      powerRules: {
        roleId: [
          {required: true, message: '请输入角色', trigger: 'blur'}
        ],
        permissionId: [
          {required: true, message: '请输入权限描述', trigger: 'blur'},
        ]
      },
      options: [
        {label: '生效', value: 1},
        {label: '无效', value: 0}
      ],
      roleList: [],
      permissionList: []
    }
  },
  created() {
    this.getPowerList();
  },
  methods: {
    getPowerList() {
      selectPage(this.queryInfo).then(res => {
        this.powerList.total = res.data.total;
        this.powerList.records = res.data.records;
      });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getPowerList()
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getPowerList()
    },
    stateChange(info) {
      saveOrUpdate(info).then(() => {
        this.$message.success("更新状态成功")
      });
    },
    // 监听添加权限对话框的关闭事件
    addDialogClosed() {
      this.$refs['powerRef'].resetFields();
    },
    // 点击按钮添加新权限
    addPower() {
      this.$refs.powerRef.validate(async valid => {
        if (!valid) return;
        // 发起添加权限的网络请求
        saveOrUpdate(this.addPowerForm).then(() => {
          // 重新获取权限列表
          this.getPowerList();
          // 隐藏添加权限对话框
          this.addDialogVisible = false;
          this.$message.success("添加权限成功");
        });
      })
    },
    // 展示修改权限的对话框
    showEditDialog(role) {
      getById({id: role.id}).then(res => {
        this.editRoleForm = res.data;
      });
      select(this.addPowerForm).then(res => {
        this.roleList = res.data;
      });
      selectPermission(this.addPowerForm).then(res => {
        this.permissionList = res.data;
      });
      this.editDialogVisible = true;
    },
    // 展示添加权限的对话框
    showAddDialog() {
      select(this.addPowerForm).then(res => {
        this.roleList = res.data;
      });
      selectPermission(this.addPowerForm).then(res => {
        this.permissionList = res.data;
      });
      this.addDialogVisible = true;
    },
    // 修改权限信息并提交
    editRoleInfo() {
      this.$refs.powerRef.validate(async valid => {
        if (!valid) return;
        // 发起修改权限的网络请求
        saveOrUpdate(this.editRoleForm).then(() => {
          // 重新获取权限列表
          this.getPowerList();
          // 隐藏添加权限对话框
          this.editDialogVisible = false;
          this.$message.success("修改权限成功");
        });
      })
    },
    // 根据id删除权限信息
    removeById(power) {
      // 弹框询问用户是否删除权限
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除权限
        removeById({id: power.id}).then(() => {
          // 重新获取权限列表
          this.getPowerList();
          this.$message.success("删除权限成功");
        });
      }).catch(() => {
        this.$message.info('已取消删除');
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
