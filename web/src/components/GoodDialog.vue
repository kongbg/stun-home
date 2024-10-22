<template>
    <el-dialog v-model="props.modelValue" title="商品" width="500" :before-close="handleClose">

        <el-form
            class="login-wrap"
            ref="formRef"
            style="max-width: 600px"
            :model="formData"
            :rules="rules"
            label-width="auto"
        >
            <el-form-item label="code" prop="code">
                <el-input v-model="formData.code" />
            </el-form-item>
            <el-form-item label="url" prop="url">
                <el-input v-model="formData.url" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleSubmit">登录</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { create } from '@/api/good.js'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const emit = defineEmits()
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})
const formRef = ref(null)
const formData = ref({
    userName: 'admin',
    passWord: 'admin.'
})
const rules = {
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 10, message: '请输入1-10个字符', trigger: 'blur' },
    ],
    passWord: [
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        { min: 1, max: 10, message: '请输入1-20个字符', trigger: 'blur' },
    ],
}

const handleClose = () => {
    emit('update:modelValue', false)
}
const handleSubmit = async () => {
    formRef.value.validate(async valid=>{
        if (valid) {
            let params = {
                code: formData.value.code,
                url: formData.value.url,
            }
            let { code, data, msg } = await create(params)
            if (code == 200) {
                proxy.$Notif({
                    message: '登录成功',
                    type: 'success',
                })
                
                emit('update:modelValue', false)
                emit('finsh')
            } else {
            }
        }
    })
}
</script>
<style lang="scss" scoped>
.dialog-footer {
    text-align: center;
}
.login-wrap {
    padding: 0 50px;
}
</style>