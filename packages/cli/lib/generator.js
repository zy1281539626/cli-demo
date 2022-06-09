const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const { logWithSpinner, chalk, execa, hasYarn, hasPnpm3OrLater, getRepoList, getTagList, GIT_NAME } = require("utils");

// 获取用户选择的模板
async function getRepo(){
  const repoList = await logWithSpinner(getRepoList, 'Fetching template...')
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
  const tags = await logWithSpinner(getTagList, 'Fetching version...', repo)
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
  const requestUrl = `${GIT_NAME}/${repo}${tag?'#'+tag:''}`;
  await logWithSpinner(util.promisify(downloadGitRepo), 'Downloading template...', requestUrl, path.resolve(process.cwd(), targetDir))
}

// 安装依赖
function install(cwd, pm) {
  return new Promise(function(resolve, reject) {
    logWithSpinner(()=>{
      execa(pm || 'npm', ['install', '--loglevel', 'error'], { cwd })
      // process.stdout.write(stdout)
    }, 'Installing dependencies...')
  })
  // return new Promise(async function(resolve, reject) {
  //   const stdout = await logWithSpinner(async function(){
  //     const { stdout } = await execa(pm || 'npm', ['install', '--loglevel', 'error'], { cwd })
  //     return stdout
  //   })
  //   if(stdout){

  //   }
  // })
  // return await logWithSpinner(async function(){
  //   try{
  //     const { stdout } = await execa(pm || 'npm', ['install', '--loglevel', 'error'], { cwd })
  //     process.stdout.write(stdout)
  //   }catch(error){
  //     spinner.fail(pm || 'npm' + ' install failed, \n' + error)
  //   }
  // }, 'Installing dependencies... \n')
}

async function generator(cliOptions, targetDir){
  console.log(`✨  Creating project in ${chalk.yellow(targetDir)}.\n`)
  const repo = await getRepo()
  const tag = await getTag(repo);
  await download(repo, tag, targetDir);

  const packageManager = (
    cliOptions.packageManager ||
    (hasYarn() ? 'yarn' : null) ||
    (hasPnpm3OrLater() ? 'pnpm' : 'npm')
  )
  await install(targetDir, packageManager)
}

module.exports = generator