<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="登录地址" prop="ipaddr">
            <el-input
              v-model="queryParams.ipaddr"
              placeholder="请输入登录地址"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="登录状态"
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
          <el-table-column label="编号" width="70" align="center" prop="id" />
          <el-table-column label="用户名称" width="85" align="center" prop="username" />
          <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
          <el-table-column label="登录地点" align="center" prop="loginlocation" />
          <el-table-column label="浏览器" align="center" prop="browser" />
          <el-table-column label="操作系统" align="center" prop="os" />
          <el-table-column label="登录状态" width="80" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column label="操作信息" width="90" align="center" prop="msg" />
          <el-table-column label="登录日期" align="center" prop="logintime" width="180" :formatter="formatDate" />
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
import { listLoginlog } from '@/api/loginlog'
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
      listLoginlog(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    formatDate(row) {
      const date = new Date(parseInt(row.logintime) * 1000)
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

