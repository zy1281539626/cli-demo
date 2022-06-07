const axios = require('axios');
const { GIT_BASE, GIT_TYPE, GIT_NAME } = require('./constant');

axios.interceptors.response.use(res=>{
  return res.data
})

// 获取模板列表
function getRepoList(){
  return axios.get(`${GIT_BASE}/${GIT_TYPE}/${GIT_NAME}/repos`)
}

// 获取版本列表
function getTagList(repo){
  return axios.get(`${GIT_BASE}/repos/${GIT_NAME}/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}