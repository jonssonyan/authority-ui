<template>
    <div>
        <el-row class="tac">
            <el-col :span="12">
                <h5>默认颜色</h5>
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose">
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Consumer",
        data() {
            return {}
        },
        methods: {},
        created() {

        }
    }
</script>

<style scoped lang="less">

</style>
