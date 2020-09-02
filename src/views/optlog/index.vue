<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="操作用户" prop="username">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入操作用户名称"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="请求方法" prop="method">
            <el-select
              v-model="queryParams.method"
              placeholder="请求方法"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in methodOptions"
                :key="dict.Value"
                :label="dict.Label"
                :value="dict.Value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="操作状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
          <el-table-column label="操作编号" align="center" prop="id" />
          <el-table-column label="操作用户" align="center" prop="username" />
          <el-table-column label="请求URL" align="center" prop="url" />
          <el-table-column label="请求方法" align="center" prop="method" />
          <el-table-column label="操作地址" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
          <el-table-column label="操作地点" align="center" prop="optlocation" />
          <el-table-column label="登录状态" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column label="操作信息" align="center" prop="msg" />
          <el-table-column label="操作日期" align="center" prop="opttime" :formatter="formatDate" />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listOptlog } from '@/api/optlog'
export default {
  name: 'Logininfor',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 状态数据字典
      statusOptions: [{ dictLabel: '正常', dictValue: '0' }, { dictLabel: '异常', dictValue: '1' }],
      methodOptions: [{ Label: 'GET', Value: 'GET' }, { Label: 'POST', Value: 'POST' }, { Label: 'PUT', Value: 'PUT' }, { Label: 'DELETE', Value: 'DELETE' }],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getList()
    // this.getDicts('sys_common_status').then(response => {
    //  this.statusOptions = response.data
    // })
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      listOptlog(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    formatDate(row) {
      const date = new Date(parseInt(row.opttime) * 1000)
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-'
      const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 登录状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.infoId)
      this.multiple = !selection.length
    }
  }
}
</script>
