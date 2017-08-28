<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.chineseName">
                        <template slot="prepend">姓名</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.mobile">
                        <template slot="prepend">手机</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getCustomers">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="15" class="toolbar" style="width: 100%;">共 {{total}} 条数据</el-col>
        <!--列表-->
        <el-table :data="customers" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="id" label="客户ID" width="100" sortable></el-table-column>
            <el-table-column prop="chineseName" label="姓名" width="100" sortable></el-table-column>
            <el-table-column prop="gender" label="性别" :formatter="formatGender" width="90" sortable></el-table-column>
            <el-table-column prop="mobile" label="电话" width="140" sortable></el-table-column>
            <el-table-column prop="provinceName" label="省" width="80"></el-table-column>
            <el-table-column prop="cityName" label="市" width="100"></el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="30"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
       searchCustomer
    } from '../../api/api';
    import {provinceList, cityMap} from '../../api/data/city';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";


    export default {
        components: {ElFormItem},
        data() {
            return {
                filters: {
                    mobile: '',
                    chineseName:''
                },
                customers: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                provinces: provinceList,
                cityMapData: cityMap
            }
        },
        methods: {
            formatGender: function (row, column) {
                return row.gender === 0 ? '女士' : row.gender === 1 ? '先生' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                console.log("page --> ", this.page);
                this.getAppointments();
            },
            //获取用户列表
            getCustomers() {
                let para = {
                    mobile: this.filters.mobile,
                    chineseName:this.filters.chineseName,
                    pageNum: this.page
                };
                this.listLoading = true;
                //NProgress.start();
                searchCustomer(para).then((response) => {
                    let {code, data, length} = response.data;

                    if (code !== "SUCCESS") {
                        console.error("got error when querying customers" + code)
                    }else{
                        this.customers = data;
                        this.total = length
                        console.warn("got customer list --> ", this.appointments);
                        console.warn("total size --> ", this.total);
                    }

                    this.listLoading = false;
                }).catch((error) => {
                    let statusCode = error.response.status;
                    if(statusCode === 403){
                        sessionStorage.removeItem('user');
                        this.$router.push({path: '/login'});
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getCustomers();
        }
    }

</script>

<style scoped>

</style>