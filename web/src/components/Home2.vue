<template>
  <div class="home-page">
    <!-- <div class="clock-date container" >
      <div class="time">
        <div class="time-h">01</div>
        <div class="dots">:</div>
        <div class="time-m">05</div>
      </div>
      <div class="date">
        <span>星期日</span>
        <span>八月</span>
        <span>18</span>
      </div>
    </div> -->
    <div class="head">
      <div class="left"></div>
      <div class="right">
        <div class="items">
          <div class="item login" v-if="!userInfo.id" @click="loginDialogShow=true">登录</div>
          <el-popover
            class="item"
            placement="bottom"
            :width="200"
            trigger="hover"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <img class="face" v-if="userInfo.face" :src="userInfo.face" alt="">
              <img class="face" v-else src="../assets/face.png" alt="">
            </template>
            <div class="logout" @click="handleLoout">退出</div>
          </el-popover>
          <div class="item">{{ userInfo.nick }}</div>
        </div>
      </div>
    </div>
    <div class="container  mx-auto search-warp">
      <el-input class="search" v-model="searchKey" @change="serach" placeholder="" />
    </div>
    <div class="types container mx-auto mt-2.5">
      <div class="nav-items flex">
        <div class="nav-type px-2 border-solid border rounded mr-2.5" :class="{'active': activeTypeId == item.id}" v-for="item in navTypes" :key="item.defineModel" @click="setUrls(item)" @contextmenu.prevent="event => openContextMenu(event, item.id)">{{ item.name }}</div>
        <div v-if="isAdmin" class="nav-type px-2 border-solid border rounded" @click="openTypeCreate('create')">+</div>
      </div>
    </div>
    <div class="urls container mx-auto flex mt-2.5">
      <div class="url-item px-2 rounded cursor-pointer mr-2.5" v-for="item in urls" @contextmenu.prevent="event => openContextMenu2(event, item.id)" @click="openPage(item)">
        <div class="icon">
          <img :src="item.icon || 'https://img.omnitab.link/icons/2553.png'"/>
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
      <div v-if="isAdmin" class="url-item create px-2 rounded cursor-pointer mr-2.5" @click="openUrlCreate('create')">
        +
      </div>
    </div>

    <div v-if="showMenu" id="typeModal" class="menu-warp" :style="menuStyle">
      <div @click="handleTypeEdit" class="menu-item cursor-pointer min-w-10">
        <i></i>
        <span>编辑</span>
      </div>
      <div @click="handleTypeDelete" class="menu-item cursor-pointer min-w-10">
        <i></i>
        <span>删除</span>
      </div>
    </div>

    <div v-if="showMenu2" id="urlModal" class="menu-warp" :style="menuStyle">
      <div @click="handleUrlEdit" class="menu-item cursor-pointer min-w-10">
        <i></i>
        <span>编辑</span>
      </div>
      <div @click="handleUrlDelete" class="menu-item cursor-pointer min-w-10">
        <i></i>
        <span>删除</span>
      </div>
    </div>

    <TypeDialog v-model="typeDialogShow" :mode="typeMode" :formData="typeformData" :id="typeId" @finsh="handleGetDatas"></TypeDialog>
    <UrlDialog v-model="urlDialogShow" :mode="urlMode" :formData="urlformData" :parentId="activeTypeId" :id="urlId" @finsh="finsh2"></UrlDialog>
    <LoginDialog v-model="loginDialogShow" @finsh="loginFinsh"></LoginDialog>
  </div>
</template>
<script setup>
import { create, update, getData, getDetails, del, getDatas } from '@/api/nav.js'
import { create as createUrl, update as updateUrl, del as delUrl, updateUrl as updateUrl2, getData as getUrlData } from '@/api/urls.js'
import { getUserInfo, logout } from '@/api/user.js'
import { ElMessage } from "element-plus";
import { getToken, removeToken } from '@/utils/auth.js'
import TypeDialog from './TypeDialog.vue'
import UrlDialog from './UrlDialog.vue'
import LoginDialog from './LoginDialog.vue'

