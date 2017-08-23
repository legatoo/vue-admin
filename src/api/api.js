import axios from 'axios';

import {LoginUsers} from './data/user';

function login(username, password) {
    return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
            let hasUser = LoginUsers.some(u => {
                if (u.username === username && u.password === password) {
                    user = JSON.parse(JSON.stringify(u));
                    user.password = undefined;
                    return true;
                }
            });

            if (hasUser) {
                resolve([200, {code: 200, msg: '请求成功', user}]);
            } else {
                resolve([200, {code: 500, msg: '账号或密码错误'}]);
            }
        }, 1000);
    }).then(res => res[1]);
}

function searchAppointments(param) {
    console.log("going to query appointments, param ", param);
    return axios.post(`http://localhost:9411/api/tob/v1/appointment/search`, param);
}

function markAppointmentDone(appointmentId) {
    let url = 'http://localhost:9411/api/tob/v1/appointment/markdone?appointmentId=' + appointmentId + '&toStatus=1';
    console.warn("mark done -->", url);
    return axios.post(url);
}

function deleteAppointmentById(appointmentId) {
    let url = 'http://localhost:9411/api/tob/v1/appointment/delete?appointmentId=' + appointmentId;
    console.warn("delete done -->", url);
    return axios.post(url);
}

function addCommentOnAppointment(appointmentId, comment) {
    let url = 'http://localhost:9411/api/tob/v1/appointment/addcomment?appointmentId=' + appointmentId + "&comment=" + comment;
    console.warn("add comment done -->", url);
    return axios.post(url);
}

function backdoor() {
    return axios.get(`http://localhost:9411/backdoor/info`);
}

export {login, backdoor, searchAppointments, markAppointmentDone, deleteAppointmentById, addCommentOnAppointment}