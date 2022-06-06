const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk')
const createTemplate = require('./generator');

module.exports = async function(name, options) {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, name)
  if(fs.existsSync(targetDir)){
    if(options.force) {
      await fs.remove(targetDir)
    }else{
      const params = [{
        name: 'action',
        type: 'list',
        message: '目标文件目录已经存在，请选择如下操作：',
        choices: [
          { name: '替换当前目录', value: 'replace'},
          { name: '移除已有目录', value: 'remove' }, 
          { name: '取消当前操作', value: 'cancel' }
        ]
      }]
      let data = await inquirer.prompt(params)
      if(!data.action){
        return;
      }else if(data.action === 'remove'){
        await fs.remove(targetDir)
      }
    }
  }

  await createTemplate(targetDir)
  console.log(`\r\nSuccessfully created project ${chalk.cyan(name)}`)
}