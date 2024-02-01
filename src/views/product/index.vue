<template>
  <div class="app">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="el-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.name"
            clearable
            @clear="getProductList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getProductList()"
            ></el-button>
          </el-input>
        </el-col>
        <!--添加区域-->
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加产品</el-button>
        </el-col>
      </el-row>
      <!--产品列表区域-->
      <el-table :data="productList.records" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="价格(元)" prop="price"></el-table-column>
        <el-table-column label="分类" prop="category.name"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="是否上架">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
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
                @click="showEditDialog(scope.row)"
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
                @click="removeProductById(scope.row)"
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
        :total="productList.total"
      >
      </el-pagination>
    </el-card>
    <!--添加产品的对话框-->
    <el-dialog
      title="添加产品"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="addProductForm"
        :rules="addProductRules"
        ref="addProductRef"
        label-width="70px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addProductForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="addProductForm.price"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            filterable
            v-model="addProductForm.categoryId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryForm"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="addProductForm.state" placeholder="请选择">
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
        <el-button type="primary" @click="addProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改产品的对话框-->
    <el-dialog title="修改产品" :visible.sync="editDialogVisible" width="50%">
      <!--内容主体区域-->
      <el-form
        :model="editProductForm"
        :rules="addProductRules"
        ref="addProductRef"
        label-width="70px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editProductForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="editProductForm.price"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            filterable
            v-model="editProductForm.categoryId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryForm"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editProductForm.state" placeholder="请选择">
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
        <el-button type="primary" @click="editProductInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getById,
  removeById,
  saveOrUpdate,
  selectPage
} from '../../api/product'
import { select } from '../../api/category'

export default {
  name: 'Product',
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      productList: {
        records: [],
        total: 0
      },
      // 控制添加产品弹框的显示和隐藏
      addDialogVisible: false,
      // 控制修改产品对话框的显示与隐藏
      editDialogVisible: false,
      // 添加的产品对象
      addProductForm: {
        state: 1
      },
      // 修改的产品对象
      editProductForm: {},
      // 添加产品的验证规则
      addProductRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        price: [
          {
            pattern: /^\+?[1-9]\d*$/,
            message: '价格必须大于0',
            trigger: 'blur'
          },
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ],
        state: [{ required: true, message: '请输入状态', trigger: 'blur' }]
      },
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ],
      // 分类列表，用于选择父级菜单
      categoryForm: []
    }
  },
  created() {
    this.getProductList()
  },
  methods: {
    getProductList() {
      selectPage(this.queryInfo).then((res) => {
        this.productList.total = res.data.total
        this.productList.records = res.data.records
      })
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getProductList()
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getProductList()
    },
    stateChange(info) {
      saveOrUpdate(info).then(() => {
        this.$message.success('更新状态成功')
      })
    },
    // 监听添加产品对话框的关闭事件
    addDialogClosed() {
      this.$refs['addProductRef'].resetFields()
    },
    // 点击按钮添加新产品
    addProduct() {
      this.$refs.addProductRef.validate(async (valid) => {
        if (!valid) return
        saveOrUpdate(this.addProductForm).then(() => {
          // 重新获取产品列表
          this.getProductList()
          // 隐藏添加产品对话框
          this.addDialogVisible = false
          this.$message.success('添加产品成功')
        })
      })
    },
    // 展示修改产品的对话框
    showEditDialog(product) {
      getById({
        id: product.id
      }).then((res) => {
        this.editProductForm = res.data
        select({}).then((res) => {
          this.categoryForm = res.data
          this.editDialogVisible = true
        })
      })
    },
    // 展示添加产品的对话框
    showAddDialog() {
      select({}).then((res) => {
        this.categoryForm = res.data
        this.addDialogVisible = true
      })
    },
    // 修改产品信息并提交
    editProductInfo() {
      this.$refs.addProductRef.validate(async (valid) => {
        if (!valid) return
        saveOrUpdate(this.editProductForm).then(() => {
          // 重新获取产品列表
          this.getProductList()
          // 隐藏添加产品对话框
          this.editDialogVisible = false
          this.$message.success('修改产品成功')
        })
      })
    },
    // 根据id删除产品信息
    removeProductById(product) {
      // 弹框询问用户是否删除产品
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除产品
          removeById({ id: product.id }).then(() => {
            // 重新获取产品列表
            this.getProductList()
            this.$message.success('删除产品成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
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
