// {{apiModuleName}}
import request from '@/utils/request'
{{#each apis}}
  {{#if (eq this.methodName "exportData")}}
    // {{this.name}}
    export function {{this.methodName}}(data, proxy, feilName, suffix) {
      proxy.download("{{this.url}}",data,`${feilName}_${new Date().getTime()}${suffix}`);
    }
  {{else}}
    // {{this.name}}
    export function {{this.methodName}}({{getParmas this.method}}) {
      return request({
        url: "{{this.url}}",
        method: "{{this.method}}",
        {{getParmas this.method}}
      })
    }
  {{/if}}
{{/each}}

{{#each configApis}}
  {{#if (eq this.methodName "exportData")}}
    // {{this.name}}
    export function {{this.methodName}}(data, proxy, feilName, suffix) {
      proxy.download("{{this.url}}",data,`${feilName}_${new Date().getTime()}${suffix}`);
    }
  {{else}}
    // {{this.name}}
    export function {{this.methodName}}({{getParmas this.method}}) {
      return request({
        url: "{{this.url}}",
        method: "{{this.method}}",
        {{getParmas this.method}}
      })
    }
  {{/if}}
{{/each}}
