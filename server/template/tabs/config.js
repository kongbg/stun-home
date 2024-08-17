import { getAreaTree } from '@/api/electricfence.js'
import { useDict } from '@/utils/dict'

const { seal_type, seal_status } = useDict('seal_type', 'seal_status')

export const formData = ref([
  {
    type: 'areacascader',
    label: '所在地区',
    prop: 'areaCode',
    transformPropData: (data) => {
      if (data && data.length) {
        return data[data.length - 1]
      } else {
        return ''
      }
    },
    options: [],
    api: async () => {
      let res = await getAreaTree()
      let { code, data, msg } = res
      if (code == 200) {
        return data
      }
      return []
    },
    clearable: true
  },
  {
    prop: 'belongFirm',
    label: '所属单位',
    type: 'input',
    placeholder: '请输入',
    clearable: 'true',
    options: []
  },
  {
    prop: 'sealType',
    label: '印章类型',
    type: 'select',
    placeholder: '请选择',
    clearable: 'true',
    options: seal_type
  },
  {
    prop: 'sealStatus',
    label: '印章状态',
    type: 'select',
    placeholder: '请选择',
    clearable: 'true',
    options: seal_status
  },
  { type: 'reset', text: '重置' },
  { type: 'submit', text: '查询' }
])
export const formData2 = ref([
  {
    type: 'areacascader',
    label: '所在地区',
    prop: 'areaCode',
    transformPropData: (data) => {
      if (data && data.length) {
        return data[data.length - 1]
      } else {
        return ''
      }
    },
    options: [],
    api: async () => {
      let res = await getAreaTree()
      let { code, data, msg } = res
      if (code == 200) {
        return data
      }
      return []
    },
    clearable: true
  },
  {
    prop: 'belongFirm',
    label: '所属单位',
    type: 'input',
    placeholder: '请输入',
    clearable: 'true',
    options: []
  },
  {
    prop: 'sealType',
    label: '印章类型',
    type: 'select',
    placeholder: '请选择',
    clearable: 'true',
    options: seal_type
  },
  {
    prop: 'sealStatus',
    label: '印章状态',
    type: 'select',
    placeholder: '请选择',
    clearable: 'true',
    options: seal_status
  },
  { type: 'reset', text: '重置' },
  { type: 'submit', text: '查询' }
])
export const columns = ref([
  // { type: "index", label: "序号", width: 80, align: "center" },
  { prop: 'sealType', label: '印章类型', align: 'center' },
  { prop: 'sealStatus', label: '印章状态', align: 'center', dict: seal_status },
  { prop: 'belongFirm', label: '所属单位', align: 'center' },
  { prop: 'leader', label: '负责人', align: 'center' },
  { prop: 'learerTel', label: '手机号码', align: 'center' },
  { prop: 'encryptionMachine', label: '应用加密机', align: 'center' },
  { prop: 'binder', label: '绑定人', align: 'center' },

  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 200,
    slot: 'action',
    align: 'center'
  }
])
export const columns2 = ref([
  // { type: "index", label: "序号", width: 80, align: "center" },
  { prop: 'sealName', label: '电子印章', align: 'center' },
  { prop: 'sealType', label: '印章类型', align: 'center' },
  { prop: 'sealStatus', label: '印章状态', align: 'center', dict: seal_status },
  { prop: 'belongFirm', label: '所属企业', align: 'center' },
  { prop: 'leader', label: '负责人', align: 'center' },
  { prop: 'learerTel', label: '手机号码', align: 'center' },
  { prop: 'encryptionMachine', label: '应用加密机', align: 'center' },
  { prop: 'binder', label: '绑定人', align: 'center' },

  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 200,
    slot: 'action',
    align: 'center'
  }
])
