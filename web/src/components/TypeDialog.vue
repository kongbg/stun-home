<template>
    <el-dialog v-model="props.modelValue" :title="title" width="500" :before-close="handleClose">

        <el-form
            ref="formRef"
            style="max-width: 600px"
            :model="formData"
            :rules="rules"
            label-width="auto"
        >
        <el-form-item label="分类名称" prop="name">
            <el-input v-model="formData.name" />
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
import { create, update, getData, getDetails, del, getDatas } from '@/api/nav.js'

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
const formData = defineModel('formData')
const title = ref('')
const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 1, max: 10, message: '请输入1-10个字符', trigger: 'blur' },
    ],
}
watch(() => props.modelValue, () =>{
    title.value =mode.value == 'create' ? '新增分类' : '编辑分类'
    if (id.value) {
        getDetail()
    }
})

const getDetail = async () => {
    let { code, data, msg } = await getDetails({id: id.value})
    if (code == 200) {
        // console.log(msg, data, mode.value)
        formData.value.name = data.name
        formData.value.id = data.id
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