const navTypes = ref([])
const showMenu = ref(false)
const showMenu2 = ref(false)
const fixedX = ref(0)
const fixedY = ref(0)
const menuStyle = computed(()=>{
  return {
    top: fixedY.value+'px',
    left: fixedX.value+'px'
  }
})
const searchKey = ref('')
const typeDialogShow = ref(false)
const urlDialogShow = ref(false)
const loginDialogShow = ref(false)
const userInfo = ref({})

const typeMode = ref('create')
const urlMode = ref('create')
const typeformData = ref({name:''})
const activeTypeId = ref('')
const urlformData = ref({
  name:'',
  url: '',
  icon: '',
  code: ''
})
const typeId = ref('')
const urlId = ref('')

const urls = computed(()=>{
  let info = navTypes.value.find(item=>{
    return item.id == activeTypeId.value;
  })
  return info?.children || [];
})

const isAdmin = !!userInfo.value.token

// 查询列表
async function handleGetData() {
  let { code, data: { list }, msg } = await getData({page: 1, pageSize: 999});
  if (code == 200) {
    navTypes.value = list
  }
}

// 查询列表(带children)
async function handleGetDatas(params) {
  let { code, data: { list }, msg } = await getDatas({page: 1, pageSize: 999});
  let res2 = await getUrlData({page: 1, pageSize: 999, parentId: ''});

  if (code == 200) {

    // 待分配
    let dfps = {
      createTime: "",
      delstatus: "0",
      id: 'd999999',
      name: "待分配",
      status: "1",
      updateTime: "",
      children: res2.data.list || []
    }
    list.push(dfps)

    navTypes.value = list
    if (list.length && params?.refresh) {
      activeTypeId.value = list[0].id
    }
  }
}

// 新增
async function handleTypeCreate() {
  let { code, data, msg } = await create({name: 123123});
  if (code == 200) {
    // todo
  }
}

// 新增
async function handleCreateurl() {
  let { code, data, msg } = await createUrl(
    { parentId: 2,
      name: 123123,
      url: 'url',
      icon:'icon',
    }
  );
  if (code == 200) {
    // todo
  }
}


// 查询详情
async function getDetail() {
  let { code, data, msg } = await getDetails({id: 2});
  if (code == 200) {
    // todo
  }
}



function openContextMenu(event, id) {
  if(id == 'd999999') return
  let { pageX=0, pageY=0 } = event
  fixedX.value = pageX + 20;
  fixedY.value = pageY;
  showMenu.value = true;
 
  typeId.value = id
}

function openContextMenu2(event, id) {
  let { pageX=0, pageY=0 } = event
  fixedX.value = pageX + 20;
  fixedY.value = pageY;
  showMenu2.value = true;
 
  urlId.value = id
}


// 打开新增type弹窗
function openTypeCreate(type) {
  typeMode.value = type
  typeformData.value = { name: '' }
  typeDialogShow.value = true;
  typeId.value = ''
}

// 打开新增url弹窗
function openUrlCreate(type) {
  urlMode.value = type
  urlformData.value = { name: '', url: '', icon: '', code: '' }
  urlDialogShow.value = true;

  urlId.value = ''
}

// 编辑导航分类
async function handleTypeEdit() {
  typeMode.value = 'edit'
  typeformData.value = {name: ''}
  typeDialogShow.value = true;
}

// 编辑url
async function handleUrlEdit() {
  urlMode.value = 'edit'
  urlformData.value = { name: '', url: '', icon: '', code: '' }
  urlDialogShow.value = true;
}
// 删除导航分类
async function handleTypeDelete() {
  let { code, data, msg } = await del({id: typeId.value});
  if (code == 200) {
    await handleGetDatas()
    changeMenuStatus()
  }
}
// 删除导航分类
async function handleUrlDelete() {
  let { code, data, msg } = await delUrl({id: urlId.value});
  if (code == 200) {
    await handleGetDatas()
    changeMenuStatus2()
  }
}


// 设置Urls
function setUrls(data) {
  if (data) {
    activeTypeId.value = data.id
  }
}

// 切换右键菜单
function changeMenuStatus(flag =false) {
  showMenu.value = flag;
}

// 切换右键菜单
function changeMenuStatus2(flag =false) {
  showMenu2.value = flag;
}

