

/**
 * 获取查询条件
 * @param {Object} params - 查询参数对象
 * @returns {string} - 查询条件字符串
 */
export const getCondition = (params) => {
    let condition = '';

    // 复制查询参数对象
    const querys = { ...params }

    // 删除分页参数
    delete querys.page
    delete querys.pageSize

    // 遍历查询参数对象
    for (const key in querys) {
        // 拼接查询条件字符串
        condition += ` ${key} = ${querys[key]} AND`
    }

    // 获取最后一个AND的索引
    let lastIndex = condition.lastIndexOf('AND')
    if (lastIndex !== -1) {
        // 去除最后一个AND及其后面的空格
        condition = condition.substring(0, lastIndex).trim()
    }
    return condition || ''
}

/**
 * 获取日期时间
 * @param {*} date
 * @param {*} format
 */
export function formatDate(format, date = new Date()) {
    const pad = (number) => (number < 10 ? '0' + number : number);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // 月份是从0开始的
    const day = pad(date.getDate());

    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`;
    } else if (format === 'YYYY-MM-DD HH:mm:ss') {
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      throw new Error('Unsupported format');
    }
}