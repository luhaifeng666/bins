#! /usr/bin/env node

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-04-28 11:26:50
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-05-04 10:33:04
 * @Description: 
 */
const shell = require('shelljs')
const { promptCreator } = require('../utils')
const { version } = require('../package.json')
const { Command } = require('commander')

const program = new Command()
program.version(version, '-v, --version')
program
  .option('-t, --type <type>', 'pnpm/npm/yarn')

program.parse(process.argv)

const { type = 'yarn' } = program.opts()
const SEHLL_PRES = {
  yarn: 'yarn',
  npm: 'npm run',
  pnpm: 'pnpm'
}
const {
  scripts = {}
} = require(`${process.env.PWD}/package.json`)

const scriptNames = Object.keys(scripts).filter(script => program.args.every(key => script.includes(key)))

scriptNames.length ? promptCreator([
  {
    type: 'rawlist',
    name: 'name',
    message: 'Please select the script that you wanna run',
    default: 0,
    choices: scriptNames
  }
], answer => {
  const command = `${SEHLL_PRES[type]} ${answer.name}`
  console.log(`run command: ${command}`)
  shell.exec(`${command}`)
}) : console.error('No scripts!')