function finsh2() {
  urlformData.value = { name: '', url: '', icon: '', code: '' }
  urlDialogShow.value = false;
  changeMenuStatus2(false)
  handleGetDatas()
}

function loginFinsh() {
  loginDialogShow.value = false
  
  init()
}


function serach() {
  let href = `https://www.baidu.com/s?wd=${searchKey.value}`
  window.open(href, '_blank')
  searchKey.value = ''
}

function openPage(params) {
  window.open(params.url, '_blank')
}

// 获取用户信息
async function getUerInfos() {
  if(!getToken()) return
  let { code, data, msg } = await getUserInfo();
  if (code == 200) {
    userInfo.value = data
  }
}

// 退出
async function handleLoout() {
  let { code, data, msg } = await logout();
  if (code == 200) {
    ElMessage({
        message: '退出成功',
        type: 'success',
    })
    removeToken()
    userInfo.value = {}
  }
}

function init() {
  getUerInfos()
  handleGetDatas({refresh: true})
}

init()
onMounted(()=>{
  window.onclick = function(event) {
    let typeModal = document.getElementById("typeModal");
    let urlModal = document.getElementById("urlModal");
    if (event.target != typeModal || event.target != urlModal) {
      showMenu.value = false;
      showMenu2.value = false;
    }
  }

  const scrollContainer = document.getElementsByClassName('types')[0];
  let isScrolling;

  scrollContainer.addEventListener('wheel', (e) => {
    // 使用requestAnimationFrame来平滑滚动效果
    if (isScrolling) return;
    isScrolling = true;

    requestAnimationFrame(() => {
      // 计算滚动步长，这里以每轮滚动10px为例
      const step = e.deltaY / 4;
      // 设置滚动位置
      scrollContainer.scrollLeft  += step;
      // 重置滚动状态
      isScrolling = false;
    });
  });

  getUerInfos()
})
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
.types {
  padding: 0 12px;
  cursor: pointer;
  overflow-x: auto;
  overflow-y: hidden;
  .nav-type {
    margin-top: 5px;
    margin-right: 10px;
    background-color: rgba(191, 191, 191, 0.36);
    color: white;
    padding: 0px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    word-break: keep-all;
    &.active {
      background-color: #e7e7e7;
      color: #333333;
    }
  }
}
.urls {
  // padding: 0 12px;
  flex-wrap: wrap;
  .url-item {
    position: relative;
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .icon {
      width: 70px;
      height: 70px;
      padding: 5px;
      img {
        width: 100%;
        border-radius: 20%;
        transition: transform 0.3s;
        box-shadow: unset;
      }
    }
    .name {
      display: block;
      width: 70px;
      text-shadow: unset;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      text-align: center;
      margin-top: 1px;
      font-size: 12px;
    }
    &.create {
      width: 58px;
      height: 58px;
      border: 1px solid #fff;
      margin-top: 5px;
      font-size: 32px;
      color: #fff;
      margin-left: 14px;
    }
  }
}
.menu-warp {
  width: 118px;
  position: fixed;
  z-index: 21;
  border-radius: 8px;
  overflow: hidden;
  background-color: #0b0b0bcc;
  box-shadow: 0 2px 8px #0000004d;
  backdrop-filter: blur(7px);
  padding: 5px 0;
  .menu-item {
    display: flex;
    align-items: center;
    padding: 5px 15px 5px 10px;
    color: #fff;
    font-size: 12px;
    &:hover {
      cursor: pointer;
      background-color: #ffffff1a;
    }
  }
}
/* 滚动条样式 */
.types::-webkit-scrollbar {
     width: 2px; /*  设置纵轴（y轴）轴滚动条 */
     height: 2px; /*  设置横轴（x轴）轴滚动条 */
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

.clock-date {
  padding-bottom: 20px;
  color: #fff;
  .time {
    font-weight: 400;
    font-size: 50px;
    display: flex;
    .time-h {

    }
    .dots {
      color: #fff;
      margin: 0 6px;
      vertical-align: calc(50px / 12);
      animation: blink-clock-dot 1s linear infinite
    }
    .time-m {

    }
  }
  .date {
    span {
      display: inline-block;
      margin-right: 10px;
    }
  }
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
    .items{
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


