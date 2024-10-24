import SQLiteDB from "../sqlite/index.js";
import Mode from "../mode/index.js";
import path from "path";
import crypto from "crypto";
import { generateToken } from "../utils/token.js";
import { expiresIn, notBefore } from "../config/configs.js";

const __dirname = path.resolve();
let dbPath = path.join(__dirname + "/config/data.db");

const tableName = "users";

// 创建数据库连接
const db = new SQLiteDB(dbPath);
const mode = new Mode(tableName, db);
const tokenMode = new Mode("tokens", db);

// 创建表字段
const columns = [
  { name: "id", type: "INTEGER PRIMARY KEY AUTOINCREMENT" },
  { name: "userName", type: "TEXT" }, // 名称
  { name: "nick", type: "TEXT" }, // 昵称
  { name: "passWord", type: "TEXT" }, // 密码
  { name: "face", type: "TEXT" }, // 图标
  { name: "status", type: "TEXT", default: "1" }, // 1 启用 0 禁用
  { name: "delstatus", type: "TEXT", default: "0" }, // 1 已删除 0 未删除
  { name: "createTime", type: "TEXT" }, // 创建时间
  { name: "updateTime", type: "TEXT" }, // 更新时间
];
// 创建表
db.createTable(tableName, columns);
// 创建默认账号admin
addAdmin();

async function addAdmin() {
  let [err, res] = await mode.getData({ userName: "admin" });
  if (!err) {
    if (res.data.length == 0) {
      const defaultPassWord = "admin123";

      const hash = crypto.createHash("md5");
      hash.update(defaultPassWord);
      const encryptedPassword = hash.digest("hex");

      mode.create({
        userName: "admin",
        nick: "admin",
        passWord: encryptedPassword,
        face: "",
      });
    }
  }
}

export default class urlController {
  /**
   * 新增
   * @param {Context} ctx
   */
  static async create(ctx) {
    let params = ctx.request.body;
    // 插入数据
    let [err, res] = await mode.create(params);

    ctx.body = {
      code: !err ? 200 : 400,
      data: res,
      msg: !err ? "ok" : err.msg || err.code,
    };
  }

  /**
   * 更新
   * @param {Context} ctx
   */
  static async update(ctx) {
    let params = ctx.request.body;
    // 更新数据
    let [err, res] = await mode.update(params);
    ctx.body = {
      code: !err ? 200 : 400,
      data: res,
      msg: !err ? "ok" : err.msg || err.code,
    };
  }
  /**
   * 获取列表
   * @param {*} param
   */
  static async getData(ctx) {
    const query = ctx.request.query;
    let [err, res] = await mode.getData(query);
    let { data = [], total = 0, totalPages = 0 } = res || {};
    let result = {
      code: !err ? 200 : 400,
      data: !err
        ? {
            list: data,
            total,
            totalPages,
          }
        : null,
      msg: !err ? "ok" : err.msg || err.code,
    };
    ctx.body = result;
  }
  /**
   * 获取详情
   * @param {*} param
   */
  static async getDetails(ctx) {
    ctx.body = {
      msg: "操作成功",
      code: 200,
      permissions: ["*:*:*"],
      roles: ["admin"],
      user: {
        createBy: "admin",
        createTime: "2024-06-30 11:27:11",
        updateBy: null,
        updateTime: null,
        remark: "管理员",
        userId: 1,
        deptId: 103,
        userName: "admin",
        nickName: "若依",
        email: "ry@163.com",
        phonenumber: "15888888888",
        sex: "1",
        avatar: "",
        password:
          "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
        status: "0",
        delFlag: "0",
        loginIp: "124.114.153.19",
        loginDate: "2024-10-23T11:39:21.000+08:00",
        dept: {
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: 103,
          parentId: 101,
          ancestors: "0,100,101",
          deptName: "研发部门",
          orderNum: 1,
          leader: "若依",
          phone: null,
          email: null,
          status: "0",
          delFlag: null,
          parentName: null,
          children: [],
        },
        roles: [
          {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            roleId: 1,
            roleName: "超级管理员",
            roleKey: "admin",
            roleSort: 1,
            dataScope: "1",
            menuCheckStrictly: false,
            deptCheckStrictly: false,
            status: "0",
            delFlag: null,
            flag: false,
            menuIds: null,
            deptIds: null,
            permissions: null,
            admin: true,
          },
        ],
        roleIds: null,
        postIds: null,
        roleId: null,
        admin: true,
      },
    };
    return;
    const query = {
      ...ctx.request.query,
      page: 1,
      pageSize: 1,
    };

    let [err, res] = await mode.getData(query);
    let { data = [], total = 0, totalPages = 0 } = res || {};

    let result = {
      code: !err ? 200 : 400,
      data: data.length ? data[0] : null,
      msg: !err ? "ok" : err.msg || err.code,
    };
    ctx.body = result;
  }
  /**
   * 删除列表数据
   * @param {Context} ctx
   * @memberof rustController
   */
  static async delete(ctx) {
    let params = ctx.request.body;
    // 删除数据
    let [err, res] = await mode.delete(params);
    ctx.body = {
      code: !err ? 200 : 400,
      data: null,
      msg: !err ? "ok" : err.msg || err.code,
    };
  }

