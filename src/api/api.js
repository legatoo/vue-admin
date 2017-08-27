import axios from 'axios';

import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const nonce = 'YcS6nEyttcp7fSWCcLAT';

function login(username, password) {
    console.log("going to login ", username, password);
    let secret = Base64.stringify(hmacSHA512(password, nonce));

    console.log("origin password ", password);
    console.log("encrypt to ", secret);

    var postData = {
        loginName : username,
        secret : secret
    };

    return axios.post('http://localhost:9411/api/tob/v1/systemadmin/verify', postData, {withCredentials:true});
}

function signup(username, password) {
    console.log("going to sign up a new user ", username, secret);

    let secret = Base64.stringify(hmacSHA512(password, nonce));

    console.log("origin password ", password);
    console.log("encrypt to ", secret);

    var postData = {
        loginName : username,
        secret : secret
    }
    return axios.post('http://localhost:9411/api/tob/v1/systemadmin/add', postData);
}

function searchAppointments(param) {
    console.log("going to query appointments, param ", param);
    return axios.post(`http://localhost:9411/api/tob/v1/appointment/search`, param);
}

function addNewAppointment(param) {
    console.log("going to add new appointment, param ", param);
    return axios.post(`http://localhost:9411/api/tob/v1/appointment/add`, param);
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

export {
    login,
    signup,
    backdoor,
    searchAppointments,
    markAppointmentDone,
    deleteAppointmentById,
    addCommentOnAppointment,
    addNewAppointment
}