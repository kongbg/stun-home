<template>
    <el-dialog v-model="props.modelValue" :title="title" width="500" :before-close="handleClose">

        <el-form
            ref="formRef"
            style="max-width: 600px"
            :model="formData"
            :rules="rules"
            label-width="auto"
        >
        <el-form-item label="网站分类">
            <el-select placeholder="网站分类" :disabled="mode == 'create'" v-model="formData.parentId"> 
                <el-option v-for="item in types" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="网站名称" prop="name">
            <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
            <el-input v-model="formData.url" />
        </el-form-item>
        <el-form-item label="网站图标">
            <el-input v-model="formData.icon" />
        </el-form-item>
        <el-form-item label="网站code">
            <el-input v-model="formData.code" />
        </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { getData } from '@/api/nav.js'
import { create, update, getDetails  } from '@/api/urls.js'

const emit = defineEmits()
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})
const formRef = ref(null)
const mode = defineModel('mode')
const id = defineModel('id')
const parentId = defineModel('parentId')
const formData = defineModel('formData')
const title = ref('')
const types = ref([])
const rules = {
    name: [
        { required: true, message: '请输入网站名称', trigger: 'blur' },
        { min: 1, max: 10, message: '请输入1-10个字符', trigger: 'blur' },
    ],
    url: [
        { required: true, message: '请输入网站地址', trigger: 'blur' },
        { min: 1, max: 200, message: '请输入1-200个字符', trigger: 'blur' },
    ],
}
watch(() => props.modelValue, () =>{
    formData.value.parentId = parentId.value || 'd999999'
    title.value = mode.value == 'create' ? '新增网站' : '编辑网站'
    getTypes()
    if (id.value) {
        getDetail()
    }
})

const getTypes = async () => {
    let { code, data, msg } = await getData()
    if (code == 200) {
        types.value = data.list || []
        types.value.unshift(
            {
                name: '待分配',
                id: 'd999999'
            }
        )
    } else {
        // console.log(msg)
    }
}
const getDetail = async () => {
    let { code, data, msg } = await getDetails({id: id.value})
    if (code == 200) {
        // console.log(msg, data, mode.value)
        formData.value.name = data.name
        formData.value.id = data.id
        formData.value.icon = data.icon
        formData.value.code = data.code
        formData.value.url = data.url
    } else {
        // console.log(msg)
    }
}

const handleClose = () => {
    id.value = ''
    emit('update:modelValue', false)
}
const handleSubmit = async () => {
    formRef.value.validate(async valid=>{
        if (valid) {
            formData.value.parentId = formData.value.parentId == 'd999999' ? '' : formData.value.parentId;
            if (mode.value == 'create') {
                let { code, data, msg } = await create(formData.value)
                if (code == 200) {
                    // console.log(msg)
                    emit('update:modelValue', false)
                    emit('finsh')
                } else {
                    // console.log(msg)
                }
            } else if (mode.value == 'edit') {
                let { code, data, msg } = await update(formData.value)
                if (code == 200) {
                    // console.log(msg)
                    emit('update:modelValue', false)
                    emit('finsh')
                } else {
                    // console.log(msg)
                }
            }
        }
    })
}
</script>