  /**
   * 额外接口
   */
  static async getDatas(ctx) {
    const query = ctx.request.query;
    let { data: list, total, totalPages } = await mode.getData(query);

    list.forEach(async (item) => {
      // let res = await urlController.getData({ parentId: item.id })
      // item.childre = res.data.list
      // console.log('resres:', res)

      item.children = [];
    });

    let result = {
      code: !err ? 200 : 400,
      data: !err
        ? {
            list: data,
            total,
            totalPages,
          }
        : null,
      msg: !err ? "ok" : err.msg || err.code,
    };
    ctx.body = result;
  }

  /**
   * 额外接口
   * 登录
   */
  static async login(ctx) {
    let params = ctx.request.body;
    let result = {};
    const hash = crypto.createHash("md5");
    hash.update(params.password);
    const encryptedPassword = hash.digest("hex");

    let [err, res] = await mode.getData({
      userName: params.username,
      passWord: encryptedPassword,
      page: 1,
      pageSize: 1,
    });
    console.log('username:', params.username)
    console.log('password:', encryptedPassword)

    if (!err && res.data.length) {
      // 生成token
      let userInfo = {
        id: res.data[0].id,
        userName: res.data[0].userName,
        nick: res.data[0].nick,
      };

      let token = generateToken(userInfo);

      // 保存token
      tokenMode.create({
        token: token,
        userId: res.data[0].id,
      });

      result = {
        code: 200,
        data: {
          token,
          notBefore,
          expiresIn,
        },
        msg: "ok",
      };
    } else {
      result = {
        code: 400,
        data: null,
        msg: "用户名或密码不正确",
      };
    }
    ctx.body = result;
  }

  /**
   * 获取用户信息
   * @param {*} param
   */
  static async getUserInfo(ctx) {
    let token = ctx.request.header.authorization.replace("Bearer ", "");
    const query = {
      token,
      page: 1,
      pageSize: 1,
    };

    let [err, res] = await tokenMode.getData(query);
    let { data = [], total = 0, totalPages = 0 } = res || {};

    let userId = data[0].userId;
    const query2 = {
      id: userId,
      page: 1,
      pageSize: 1,
    };
    let [err2, res2] = await mode.getData(query2);

    let userInfo = res2.data.length ? res2.data[0] : null;
    userInfo && delete userInfo.passWord;

    let result = {
      code: !err2 ? 200 : 400,
      data: userInfo,
      msg: !err2 ? "ok" : err2.msg || err2.code,
    };
    ctx.body = result;
  }

  /**
   * 退出登录
   * @param {*} param
   */
  static async logout(ctx) {
    let token = ctx.request.header.authorization.replace("Bearer ", "");
    const query = {
      token,
      page: 1,
      pageSize: 1,
    };

    let [err, res] = await tokenMode.getData(query);
    let { data = [], total = 0, totalPages = 0 } = res || {};

    let id = data[0].id;
    const query2 = {
      id,
    };
    let [err2, res2] = await tokenMode.delete(query2);

    let result = {
      code: !err2 ? 200 : 400,
      data: null,
      msg: !err2 ? "ok" : err2.msg || err2.code,
    };
    ctx.body = result;
  }

