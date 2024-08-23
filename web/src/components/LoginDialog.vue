<template>
    <el-dialog v-model="props.modelValue" title="登录" width="500" :before-close="handleClose">

        <el-form
            class="login-wrap"
            ref="formRef"
            style="max-width: 600px"
            :model="formData"
            :rules="rules"
            label-width="auto"
        >
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="formData.userName" />
            </el-form-item>
            <el-form-item label="用户密码" prop="passWord">
                <el-input v-model="formData.passWord" />
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
import { login } from '@/api/user.js'
import CryptoJS from 'crypto-js';
import { setToken, removeToken } from '@/utils/auth.js'

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
                userName: formData.value.userName,
                passWord: CryptoJS.MD5(formData.value.passWord).toString()
            }
            let { code, data, msg } = await login(params)
            if (code == 200) {
                console.log(msg)
                setToken(data.token)
                emit('update:modelValue', false)
                emit('finsh')
            } else {
                console.log(msg)
                removeToken()
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