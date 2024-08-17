<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="demo-tabs">
      {{#each tabConfig }}
      <el-tab-pane label="{{this.tabName}}" name="{{this.tabId}}">
        <List{{indexPlusOne @index}}></List{{indexPlusOne @index}}>
      </el-tab-pane>
      {{/each}}
    </el-tabs>
  </div>
</template>
<script setup>
{{#each tabConfig }}
import List{{indexPlusOne @index}} from './{{this.moduleName}}/index.vue'
{{/each}}
{{#each tabConfig }}
{{#if (eq @index 0)}}
const activeName = ref("{{this.tabId}}")
{{/if}}
{{/each}}

</script>

<style lang="scss" scoped>
.app-container {
  overflow: auto;
  height: 100%;
}
</style>