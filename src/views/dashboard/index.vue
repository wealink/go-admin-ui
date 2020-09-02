<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div class="dashboard-text">username: {{ username }}</div>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'username'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
