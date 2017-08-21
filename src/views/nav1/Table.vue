<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.mobile" placeholder="手机"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getAppointments">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="appointments" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="id" label="预约ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="customerName" label="姓名" width="120" sortable>
            </el-table-column>
            <el-table-column prop="gender" label="性别" :formatter="formatGender" width="100" sortable>
            </el-table-column>
            <el-table-column prop="contactMobile" label="电话" width="140" sortable>
            </el-table-column>
            <el-table-column prop="address" label="地址" width="180" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" width="100" sortable>
            </el-table-column>
            <el-table-column prop="appointmentTime" label="预约时间" :formatter="formatDateLong" width="120" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <template v-if="showButton(scope.$index, scope.row)">
                        <el-button type="danger" size="small" @click="markDone(scope.$index, scope.row)">处理</el-button>
                    </template>
                    <template v-else>
                        <el-button type="success" size="small">已完成</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="30" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {searchAppointments, markAppointmentDone} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    mobile: ''
                },
                appointments: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
            }
        },
        methods: {
            formatDateLong: function (row, column) {
                let appointmentDate = new Date(row.appointmentTime);
                return appointmentDate.toLocaleDateString();
            },
            formatStatus: function (row, column) {
                return row.status === 0 ? '未处理' : row.status === 1 ? '已处理' : '未知';
            },
            formatGender: function (row, column) {
                return row.gender === 0 ? '女士' : row.gender === 1 ? '先生' : '未知';
            },
            showButton: function (row, column) {
                return column.status === 0;
            },
            handleCurrentChange(val) {
                this.page = val;
                console.log("page --> ", this.page);
                this.getAppointments();
            },
            //获取用户列表
            getAppointments() {
                let para = {
                    mobile: this.filters.mobile,
                    pageNum : this.page
                };
                this.listLoading = true;
                //NProgress.start();
                searchAppointments(para).then((response) => {
                    let {code, data, length} = response.data;

                    if (code !== "SUCCESS") {
                        console.error("got error when querying appointments" + code)
                    }
                    this.appointments = data;
                    this.total = length;
                    this.listLoading = false;

                    console.warn("got new appointments --> ", this.appointments);
                    console.warn("total size --> ", this.total);
                });
            },
            //标记处理完成
            markDone: function (index, row) {
                this.$confirm('确认这条预订单已完成？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    markAppointmentDone(row.id).then((response) => {
                        let {code, data} = response.data;
                        console.log("mark appointment done got result code" + code);

                        if (code === "SUCCESS") {
                            this.$message({
                                message: '处理成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'failure'
                            });
                        }
                        this.listLoading = false;
                        //NProgress.done();
                        this.getAppointments();
                    });
                }).catch(() => {

                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getAppointments();
        }
    }

</script>

<style scoped>

</style>