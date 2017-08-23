<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.mobile">
                        <template slot="prepend">手机</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="filters.fromDay" placeholder="从">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="filters.toDay" placeholder="到">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getAppointments">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="handleAdd">新增预约单</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="15" class="toolbar" style="width: 100%;">共 {{total}} 条数据</el-col>
        <!--列表-->
        <el-table :data="appointments" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="id" label="预约ID" width="100" sortable></el-table-column>
            <el-table-column prop="customerName" label="姓名" width="100" sortable></el-table-column>
            <el-table-column prop="gender" label="性别" :formatter="formatGender" width="90" sortable></el-table-column>
            <el-table-column prop="contactMobile" label="电话" width="140" sortable></el-table-column>
            <el-table-column prop="provinceName" label="省" width="80"></el-table-column>
            <el-table-column prop="cityName" label="市" width="100"></el-table-column>
            <el-table-column prop="address" label="详细地址" min-width="220"></el-table-column>
            <el-table-column prop="appointmentDay" label="预约日" :formatter="formatDateLong" width="120"
                             sortable></el-table-column>
            <el-table-column prop="hourRange" label="预约时间" width="150" sortable></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" width="100" sortable></el-table-column>
            <el-table-column prop="comment" label="备注" width="160" sortable></el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <template v-if="showButton(scope.$index, scope.row)">
                        <el-button type="warning" size="small" @click="markDone(scope.$index, scope.row)">处理</el-button>
                        <el-button type="primary" size="small" @click="handleAddComment(scope.$index, scope.row)">备注
                        </el-button>
                    </template>
                    <template v-else>
                        <el-button type="success" size="small">已完成</el-button>
                    </template>
                    <el-button type="danger" size="small" @click="deleteAppoint(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="30"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增预约单" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="customerName">
                    <el-input v-model="addForm.chineseName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.gender">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="addForm.mobile" placeholder="手机或座机"></el-input>
                </el-form-item>
                <el-form-item label="省">
                    <el-select v-model="addForm.provinceId" clearable placeholder="省" @change="clearCityChoose">
                        <el-option
                                v-for="item in provinces"
                                :key="item.provinceId"
                                :label="item.provinceName"
                                :value="item.provinceId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="市">
                    <el-select v-model="addForm.cityId" clearable placeholder="市">
                        <el-option
                                v-for="item in cityMapData[addForm.provinceId]"
                                :key="item.cityId"
                                :label="item.cityName"
                                :value="item.cityId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.address"></el-input>
                </el-form-item>
                <el-form-item label="预约日">
                    <el-date-picker v-model="addForm.appointmentDay" type="date" format="yyyy-MM-dd"
                                    placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="预约时间">
                    <el-time-select
                            placeholder="起始时间"
                            v-model="addForm.hourBegin"
                            :picker-options="{start: '08:00',step: '00:15',end: '20:00'}">
                    </el-time-select>
                    <el-time-select
                            placeholder="结束时间"
                            v-model="addForm.hourEnd"
                            :picker-options="{start: '08:30',step: '00:15',end: '21:00',minTime: addForm.hourBegin}">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAppointmentSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--增加备注页面-->
        <el-dialog title="修改备注" v-model="addCommentVisible" :close-on-click-modal="false">
            <el-form :model="addComment" label-width="80px" ref="addComment">
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addComment.comment"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addCommentSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
        searchAppointments,
        markAppointmentDone,
        deleteAppointmentById,
        addCommentOnAppointment,
        addNewAppointment
    } from '../../api/api';
    import {provinceList, cityMap} from '../../api/data/city';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";


    export default {
        components: {ElFormItem},
        data() {
            return {
                filters: {
                    mobile: '',
                    fromDay: '',
                    toDay: ''
                },
                appointments: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                provinces: provinceList,
                cityMapData: cityMap,

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                //新增界面数据
                addForm: {
                    chineseName: '',
                    gender: 0,
                    mobile: '',
                    provinceId: 620000,
                    cityId: '',
                    address: '',
                    appointmentDay: '',
                    hourBegin: '',
                    hourEnd: '',
                    comment: ''
                },
                addFormRules: {
                    chineseName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },

                //备注
                addCommentVisible: false,
                addComment: {
                    appointmentId: 0,
                    comment: ''
                }
            }
        },
        methods: {
            formatDateLong: function (row, column) {
                let appointmentDate = new Date(row.appointmentDay);
                return appointmentDate.toISOString().split('T')[0]
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
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    chineseName: '',
                    gender: 0,
                    mobile: '',
                    provinceId: 620000,
                    cityId: '',
                    address: '',
                    appointmentDay: '',
                    hourBegin: '',
                    hourEnd: '',
                    comment: ''
                };
            },
            clearCityChoose: function () {
                this.addForm.cityId = ''
            },
            //显示新增界面
            handleAddComment: function (index, row) {
                this.addCommentVisible = true;
                this.addComment = {
                    appointmentId: row.id,
                    comment: row.comment
                }
            },
            //获取用户列表
            getAppointments() {
                let para = {
                    mobile: this.filters.mobile,
                    fromDay: new Date(this.filters.fromDay).getTime(),
                    toDay: new Date(this.filters.toDay).getTime(),
                    pageNum: this.page
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
                                message: '处理失败',
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
            deleteAppoint: function (index, row) {
                this.$confirm('确认删除这条预约单?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;

                    deleteAppointmentById(row.id).then((response) => {
                        let {code, data} = response.data;
                        console.log("delete appointment got result code" + code);

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
                    })
                })
            },
            //新增
            addAppointmentSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let appointmentDate = new Date(this.addForm.appointmentDay);
                            this.addForm.appointmentDay = appointmentDate.getTime();
                            let para = Object.assign({}, this.addForm);

                            console.log("going to submit new appointment", para);
                            addNewAppointment(para).then((response) => {
                                let {code, data} = response.data;

                                if (code === "SUCCESS") {
                                    console.log("add new appointment" + data);
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
                                this.addLoading = false;
                                this.addFormVisible = false;
                                //NProgress.done();
                                this.getAppointments();
                            });
                        });
                    }
                });
            },
            //备注
            addCommentSubmit: function () {
                this.$refs.addComment.validate(() => {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        addCommentOnAppointment(this.addComment.appointmentId, this.addComment.comment)
                            .then((response) => {
                                let {code, data} = response.data;
                                console.log("delete appointment got result code" + code);

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
                                this.addLoading = false;
                                this.addCommentVisible = false;
                                //NProgress.done();
                                this.getAppointments();
                            })
                    });
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