<template>
    <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">大洋门窗系统后台</h3>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="员工登录" name="first">
                <el-form-item prop="account">
                    <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" auto-complete="off"
                              placeholder="密码"></el-input>
                </el-form-item>
                <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin"
                               :loading="logining">登录
                    </el-button>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="员工注册" name="second">
                <el-form-item prop="account">
                    <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" auto-complete="off"
                              placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click.native.prevent="handlesignup"
                               :loading="logining">注册
                    </el-button>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
        <h3 class="title"></h3>
    </el-form>
</template>

<script>
    import {login, signup} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            return {
                logining: false,
                activeName: 'first',
                loginForm: {
                    account: '',
                    checkPass: ''
                },
                rules2: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },

            handleLogin(ev) {
                var _this = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        let username = this.loginForm.account;
                        let password = this.loginForm.checkPass;

                        login(username, password).then(response => {
                            let {code, data} = response.data;
                            if (code === "SUCCESS") {
                                let user = {
                                    id: data.id,
                                    username: data.loginName,
                                    avatar: '../../static/img/user.png',
                                    name: data.loginName
                                };

                                sessionStorage.setItem('user', JSON.stringify(user));
                                this.$router.push({path: '/table'});
                            } else {
                                this.$message({
                                    message: '账号或密码错误',
                                    type: 'error'
                                });
                                this.logining = false;
                            }
                        }).catch(error => {
                            console.log('error submit!!', error);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            handlesignup(ev) {
                var _this = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        //NProgress.start();
                        let username = this.loginForm.account;
                        let password = this.loginForm.checkPass;

                        signup(username, password).then(response => {
                            let {code, data} = response.data;

                            if (code === "SUCCESS") {
                                this.$message({
                                    message: '注册成功',
                                    type: 'success'
                                });
                                this.activeName = 'first'
                            } else {
                                this.$message({
                                    message: '处理失败',
                                    type: 'failure'
                                });
                            }
                        }).catch(error => {
                            console.log('error submit!!', error);
                        })
                    }else{
                        console.log("sign up form validation failed")
                        return false;
                    }
                })
            }

        }
    }


</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>