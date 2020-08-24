<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>

    </el-row>
    <el-table v-loading="loading" :data="menuList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="菜单标题" prop="title" :show-overflow-tooltip="true" width="180" />
      <el-table-column label="菜单名" prop="name" width="180" />
      <el-table-column label="路由路径" prop="path" width="180" />
      <el-table-column label="请求方法" prop="method" width="150" />
      <el-table-column label="显示图标" prop="icon" width="150">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="组件路径" prop="componenturl" width="150" />
      <el-table-column label="创建时间" align="center" prop="created_on" width="180" :formatter="formatCreatedDate" />
      <el-table-column label="更新时间" align="center" prop="modified_on" width="180" :formatter="formatModifiedDate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="13">
            <el-form-item label="添加类型" prop="type">
              <el-radio-group v-model="form.type" @change="typeChange">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="J">接口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item v-if="form.type == 'C'" label="选择目录">
              <el-select v-model="form.parentid" placeholder="请选择">
                <el-option
                  v-for="item in menuOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item v-if="form.type == 'J'" label="选择菜单">
              <el-select v-model="form.parentid" placeholder="请选择">
                <el-option
                  v-for="item in menuOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="标  题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item v-if="form.type == 'M' || form.type == 'C' " label="名  称" prop="title">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="路由路径" prop="title">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="26">
            <el-form-item v-if="form.type == 'J'" label="请求方法" prop="method">
              <el-radio-group v-model="form.method">
                <el-radio label="GET">GET</el-radio>
                <el-radio label="POST">POST</el-radio>
                <el-radio label="PUT">PUT</el-radio>
                <el-radio label="DELETE">DELTET</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item v-if="form.type == 'M' || form.type == 'C'" label="图  标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item v-if="form.type == 'M' || form.type == 'C'" label="组件路径" prop="componenturl">
              <el-input v-model="form.componenturl" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listMenu, getMenu, addMenu, editMenu, delMenu } from '@/api/menu'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'Menu',
  components: { IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      apiOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      openDataScope: false,
      isEdit: false,
      // 查询参数
      queryParams: {
        type: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '图标不能为空', trigger: 'blur' }
        ],
        componenturl: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    // 按钮切换
    typeChange() {
      if (this.form.type === 'M') { this.form.componenturl = 'Layout' }
      // eslint-disable-next-line no-sequences
      if (this.form.type === 'C') { this.form.componenturl = undefined, this.queryParams.type = 'M', this.getMenuselect() }
      // eslint-disable-next-line no-sequences
      if (this.form.type === 'J') { this.form.componenturl = undefined, this.queryParams.type = 'C', this.getMenuselect() }
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      listMenu(this.queryParams).then(
        response => {
          this.menuList = response.data
          this.loading = false
        }
      )
    },
    /** 查询菜单下拉树结构 */
    getMenuselect() {
      listMenu(this.queryParams).then(response => {
        this.menuOptions = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        type: 'M',
        parentid: undefined,
        name: undefined,
        path: undefined,
        icon: undefined,
        componenturl: 'Layout'
      }
      this.resetForm('form')
    },
    formatCreatedDate(row) {
      const date = new Date(parseInt(row.created_on) * 1000)
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-'
      const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    formatModifiedDate(row) {
      const date = new Date(parseInt(row.modified_on) * 1000)
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-'
      const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加菜单或目录'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id
      getMenu(id).then(response => {
        this.form = response.data
        if (this.form.type === 'C') { this.queryParams.type = 'M' } else { this.queryParams.type = 'C' }
        this.getMenuselect()
        this.open = true
        this.title = '修改菜单或目录'
        this.isEdit = true
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const menuId = row.id
      this.$confirm('是否确认删除菜单编号为"' + menuId + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMenu(menuId)
      }).then(() => {
        this.queryParams = {}
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    // 提交数据按钮
    submit() {
      if (this.isEdit === false) {
        addMenu(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.queryParams = {}
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      } else {
        editMenu(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.queryParams = {}
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }
  }
}
</script>
