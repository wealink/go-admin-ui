<template>
  <BasicLayout>
    <template #wrapper>
      <el-row :gutter="10">
        <el-col :span="6" :xs="50">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>个人信息</span>
            </div>
            <div>
              <div class="text-center">
                <userAvatar :user="user" />
              </div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  <svg-icon icon-class="user" />用户名称
                  <div class="pull-right">{{ user.username }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="phone" />手机号码
                  <div class="pull-right">{{ user.phone }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="peoples" />所属角色
                  <div class="pull-right">{{ user.rolename }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="date" />创建日期
                  <div class="pull-right">{{ user.create_on }}</div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="修改密码" name="resetPwd">
                <resetPwd :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </BasicLayout>
</template>

<script>
// 头像上传
import userAvatar from './userAvatar'
// 重置密码
import resetPwd from './resetPwd'
import { getInfo } from '@/api/login'
export default {
  name: 'Profile',
  components: { userAvatar, resetPwd },
  data() {
    return {
      user: {},
      activeTab: 'resetPwd'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getInfo().then(response => {
        this.user = response.data
        if (this.user.roles[0]) {
          this.user.rolename = this.user.roles[0]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-group-item{
    padding: 18px 0;
  }
  .svg-icon{
    margin-right: 5px;
  }
  .pull-right {
    float: right !important;
  }
  .list-group-striped > .list-group-item {
	border-left: 0;
	border-right: 0;
	border-radius: 0;
	padding-left: 0;
	padding-right: 0;
}

.list-group {
	padding-left: 0px;
	list-style: none;
}

.list-group-item {
	border-bottom: 1px solid #e7eaec;
	border-top: 1px solid #e7eaec;
	margin-bottom: -1px;
	padding: 11px 0px;
	font-size: 13px;
}
</style>
