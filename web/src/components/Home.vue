<template>
  <div class="home-page">
    <div class="head">
      <div class="left"></div>
      <div class="right">
        <div class="items">
          <div class="item login" v-if="!userInfo.id" @click="loginDialogShow = true">登录</div>
          <el-popover class="item" placement="bottom" :width="200" trigger="hover"
            content="this is content, this is content, this is content">
            <template #reference>
              <img class="face" v-if="userInfo.face" :src="userInfo.face" alt="">
              <img class="face" v-else src="../assets/face.png" alt="">
            </template>
          </el-popover>
          <div class="item">{{ userInfo.nick }}</div>
        </div>
      </div>
    </div>
    <div class="tools">
      <div class="item">
        <div class="name">开启监控：</div>
        <div class="right">
          <el-switch v-model="open" :loading="opening" @change="openJk" />
        </div>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button type="danger" @click="handleCreate">新增</el-button>
      </div>
    </div>
    <div class="table-warp">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>

    <LoginDialog v-model="loginDialogShow" @finsh="loginFinsh"></LoginDialog>

    <GoodDialog v-model="goodDialogShow" :mode="goodInfo" @finsh="goodFinsh"></GoodDialog>
  </div>
</template>
<script setup>
import LoginDialog from './LoginDialog.vue'
import GoodDialog from './GoodDialog.vue'
import { update, getDetails, getData, del } from '@/api/config.js'
import { getData as getGood } from '@/api/good.js'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const loginDialogShow = ref(false)
const userInfo = ref({
  id: '',
  face: '',
  nick: ''
})
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  }
])
const open = ref(false);
const opening = ref(false);
const openJk = async () => {
  opening.value = true;
  let params = {
    open: open.value ? 1 : 0,
    // w: [
    //   {
    //     a: 'aaa',
    //     b: 'bbb',
    //     c: 'ccc'
    //   },
    //   {
    //     d: 'ddd',
    //     e: 'eee'
    //   }
    // ]
  }
  let { code, data, msg } = await update(params)
  opening.value = false;
  if (code == 200 ) { }
}

// 登录完成
function loginFinsh() {
  loginDialogShow.value = false
  init()
}

// 获取默认配置
async function getConfigs() {
  let params = {
    name: '默认配置'
  }
  let { code, data, msg } = await getDetails(params);
  if (code == 200) {
    open.value = data.open == 0 ? false : true
  }
}

// 获取默认配置详情
async function getDatas() {
  let { code, data, msg } = await getData();
  if (code == 200) {
  }
}

// 删除
async function handleDelete() {
  let { code, data, msg } = await del({w:[{name: '默认配置'}]});

  if (code == 200) {
    proxy.$Notif({
      title: '删除成功！',
      message: msg,
      type: 'success',
    })
  } else {
    proxy.$Notif({
      title: '删除失败！',
      message: msg,
      type: 'warning',
    })
  }
}


// 商品相关
const goodInfo = ref({
  name: 'name',
  price: '99',
  picture: '',
  code: '0001',
  url: '132'

})
const goodDialogShow = ref(false)

function handleCreate() {
  goodDialogShow.value = true
}
function goodFinsh() {

}
async function getGoods() {
  let { code, data, msg } = await getGood();
  if (code == 200) {
  }
}


// 初始化
function init() {
  getConfigs()
  // getDatas()

  // 获取商品
  getGoods()
}

init()

</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;
  background: url('https://img.omnitab.link/gallery/wallpaper/45001.jpg?imageView2/2/w/1920/format/webp/interlace/1') no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.search-warp {
  padding: 0 12px;
  margin-top: 150px;
  width: 100%;

  .search {
    width: 100%;
    border-radius: 50%;
  }
}

.tools {
  .item {
    display: flex;
    height: 32px;
    align-items: center;
  }
}












/* 滚动条样式 */
.types::-webkit-scrollbar {
  width: 2px;
  /*  设置纵轴（y轴）轴滚动条 */
  height: 2px;
  /*  设置横轴（x轴）轴滚动条 */
}

/* 滚动条滑块（里面小方块） */
.types::-webkit-scrollbar-thumb {
  border-radius: 10px;
  //  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: transparent;
}

/* 滚动条轨道 */
.types::-webkit-scrollbar-track {
  border-radius: 0;
  //  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: transparent;
}

.head {
  display: flex;
  justify-content: space-between;

  .left {
    width: 50%;
  }

  .right {
    width: 50%;
    padding: 8px 0;
    display: flex;
    justify-content: right;

    .items {
      display: flex;

      .face {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        cursor: pointer;
      }

      .item {
        display: flex;
        align-items: center;
        margin-right: 10px;

        &.login {
          // color: #409EFF;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
