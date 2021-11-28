<template>
  <div class="app">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="el-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getCategoryList">
            <el-button slot="append" icon="el-icon-search" @click="getCategoryList"></el-button>
          </el-input>
        </el-col>
        <!--添加区域-->
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--分类列表区域-->
      <el-table :data="categoryList.records" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="是否上架">
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
                         @click="removeCategoryById(scope.row)"></el-button>
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
          :total="categoryList.total">
      </el-pagination>
    </el-card>
    <!--添加分类的对话框-->
    <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addCategoryForm" :rules="categoryRules" ref="categoryRef" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addCategoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级" prop="parentId">
          <el-select filterable v-model="addCategoryForm.parentId" placeholder="请选择">
            <el-option v-for="item in categoryForm"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="addCategoryForm.state" placeholder="请选择">
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
    <el-button type="primary" @click="addCategory">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改分类的对话框-->
    <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%">
      <!--内容主体区域-->
      <el-form :model="editCategoryForm" :rules="categoryRules" ref="categoryRef" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editCategoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级" prop="parentId">
          <el-select filterable v-model="editCategoryForm.parentId" placeholder="请选择">
            <el-option v-for="item in categoryForm"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editCategoryForm.state" placeholder="请选择">
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
    <el-button type="primary" @click="editCategoryInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getById, removeById, saveOrUpdate, select, selectPage} from "../../api/category";

export default {
  name: "Category",
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      categoryList: {
        records: [],
        total: 0
      },
      //  控制添加分类弹框的显示和隐藏
      addDialogVisible: false,
      // 控制修改分类对话框的显示与隐藏
      editDialogVisible: false,
      // 添加的分类对象
      addCategoryForm: {
        parentId: null,
        state: 1,
      },
      // 修改的分类对象
      editCategoryForm: {
        parentId: null
      },
      // 添加分类的验证规则
      categoryRules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        state: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      },
      options: [
        {label: '上架', value: 1},
        {label: '下架', value: 0}
      ],
      // 分类列表，用于选择父级菜单
      categoryForm: []
    }
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      selectPage(this.queryInfo).then(res => {
        this.categoryList.records = res.data.records;
        this.categoryList.total = res.data.total
      });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getCategoryList()
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getCategoryList()
    },
    stateChange(info) {
      saveOrUpdate(info).then(() => {
        this.$message.success("更新状态成功")
      });
    },
    // 监听添加分类对话框的关闭事件
    addDialogClosed() {
      this.$refs['categoryRef'].resetFields();
    },
    // 点击按钮添加新分类
    addCategory() {
      this.$refs.categoryRef.validate(async valid => {
        if (!valid) return;
        saveOrUpdate(this.addCategoryForm).then(() => {
          // 重新获取分类列表
          this.getCategoryList();
          // 隐藏添加分类对话框
          this.addDialogVisible = false;
          this.$message.success("添加分类成功");
        });
      })
    },
    // 展示修改分类的对话框
    showEditDialog(category) {
      getById({id: category.id, parentId: category.parentId}).then(res => {
        this.editCategoryForm = res.data;
      });
      select({id: category.id, parentId: category.parentId}).then(res => {
        this.categoryForm = res.data;
        this.editDialogVisible = true;
      });
    },
    // 展示添加分类的对话框
    showAddDialog() {
      select({}).then(res => {
        this.categoryForm = res.data;
        this.addDialogVisible = true;
      });
    },
    // 修改分类信息并提交
    editCategoryInfo() {
      this.$refs.categoryRef.validate(async valid => {
        if (!valid) return;
        saveOrUpdate(this.editCategoryForm).then(() => {
          // 重新获取分类列表
          this.getCategoryList();
          // 隐藏添加分类对话框
          this.editDialogVisible = false;
          this.$message.success("修改分类成功");
        });
      })
    },
    // 根据id删除分类信息
    removeCategoryById(category) {
      // 弹框询问用户是否删除分类
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除分类
        removeById({id: category.id}).then(() => {
          // 重新获取分类列表
          this.getCategoryList();
          this.$message.success("删除分类成功");
        });
      }).catch(() => {
        this.$message.info('已取消删除');
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
