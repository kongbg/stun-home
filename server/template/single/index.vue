<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="search-form">
      <SearchForm
        :config="searchConfig"
        @reset="reset"
        @submit="search"
      ></SearchForm>
    </div>

    <!-- 列表工具 -->
    <div class="toble-tools">
      <div class="left">
        <!-- {{actions.create.btnTx}} -->
        {{#if (and2 actions.create actions.create.show)}}
        <el-button {{#if actions.create.showExpression}}v-if="{{actions.create.showExpression}}"{{/if}} type="{{actions.create.type}}" @click="tableBtnFn('create')">{{ actions.create.btnTxt }}</el-button>
        {{/if}}
      </div>
      <div class="right">
        <!-- {{actions.export.btnTxt}} -->
        {{#if (and2 actions.export actions.export.show)}}
        <el-button {{#if actions.export.showExpression}}v-if="{{actions.export.showExpression}}"{{/if}} type="{{actions.export.type}}" @click="tableBtnFn('export')" :loading="exportLoading">{{ actions.export.btnTxt }}</el-button>
        {{/if}}
      </div>
    </div>

    <!-- 列表 -->
    <TableView
      :columns="columns"
      :tableData="tableData"
      :currentChange="handleCurrentChange"
      :sizeChange="handleSizeChange"
      :pageSize="pageSize"
      :currentPage="currentPages"
      :total="total"
      :loading="loading"
    >
      <template #action="{ row }">
        <!-- {{actions.view.btnTxt}} -->
        {{#if (and2 actions.view actions.view.show)}}
        <el-button {{#if actions.view.showExpression}}v-if="{{{actions.view.showExpression}}}"{{/if}} size="small" type="{{actions.view.type}}" @click="tableBtnFn('view', row)" text >{{ actions.view.btnTxt }}</el-button>
        {{/if}}
        <!-- {{actions.edit.btnTxt}} -->
        {{#if (and2 actions.edit actions.edit.show)}}
        <el-button {{#if actions.edit.showExpression}}v-if="{{{actions.edit.showExpression}}}"{{/if}} size="small" type="{{actions.edit.type}}" @click="tableBtnFn('edit', row)" text >{{ actions.edit.btnTxt }}</el-button>
        {{/if}}
        <!-- {{actions.delete.btnTxt}} -->
        {{#if (and2 actions.delete actions.delete.show)}}
        <el-button {{#if actions.delete.showExpression}}v-if="{{{actions.delete.showExpression}}}"{{/if}} size="small" type="{{actions.delete.type}}"  @click="tableBtnFn('delete', row)" :loading="delLoading" text >{{ actions.delete.btnTxt }}</el-button>
        {{/if}}
      </template>
    </TableView>
  </div>
</template>

<script setup name="{{moduleName}}">
import { ref } from "vue";
import SearchForm from "@/components/SearchForm"; // 搜索组件
import TableView from "@/components/Table"; // 列表组件
import { ElMessage, ElMessageBox } from "element-plus"; // UI
import { columns, searchConfig, transformData } from './config' // 组件配置信息
import {
    {{#each apis}}
        {{this.methodName}}, // {{this.name}}
    {{/each}}
} from "@/api/{{codePath}}/{{moduleName}}/index.js"; // 接口

const router = useRouter(); // 路由实例
const { proxy } = getCurrentInstance();
const searchForm = ref({}); // 搜索组件的结果
const loading = ref(false); // 列表loading
const delLoading = ref(false); // 删除按钮loading
const exportLoading = ref(false); // 导出按钮loading
const total = ref(0); // 列表总数
const tableData = ref([]); // 列表数据
const pageSize = ref(10); // 每页条数
const currentPages = ref(1); // 当前页码

// 查询列表
async function getList() {
    let pageInfo = {
        pageNum: currentPages.value,
        pageSize: pageSize.value
    };
    let params = { ...searchForm.value, ...pageInfo };
    loading.value = true;
    try {
        let res = await {{actions.list.apiName}}(params);
        loading.value = false;

        let { code, data, msg } = res;
        if (code == 200) {
            tableData.value = transformData(data.list);
            total.value = data.total;
        }
    } catch (error) {
        loading.value = false;
    }
}

// 列表操作
function tableBtnFn(type, row) {
    switch (type) {
        case 'create':
            createItem(type, row)
            break;
        case 'edit':
            editItem(type, row)
            break;
        case 'view':
            viewItem(type, row)
            break;
        case 'delete':
            deleteItem(type, row)
            break;
        case 'export':
            exportItem(type, row)
            break;
        default:
    }
}
// 新增
function createItem(type, row) {
    {{#if (eq actions.create.openType 1)}}
        router.push({
            path: '{{actions.create.openUrl}}',
            query: {
                type: type,
            },
        });
    {{else}}
        // todo 打开弹窗
    {{/if}}
}
// 编辑
function editItem(type, row) {
    {{#if (eq actions.edit.openType 1)}}
        router.push({
            path: '{{actions.edit.openUrl}}',
            query: {
                type: type,
                id: row.id,
            },
        });
    {{else}}
        // todo 打开弹窗
    {{/if}}
}
// 查看
function viewItem(type, row) {
    {{#if (eq actions.view.openType 1)}}
        router.push({
            path: '{{actions.view.openUrl}}',
            query: {
                type: type,
                id: row.id,
            },
        });
    {{else}}
        // todo 打开弹窗
    {{/if}}
}
// 删除
function deleteItem(type, row) {
    ElMessageBox.confirm("{{actions.delete.tips}}", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            handleDelete(row.id);
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消操作",
            });
        });
}
// 删除信息
async function handleDelete(id) {
    let params = [id]
    delLoading.value = true;
    try {
        let res = await {{actions.delete.apiName}}(params);
        delLoading.value = false;
        let { code, data, msg } = res;
        if (code == 200) {
            getList();
            ElMessage({
                type: "success",
                message: "删除成功",
            });
        }
    } catch (error) {
        delLoading.value = false;
    }
}

// 导出
async function exportItem() {
    let pageInfo = {
        pageNum: currentPages.value,
        pageSize: 9999,
    };
    let data = { ...searchForm.value, ...pageInfo };
    try {
        exportData(data, proxy, "{{actions.export.feilName}}", "{{actions.export.suffix}}")
    } catch (error) {
        
    }
}

// 页码变化
function handleCurrentChange(pageNum) {
    currentPages.value = pageNum;
    getList();
}
// 每页条数变化
function handleSizeChange(size) {
    pageSize.value = size;
    getList();
}

// 重置搜索条件
function reset(data) {
    searchForm.value = data;
    getList();
}
// 搜索
function search(data) {
    searchForm.value = data;
    getList();
}

// 获取列表数据
getList();
</script>

<style lang="scss" scoped>
.app-container {
  overflow: auto;
  height: 100%;
}
</style>
