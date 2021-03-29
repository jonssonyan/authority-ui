<template>
    <div id="app">
        <div class="menu" :width="isCollapse?'64px':'201px'">
            <div class="nav">
                <el-menu :default-active="activePath" class="el-menu-vertical-demo"
                         background-color="#222f3e" text-color="#fff" active-text-color="#ffd04b"
                         :collapse="isCollapse" :unique-opened="true"
                         :collapse-transition="false" :router="true">
                    <div class="logo">
                        <img class="icon" src="../assets/logo.png">
                        <div class="sys-name" v-show="!isCollapse">以梦系统</div>
                    </div>
                    <!--一级菜单-->
                    <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
                        <!--一级菜单模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="item.icon"></i>
                            <!--文本-->
                            <span>{{item.name}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="'/'+menu.router"
                                      v-for="menu in item.menuLists" :key="menu.id"
                                      @click="saveNavState('/'+menu.router)">
                            <template slot="title">
                                <!--图标-->
                                <i :class="menu.icon"></i>
                                <!--文本-->
                                <span>{{menu.name}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <div class="home">
            <div class="head">
                <div class="radio-group" style="background-color: #576574; height: 59px;">
                    <div @click="toggleCollapse" v-show="!isCollapse">
                        <svg t="1612014675759" class="icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="8184" xmlns:xlink="http://www.w3.org/1999/xlink"
                             width="30px" height="30px">
                            <path
                                    d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM400 646c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zM904 160H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM904 792H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4 0.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1c-4.5 3.5-4.5 10.3 0 13.8z"
                                    p-id="8185"></path>
                        </svg>
                    </div>
                    <div @click="toggleCollapse" v-show="isCollapse">
                        <svg t="1612014669949" class="icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="8054" xmlns:xlink="http://www.w3.org/1999/xlink"
                             width="30px" height="30px">
                            <path
                                    d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM400 646c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zM904 160H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM904 792H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519c4.5-3.5 4.5-10.3 0-13.9L142.4 381.9c-5.8-4.6-14.4-0.5-14.4 6.9v246.3c0 7.4 8.5 11.6 14.4 7z"
                                    p-id="8055"></path>
                        </svg>
                    </div>
                </div>
                <el-menu :default-active="activePath1" class="el-menu-demo" mode="horizontal"
                         background-color="#576574" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="2" class="user-icon">
                        <template slot="title">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
                            </el-avatar>
                        </template>
                        <el-menu-item index="2-3" @click="logout">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Home2",
        data() {
            return {
                menuList: [],
                isCollapse: false,
                activePath: '',
                activePath1: '',
                menuListForm: {
                    pageSize: 1,
                    pageNum: -1
                }
            }
        },
        async created() {
            let {data: res} = await this.$http.post('/api/menuList/selectList', this.menuListForm);
            if (res.code !== 1) {
                this.$message.error(res.msg)
            } else {
                this.menuList = res.data
            }
            // 记录上一次激活的菜单
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout: function () {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            toggleCollapse: function () {
                this.isCollapse = !this.isCollapse
            },
            saveNavState: function (activePath) {
                window.sessionStorage.setItem('activePath', activePath)
            }
        }
    }
</script>

<style lang="less" scoped>
    * {
        /*去除内边距和外边距*/
        margin: 0;
        padding: 0;
        /*让边框不占宽度和高度*/
        box-sizing: border-box;
    }

    #app {
        /*声明弹性盒模型*/
        display: flex;
    }

    #app .menu {
        /*高度撑满*/
        height: 100vh;
        display: flex;
        flex-direction: column;
        position: fixed;
        width: 20%;
    }

    #app .menu .logo {
        background-color: #222f3e;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #app .menu .logo .sys-name {
        font-size: 20px;
        color: #ffffff;
        margin-left: 10px;
    }

    #app .menu .nav {
        flex: 1;
    }

    #app .menu .nav .el-menu-vertical-demo {
        border: none;
        height: 100%;
    }

    #app .home {
        flex: 1;
        display: flex;
        /*排列方向竖向*/
        flex-direction: column;
        height: 100vh;
        padding-left: 200px;
    }

    .home .head {
        height: 60px;
        display: flex;
    }

    .home .head .radio-group {
        height: 60px;
        width: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .home .head .el-menu-demo {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: flex-end;
        flex-grow: 1;
    }

    .home .head .el-menu-demo .home .head .item {
        width: 20px;
        height: 40px;
    }

    .home .main {
        margin: 10px;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>
