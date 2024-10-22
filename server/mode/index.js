import { formatDate } from '../utils/index.js'

// 生成条件
function createConditions(params) {
  let { id, w=[] } = params
  delete params.id
  delete params.w

  let conditions = ''
  if (w.length) {
    w.forEach((a, i) => {
      let str = ''
      Object.keys(a).forEach((c, k) => {
        str+= `${c} = '${a[c]}' ${k < Object.keys(a).length -1 ? 'AND ' : ''}`
      })
      conditions+=`${str}${i < Object.keys(w).length -1 ? 'OR ' : ''}`
    })
  } else {
    if (!id) {
      return [{ erron: 1, code: '请传入条件'}, {}]
    }
    conditions = `id = ${id}`
  }

  return conditions;
}
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

    return [err, { id: res?.lastID }]
  }

  /**
   * 更新
   * @param {*} params.id id
   * @param {*} params.w 条件
   */
  async update(params) {
    let { id } = params
    let updateTime = formatDate('YYYY-MM-DD HH:mm:ss')
    // 构建条件
    let conditions = createConditions(params)
    // 需要更新的字段
    let querys = { ...params, updateTime}

    // 更新数据
    let [err, res] = await this.db.updateData(this.tableName, querys, conditions)
    return [err, id ? { id } : {}]
  }

  /**
   * 获取多条数据
   * @param {*} param.page 当前页码 默认1
   * @param {*} param.pageSize 每页条数 默认10
   */
  async getData(param={}) {
    const { page = 1, pageSize = 10 } = param
    const querys = { status: 1, ...param }
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
  async delete(params) {
    // 构建条件
    let conditions = createConditions(params)

    // 删除数据
    let [err, res] = await this.db.deleteData(this.tableName, conditions)

    if (err) {
      return [err, null]
    } else {
      return [null, null]
    }
  }
}
