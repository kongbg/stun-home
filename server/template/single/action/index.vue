<template>
  <div class="action">
    
    <Form ref="formRef" :fromData="fromData" :rules="rules"></Form>

    <el-row
      v-if="route.query.type != 'view'"
      justify="center"
      :gutter="20"
      class="sub_btn"
    >
      <!-- 取消 -->
      {{#if actions.cancel.show }}
      <el-button v-if="['edit', 'create'].includes(route.query.type)" @click="cancel" type="{{actions.cancel.type}}"> {{actions.cancel.btnTxt}} </el-button>
      {{/if }}

      <!-- 返回 -->
      {{#if actions.back.show }}
      <el-button v-if="['view'].includes(route.query.type)" @click="cancel" type="{{actions.back.type}}"> {{actions.back.btnTxt}} </el-button>
      {{/if }}

      <!-- 新增 -->
      {{#if actions.create.show }}
      <el-button v-if="['create'].includes(route.query.type)" type="{{actions.create.type}}" @click="submit"> {{actions.create.btnTxt}} </el-button>
      {{/if }}

      <!-- 编辑 -->
      {{#if actions.edit.show }}
      <el-button v-if="['edit'].includes(route.query.type)" type="{{actions.edit.type}}" @click="submit"> {{actions.edit.btnTxt}} </el-button>
      {{/if }}
    </el-row>
  </div>
</template>
<script setup>
  import { ref } from "vue"; // vue
  import Form from './form.vue' // 表单组件
  import {
      {{#each apis}}
      {{ this.methodName }}, // {{this.name}}
      {{/each}}
  } from "@/api/{{codePath}}/{{moduleName}}/index{{#if index}}{{index}}{{/if}}.js"; // 接口

  const { proxy } = getCurrentInstance(); // vue 实例

  const router = useRouter(); // 路由实例
  const route = useRoute(); // 路由对象
  const loading = ref(false); // loading
  const formRef = ref(null); // 表单实例

  const fromData = ref({
    {{#each submitParams}}
    {{this.prop}}: {{{this.value}}}, // {{this.label}}
    {{/each}}
  }); // 表单数据

  // 表单校验规则
  const rules = {
    {{#each submitParams}}
    {{this.prop}}: [{ required:{{#if this.required}}{{this.required}}{{else}}false{{/if}}, message: "请选择", trigger: ["change", "blur"] }], // {{this.label}}
    {{/each}}
  };

  // 表单提交
  const submit = async () => {
    let { valid, errKeys=[] } = await formRef.value.validate()
    if (valid) {
      let data = formRef.value.getValues()
      let params = {
        ...data
      };
      if (route.query.type == "create") {
        try {
          loading.value = true;
          let res = await {{actions.create.apiName}}(params);
          loading.value = false;
          let { code, data, msg } = res;
          if (code == 200) {
            proxy.$modal.msgSuccess("新增成功");
            setTimeout(() => {
              router.push({
                path: '{{actions.create.openUrl}}'
              });
            }, 1500);
          }
        } catch (error) {
          loading.value = false;
        }
      } else {
        try {
          loading.value = true;
          let res = await {{actions.edit.apiName}}(params);
          let { code, data, msg } = res;
          if (code == 200) {
            proxy.$modal.msgSuccess("编辑成功");
            loading.value = false;
            setTimeout(() => {
              router.push({
                path: '{{actions.edit.openUrl}}'
              });
            }, 1500);
          }
        } catch (error) {
          loading.value = false;
        }
      }
    } else {
      let key = errKeys.length ? errKeys[0].key : '';
      if (key) {
        formRef.value.scrollToField(key)
      }
    }
  };

  // 取消按钮
  function cancel() {
    router.push({
      path: '{{actions.cancel.openUrl}}'
    });
  }

  // 获取详情
  async function getDetail() {
    let params = {
      id: route.query.id,
    };
    loading.value = true;
    try {
      let res = await {{actions.view.apiName}}(params);
      loading.value = false;
      let { code, data, msg } = res;
      if (code == 200) {
        fromData.value = data
      }
    } catch (error) {
      loading.value = false;
    }
  }

  function init() {
    // 判断是否需要获取详情
    if (["view", "edit"].includes(route.query.type)) {
      getDetail();
    }
  }

  init()
</script>

<style scoped lang="scss">
.action {
  height: 100%;
  padding: 0 20px 20px;
  .sub_btn {
    padding-bottom: 20px;
  }
}
</style>
