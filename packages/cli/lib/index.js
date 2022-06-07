'use strict';

const program = require('commander')

function registerCommand(){
  // 创建项目
  program
    .command('create [name]')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
      require('./create.js')(name, options)
    })
  
  // 获取版本号
  program
    .version(`v${require('../package.json').version}`)
    .usage('<command> [option]')

  program.parse(process.argv);
}

function index() {
  registerCommand()
}

module.exports = index;