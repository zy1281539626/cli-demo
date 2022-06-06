const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const utils = require("utils");
const { getRepoList, getTagList } = utils.http

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()
  try {
    const result = await fn(...args)
    spinner.succeed('Request succeed!!!')
    return result
  } catch(e){
    spinner.fail('Request failed, refetch...', e.message)
  }
}

// 获取用户选择的模板
async function getRepo(){
  const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
  if (!repoList) return;
  const repos = repoList.map(item => item.name);
  const { repo } = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    choices: repos,
    message: 'Please choose a template to create project'
  })
  return repo
}

// 获取tags
async function getTag(repo){
  const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo)
  if (!tags || tags.length === 0) return '';
  const tagsList = tags.map(item => item.name);
  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    choices: tagsList,
    message: 'Place choose a tag to create project'
  })
  return tag
}

// 下载
async function download(repo, tag, targetDir){
  // const requestUrl = `vuejs/${repo}${tag?'#'+tag:''}`;
  const requestUrl = `zy1281539626/${repo}${tag?'#'+tag:''}`;
  await wrapLoading(util.promisify(downloadGitRepo), 'waiting download template', requestUrl, path.resolve(process.cwd(), targetDir))
}

async function create(targetDir){
  // 获取模板名称
  const repo = await getRepo()
  // 获取 tag 名称
  const tag = await getTag(repo);
  // 下载模板到模板目录
  await download(repo, tag, targetDir);
}

module.exports = create