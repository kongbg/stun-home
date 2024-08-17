import { useDict } from '@/utils/dict'
import {
  {{#each configApis}}
      {{this.methodName}}, // {{this.name}}
  {{/each}}
} from "@/api/{{codePath}}/{{moduleName}}/index.js"; // 接口


export const {
  {{#each dicts}}
    {{this}},
  {{/each}}
} = useDict(
  {{#each dicts}}
    "{{this}}",
  {{/each}}
)

export const searchConfig = ref([
  {{#each searchConfig}}
    {{#if (eq this.type "input")}}
      {
        type: "{{this.type}}",
        prop: "{{this.prop}}",
        label: "{{this.label}}",
        show: "{{this.show}}",
        placeholder: "{{#if this.placeholder}}{{ this.placeholder }}{{else}}请输入{{/if}}",
        clearable: {{#if this.clearable}}{{ this.clearable }}{{else}}true{{/if}}
      },
    {{else if (eq this.type "select")}}
      {
        type: "{{this.type}}",
        prop: "{{this.prop}}",
        label: "{{this.label}}",
        show: "{{this.show}}",
        placeholder: "{{#if this.placeholder}}{{ this.placeholder }}{{else}}请选择{{/if}}",
        clearable: {{#if this.clearable}}{{ this.clearable }}{{else}}true{{/if}},
        options: {{#if this.dict}}{{ this.dict }}{{else}}{{#if this.options}}{{{this.options}}}{{else}}[]{{/if}}{{/if}},
        api: {{#if this.api}}{{{ this.api }}}{{else}}''{{/if}},
        props: {{#if this.props}}{{{this.props}}}{{else}}{
          label: 'dictLabel',
          value: 'dictValue'
        }{{/if}}
      },
    {{else if (eq this.type "datetimerange")}}
      {
        type: "{{this.type}}",
        prop: "{{this.prop}}",
        label: "{{this.label}}",
        show: "{{this.show}}",
        placeholder: "{{#if this.placeholder}}{{ this.placeholder }}{{else}}请选择{{/if}}",
        clearable: {{#if this.clearable}}{{ this.clearable }}{{else}}true{{/if}},
        options: {{#if this.options}}{{ this.options }}{{else}}[]{{/if}},
        defaultTime: {{#if this.defaultTime}}{{ this.defaultTime }}{{else}}[
          new Date(2000, 1, 1, 0, 0, 0),
          new Date(2000, 2, 1, 23, 59, 59),
        ]{{/if}},
      },
    {{/if}}
  {{/each}}
  { type: "reset", text: "重置" },
  { type: "submit", text: "查询" },
]);
export const columns = [
  {{#each columns}}
    {{#if (eq this.type "index")}}
      { type: "{{this.type}}", label: "{{this.label}}", width: {{#if this.width}}{{ this.width }}{{else}}80{{/if}}, align: "center" },
    {{else if (eq this.slot "action")}}
      { prop: "operation",label: "操作",fixed: "right", width: {{#if this.width}}{{ this.width }}{{else}}220{{/if}}, slot: "action", align: "center"},
    {{else if (isHas this.dict)}}
      { prop: "{{this.prop}}", label: "{{this.label}}", align: "center", dict: {{this.dict}} },
    {{else}}
      { prop: "{{this.prop}}", label: "{{this.label}}", align: "center" },
    {{/if}}
  {{/each}}
];

export const transformData = (data) => {
  return data;
};
