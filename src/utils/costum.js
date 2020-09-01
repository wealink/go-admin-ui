// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 显示数据字典
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue === ('' + value)) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}
