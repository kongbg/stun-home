import { formatDate } from '../utils/index.js'
export default class Mode {
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db
  }

  /**
   * 新增
   * @param {*} params
   */
  async create(params) {
    // 插入数据
    let createTime = formatDate('YYYY-MM-DD HH:mm:ss')
    const data = { ...params, createTime}
    let [err, res] = await this.db.insertData(this.tableName, data)
    return [err, { id: res.lastID }]
  }

  /**
   * 更新
   * @param {*} params.id id
   */
  async update(params, condition) {
    let { id } = params
    let updateTime = formatDate('YYYY-MM-DD HH:mm:ss')
    let querys = { ...params, updateTime}
    delete querys.id
    // 更新数据
    let conditions = condition ? condition : `id = ${id}`
    let [err, res] = await this.db.updateData(this.tableName, querys, conditions)
    return [err, { id }]
  }

  /**
   * 获取多条数据
   * @param {*} param.page 当前页码 默认1
   * @param {*} param.pageSize 每页条数 默认10
   */
  async getData(param) {
    const { page = 1, pageSize = 10 } = param
    const querys = { ...param }
    delete querys.page
    delete querys.pageSize
    let condition = ''
    for (const key in querys) {
      condition += ` ${key} = '${querys[key]}' AND`
    }

    let lastIndex = condition.lastIndexOf('AND')
    if (lastIndex !== -1) {
      condition = condition.substring(0, lastIndex).trim()
    }
    let [err, res] = await this.db.getPagedData(
      this.tableName,
      page,
      pageSize,
      condition
    )
    if (err) {
      return [err, res]
    } else {
      return [null, res]
    }
  }

  /**
   * 删除
   * @param {*} params.id  id
   */
  async delete(params, condition) {
    // 删除数据
    const conditions = condition ? condition : `id = ${params.id}`
    return await this.db.deleteData(this.tableName, conditions)
  }
}