  /**
   * 获取图片验证码
   * @param {Context} ctx
   */
  static async captchaImage(ctx) {
    ctx.body = {
      captchaEnabled: !true,
      code: 200,
      img: "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAA8AKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDtrW1ga1hZoIySikkoOeKsCztv+feL/vgU2z/484P+ua/yqyKiMY8q0IjGPKtCIWdr/wA+0P8A3wKeLK1/59of+/YqUUNIsalnYKoGSScAU+SPYfLHsMFlaf8APrD/AN+xThY2n/PrB/37Fc4/xE8MRXZt21NdwOCwRioP1Aro7K/tL+ETWlxFPGejRuGH6VvVwdWkk6lNxT7qwkoPYeLCz/59YP8Av2KcLCz/AOfSD/v2KnFOFYcsew+WPYhGn2X/AD6W/wD37H+FOGnWX/Pnb/8Afpf8KnHFc74m8caR4UEa3zySTyAlIYVDMQO5yQAPrWtHDSrzVOlG7fRIGopXZvDTrH/nzt/+/S/4U4abY/8APlb/APfpf8Kh0jUV1XS7W+ETRC4iWURuRlQRkZ98VoCs5U1FtNaoOWPYrjTLD/nytv8Av0v+FPGmWH/Pjbf9+l/wqwKx9e8WaN4ZWI6pdiEzZ8tQpYtjrwPqOaunQdWShTjdvoldg4xW6NIaXp//AD423/flf8KeNK0//nwtf+/K/wCFZGj+NfDutnbY6rbvJ/zzdtj/AJNgn8K6JSDRUoSpS5akbPzVgSi9isNK07/nwtf+/K/4U4aTp3/QPtf+/K/4VaFPFZ8sewcsexVGk6b/ANA+0/78r/hVbU9L0+PSL10sbVXWByrCFQQdp5HFawqrq3/IFv8A/r3k/wDQTSlGPK9BSjHlehyVn/x5wf8AXNf5VZFV7P8A484P+ua/yqyKcfhQ4/Chegrzf4p67Pa6XFYW7lPtLESEddo7V6O/3DXlHxKsnu4EkUEvCxIHqD1/p+Vepk8qUcdSdb4b/wDDfjYVS/K7FPw/pmlDT4YpLWCeWRdzGQAk5rtPCehWejX01xZCSNZlCmIuSq85yM15R4c0q01WGUTTzRzIQFZG+76V02l+LNS8I6nHZawxvLB+I5x94D1z3xnkV7GNwmIq1qtClXc59Yu6v101advl5GcZJJNo9rQ5AqQVw/iHxDr6xWbeGra0uYbiPe08rfdHBBAJHUH3rDj8X+OtMPmX2kWt/B/ELc4f8ME/+gmvEpZfOrFSU4pvo5JP7nt8zVzSPRdY1OLStNnu5mwkSFjXzb4ivbvVr/8AtW7YlrolkX+6oOAK7Xxn45i8Q+GhFBDNbMZxHcRSjleMjp2OD+R4ridZvbO5jhitizCEBQ2MDGK+nyDCVsJOE3Tbcm09Phil36XbT80jCrJSW59B+D7r7RotmV+75KY+m0V1S9K8I+H/AI7NvJaaHeR7InBijuVfBUnO0Yx+A/Ct4+KviBpLNDNp9lqkYJCXCYVmHqQCMfkK8DEZPXo15UptRe6u0rq71TenybTNVUTV0etE8VzOuWFtdzrPPaRTyIpVWkQNtHtmuGk1Lx/4hOye9tdEtz1EHMhH1BJz+IrvPD0ax6NDYzaj/aE9uu2Sdj87cnG4ZPPbk9q5a2H+rJNVE5dotu3z2+5spO/Q8v8AGeiacmnzX1vbJZ3cI3B4BsDfUDv711nwf8QX2o6JPBfSvKIJAkTuckjGcVyHxX1F49Qi0uIbI3UOzevNdl8OtM/s/T4oUHH3mPqTXrYmpOOUQjiHzSnK8b62S31/QzS/eOx6gvIqQVHGPlFSivnDYcKq6t/yBL//AK9pP/QTVsVV1f8A5Al//wBe0n/oJqZfCyZfCzkrP/jyg/65r/KrIqvZf8eUH/XNf5VZFEfhQR+FCkZFcz4h0n7VExAzXUCmyQrIpBFUUeH3GgXmk3pv9NTeR/rbf++O+Kp+INX03VNI2q5WdWysbjDK3cV6/faQCSyLzXJaj4Ziu7oSS2sbuP4itezhczgqkKmIi3KFrSTs7Lo77r8empnKGjS6jPASXNz4agil3YUsEz/dzxXTtpE6jIzVrw7pn2WJV2hQOgArqBCpHSvNxVb29edW1uZt29S4qyseW67oL30DRTxb1P58e9cvL4W+zxnybYL74yfzNe6yWEUnVRVabRoXjI2CpVeqoezUny9r6fcFle5872EV5oGsiY20ktoeJcJuGwnv7j+leha1FrE9lb3Oi3UfzDJVwCrqRkEHH+c11D+Ggl1vVe9ai6NuhC4xXbiMyliJwq1IpzirNvXm9V38yVC10jyQeH9c1Rsatq7LEesVvwD9eg/Q12nhDwnY6Fdm7spLoSshRw8gKuPcY9a6mHw6gbJFbFrpiQjgVFXMsRUg6d+WL6JJL7lv8xqCWp5r400C21NvtF3bSSmFSQYvv47getavw18QaPqcb6fYPN5lrGvE4AZl6ZHPOOAfqK6/UdPDpkLzWVoWiWmmXby2thbwSOTueOIKxz7is414ug6VVydvh10XfTz8gtrdHZr0qQVHFnaKlFchQ4VV1f8A5Al//wBe0n/oJq2Kq6v/AMgS/wD+vaT/ANBNTL4WTL4WclZf8eVv/wBc1/lVkVzMWtXMUSRqkRCKFGQe341J/b91/wA84f8Avk/41lGtGyM41Y2R0opwrmf+Ehu/+ecH/fJ/xpf+Eiu/+ecH/fJ/xqvbRH7aJ0xQMORUf2OMnO0Vz3/CSXn/ADyg/wC+T/jS/wDCS3n/ADyg/wC+T/jR7aIe2idRFEqDgVOBXI/8JPe/88rf/vlv8aX/AISi9/55W/8A3y3+NHtoh7aJ14p4Ga47/hKr7/nlb/8AfLf40v8Awld9/wA8rb/vlv8AGj20Q9tE7Dy1J6VIqAVxn/CW3/8Azxtv++W/xpf+Ev1D/njbf98t/wDFUe2iHtonbBR6U8CuH/4TDUP+eNr/AN8t/wDFUv8AwmWo/wDPG1/75b/4qj20Q9tE7howw5pqW6KcgVxX/CZ6j/zxtf8Avhv/AIql/wCE11L/AJ4Wn/fDf/FUe2iHtoneqMU8VwH/AAm2pf8APC0/74b/AOKpf+E41P8A54Wn/fDf/FUe2iHtonoIqrq//ID1D/r2k/8AQTXFf8Jzqf8AzwtP++G/+KqO58Z6jdWs1u8NqElRkYqrZAIxx81TKtGzFKrGzP/Z",
      msg: "操作成功",
      uuid: "ba4cc389f8964458964eab45e5570e59",
    };
  }
  /**
   * 获取路由
   * @param {Context} ctx
   */
  static async getRouters(ctx) {
    ctx.body = {
      msg: "操作成功",
      code: 200,
      data: [
        {
          name: "System",
          path: "/system",
          hidden: false,
          redirect: "noRedirect",
          component: "Layout",
          alwaysShow: true,
          meta: {
            title: "系统管理",
            icon: "system",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "User",
              path: "user",
              hidden: false,
              component: "system/user/index",
              meta: {
                title: "用户管理",
                icon: "user",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Role",
              path: "role",
              hidden: false,
              component: "system/role/index",
              meta: {
                title: "角色管理",
                icon: "peoples",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Menu",
              path: "menu",
              hidden: false,
              component: "system/menu/index",
              meta: {
                title: "菜单管理",
                icon: "tree-table",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Dept",
              path: "dept",
              hidden: false,
              component: "system/dept/index",
              meta: {
                title: "部门管理",
                icon: "tree",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Post",
              path: "post",
              hidden: false,
              component: "system/post/index",
              meta: {
                title: "岗位管理",
                icon: "post",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Dict",
              path: "dict",
              hidden: false,
              component: "system/dict/index",
              meta: {
                title: "字典管理",
                icon: "dict",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Config",
              path: "config",
              hidden: false,
              component: "system/config/index",
              meta: {
                title: "参数设置",
                icon: "edit",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Notice",
              path: "notice",
              hidden: false,
              component: "system/notice/index",
              meta: {
                title: "通知公告",
                icon: "message",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Log",
              path: "log",
              hidden: false,
              redirect: "noRedirect",
              component: "ParentView",
              alwaysShow: true,
              meta: {
                title: "日志管理",
                icon: "log",
                noCache: false,
                link: null,
              },
              children: [
                {
                  name: "Operlog",
                  path: "operlog",
                  hidden: false,
                  component: "monitor/operlog/index",
                  meta: {
                    title: "操作日志",
                    icon: "form",
                    noCache: false,
                    link: null,
                  },
                },
                {
                  name: "Logininfor",
                  path: "logininfor",
                  hidden: false,
                  component: "monitor/logininfor/index",
                  meta: {
                    title: "登录日志",
                    icon: "logininfor",
                    noCache: false,
                    link: null,
                  },
                },
              ],
            },
          ],
        },
        {
          name: "Monitor",
          path: "/monitor",
          hidden: false,
          redirect: "noRedirect",
          component: "Layout",
          alwaysShow: true,
          meta: {
            title: "系统监控",
            icon: "monitor",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "Online",
              path: "online",
              hidden: false,
              component: "monitor/online/index",
              meta: {
                title: "在线用户",
                icon: "online",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Job",
              path: "job",
              hidden: false,
              component: "monitor/job/index",
              meta: {
                title: "定时任务",
                icon: "job",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Druid",
              path: "druid",
              hidden: false,
              component: "monitor/druid/index",
              meta: {
                title: "数据监控",
                icon: "druid",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Server",
              path: "server",
              hidden: false,
              component: "monitor/server/index",
              meta: {
                title: "服务监控",
                icon: "server",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Cache",
              path: "cache",
              hidden: false,
              component: "monitor/cache/index",
              meta: {
                title: "缓存监控",
                icon: "redis",
                noCache: false,
                link: null,
              },
            },
            {
              name: "CacheList",
              path: "cacheList",
              hidden: false,
              component: "monitor/cache/list",
              meta: {
                title: "缓存列表",
                icon: "redis-list",
                noCache: false,
                link: null,
              },
            },
          ],
        },
        {
          name: "Tool",
          path: "/tool",
          hidden: false,
          redirect: "noRedirect",
          component: "Layout",
          alwaysShow: true,
          meta: {
            title: "系统工具",
            icon: "tool",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "Build",
              path: "build",
              hidden: false,
              component: "tool/build/index",
              meta: {
                title: "表单构建",
                icon: "build",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Gen",
              path: "gen",
              hidden: false,
              component: "tool/gen/index",
              meta: {
                title: "代码生成",
                icon: "code",
                noCache: false,
                link: null,
              },
            },
            {
              name: "Swagger",
              path: "swagger",
              hidden: false,
              component: "tool/swagger/index",
              meta: {
                title: "系统接口",
                icon: "swagger",
                noCache: false,
                link: null,
              },
            },
          ],
        },
        // 模型设计
        {
          name: "Model",
          path: "/model",
          hidden: false,
          redirect: "noRedirect",
          component: "Layout",
          alwaysShow: true,
          meta: {
            title: "模型",
            icon: "tool",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "ModelList",
              path: "index",
              hidden: false,
              component: "model/list/index",
              meta: {
                title: "模型",
                icon: "build",
                noCache: false,
                link: null,
              },
            }
          ],
        },
        // 接口
        {
          name: "Routes",
          path: "/routes",
          hidden: false,
          redirect: "noRedirect",
          component: "Layout",
          alwaysShow: true,
          meta: {
            title: "接口",
            icon: "tool",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "RoutesList",
              path: "index",
              hidden: false,
              component: "routes/list/index",
              meta: {
                title: "接口",
                icon: "build",
                noCache: false,
                link: null,
              },
            }
          ],
        },
        {
          name: "Http://ruoyi.vip",
          path: "http://ruoyi.vip",
          hidden: false,
          component: "Layout",
          meta: {
            title: "若依官网",
            icon: "guide",
            noCache: false,
            link: "http://ruoyi.vip",
          },
        },
      ],
    };
  }
}
