const axios = require('axios');

axios.interceptors.response.use(res=>{
  return res.data
})

// 获取模板列表
function getRepoList(){
  // return axios.get('https://api.github.com/orgs/vuejs/repos')
  return axios.get('https://api.github.com/users/zy1281539626/repos')
}

// 获取版本列表
function getTagList(repo){
  // return axios.get(`https://api.github.com/repos/vuejs/${repo}/tags`)
  // return axios.get(`https://api.github.com/repos/zy1281539626/${repo}/tags`)
  return new Promise(resolve=>{resolve([])})
}

module.exports = {
  getRepoList,
  getTagList
}