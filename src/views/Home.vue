<template>
    <el-container>
        <div style="width: 200px;background-color: #222f3e">
            <el-aside :width="isCollapse?'60px':'200px'">
                <el-col :gutter="20">
                    <el-row :span="4">
                        <div class="logo">
                            <img class="icon" src="../assets/logo.png">
                            <div class="sys-name" v-show="!isCollapse">以梦系统</div>
                        </div>
                    </el-row>
                    <el-row :span="20">
                        <el-menu :default-active="activePath" class="el-menu-vertical-demo"
                                 background-color="#222f3e" text-color="#fff" active-text-color="#ffd04b"
                                 :collapse="isCollapse" :unique-opened="true"
                                 :collapse-transition="false" :router="true">
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
                    </el-row>
                </el-col>
            </el-aside>
        </div>
        <el-container>
            <el-header>
                <el-menu :default-active="activePath1" class="el-menu-demo" mode="horizontal"
                         background-color="#576574" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="1" class="user-icon">
                        <template slot="title">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
                            </el-avatar>
                        </template>
                        <el-menu-item index="1-1" @click="logout">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
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

<style scoped lang="less">

    .el-aside {
        height: 100vh;
        background-color: #222f3e;
        line-height: 200px;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-menu-demo {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: flex-end;
        align-items: center;

    }

    .el-menu-vertical-demo {
        border: 0;
    }

    .logo {
        background-color: #222f3e;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;

        .sys-name {
            font-size: 20px;
            color: #ffffff;
            margin-left: 10px;
        }
    }

    .el-header {
        background-color: #576574;
    }
</style>
