<template>
  <div class="app">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="el-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="6">
          <el-input placeholder="请输入订单标题" v-model="queryInfo.subject" clearable @clear="getOrderList">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入订单号" v-model="queryInfo.outTradeNo" clearable @clear="getOrderList">
          </el-input>
        </el-col>
        <!--搜索按钮-->
        <el-col :span="4">
          <el-button type="primary" @click="getOrderList">搜索</el-button>
        </el-col>
      </el-row>
      <!--订单列表区域-->
      <el-table :data="orderList.records" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="product.name"></el-table-column>
        <el-table-column label="订单标题" prop="subject"></el-table-column>
        <el-table-column label="收获地址" prop="address"></el-table-column>
        <el-table-column label="数量" prop="quantity"></el-table-column>
        <el-table-column label="订单号" prop="outTradeNo"></el-table-column>
        <el-table-column label="总金额" prop="totalAmount"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <el-switch
                :active-value=1
                :inactive-value=0
                v-model="scope.row.state" @change="stateChange(scope.row)">
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
                         @click="removeOrderById(scope.row)"></el-button>
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
          :total="orderList.total">
      </el-pagination>
    </el-card>
    <!--修改订单的对话框-->
    <el-dialog
        title="修改订单"
        :visible.sync="editDialogVisible"
        width="50%">
      <!--内容主体区域-->
      <el-form :model="editOrderForm" :rules="orderRules" ref="addOrderRef" label-width="70px">
        <el-form-item label="商品名称" prop="product.name">
          <el-input v-model="editOrderForm.product.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单标题" prop="subject">
          <el-input v-model="editOrderForm.subject"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="editOrderForm.address"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="editOrderForm.quantity" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="outTradeNo">
          <el-input v-model="editOrderForm.outTradeNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="总金额" prop="totalAmount">
          <el-input v-model="editOrderForm.totalAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="editOrderForm.createTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="state">
          <el-select v-model="editOrderForm.state" placeholder="请选择">
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
    <el-button type="primary" @click="editOrderInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getById, removeById, saveOrUpdate, selectPage} from "../../api/order";

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      orderList: {
        records: [],
        total: 0
      },
      // 控制添加订单弹框的显示和隐藏
      addDialogVisible: false,
      // 控制修改订单对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的订单对象
      editOrderForm: {
        quantity: 0,
        product: {
          price: 0
        },
        totalAmount: 0
      },
      // 添加订单的验证规则
      orderRules: {
        subject: [
          {required: true, message: '请输入订单标题', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        state: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      },
      options: [
        {label: '有效', value: 1},
        {label: '无效', value: 0}
      ],
    }
  },
  created() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      selectPage(this.queryInfo).then(res => {
        this.orderList.records = res.data.records;
        this.orderList.total = res.data.total;
      });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOrderList()
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getOrderList()
    },
    stateChange(order) {
      saveOrUpdate(order).then(() => {
        this.$message.success("更新状态成功")

      });
    },
    // 展示修改订单的对话框
    showEditDialog(order) {
      getById({id: order.id}).then(res => {
        this.editOrderForm = res.data;
        this.editDialogVisible = true;
      });
    },
    // 修改订单信息并提交
    editOrderInfo() {
      this.$refs.addOrderRef.validate(async valid => {
        if (!valid) return;
        saveOrUpdate(this.editOrderForm).then(() => {
          // 重新获取订单列表
          this.getOrderList();
          // 隐藏添加订单对话框
          this.editDialogVisible = false;
          this.$message.success("修改订单成功");
        });
      })
    },
    // 根据id删除订单信息
    removeOrderById(order) {
      // 弹框询问用户是否删除订单
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除订单
        removeById({id: order.id}).then(() => {
          // 重新获取订单列表
          this.getOrderList();
          this.$message.success("删除订单成功");
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
