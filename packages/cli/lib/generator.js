const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const downloadGitRepo = require('download-git-repo')
const { http, constant } = require("utils");

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()
  try {
    const result = await fn(...args)
    spinner.succeed(message.replace(/\.\.\./, ' successfully!'))
    return result
  } catch(error){
    spinner.fail('Request failed, refetch...', error)
  }
}

// 获取用户选择的模板
async function getRepo(){
  const repoList = await wrapLoading(http.getRepoList, 'Fetching template...')
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
  const tags = await wrapLoading(http.getTagList, 'Fetching version...', repo)
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
  const requestUrl = `${constant.GIT_NAME}/${repo}${tag?'#'+tag:''}`;
  await wrapLoading(util.promisify(downloadGitRepo), 'Downloading template...', requestUrl, path.resolve(process.cwd(), targetDir))
}

// 安装依赖
async function install(cwd) {
  return new Promise(async function(resolve, reject) {
    let message = 'Installing dependencies...'
    const spinner = ora(message)
    spinner.start()
    try{
      const { stdout } = await execa('npm', ['install', '--loglevel', 'error'], { cwd })
      spinner.succeed(message.replace(/\.\.\./, ' successfully!'))
      process.stdout.write(stdout)
      resolve()
    }catch(error){
      spinner.fail('npm install failed, ', error)
      reject()
    }
  })
}

async function generator(targetDir){
  console.log(`✨  Creating project in ${chalk.yellow(targetDir)}.\n`)
  const repo = await getRepo()
  const tag = await getTag(repo);
  await download(repo, tag, targetDir);
  await install(targetDir)
}

module.exports = generator