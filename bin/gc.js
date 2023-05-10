#! /usr/bin/env node

/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2022-05-05 13:42:32
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2022-11-07 10:41:02
 * @Description: 
 */

const { promptCreator } = require('../utils')
const { version } = require('../package.json')
const { Command } = require('commander')
const shell = require('shelljs')

const program = new Command()
program.version(version, '-v, --version')
program
	.option('-c, --change', 'change git account information')
	.option('-w, --who', 'who am I')
program.parse(process.argv)

const { change, who } = program.opts()
const ACCOUNTS = {
	mine: {
		name: 'luhaifeng666',
		email: 'youzui@hotmail.com'
	},
	tc: {
		name: 'haifeng.lu',
		email: 'haifeng.lu@ly.com',
    password: 'lhf08113010xf!'
	}
}

const getUserInfo = () => {
  ['name', 'email'].forEach(type => {
    shell.exec(`git config user.${type}`)
  })
}

if (change) {
	promptCreator([
		{
			type: 'list',
			name: 'account',
			message: 'Witch account do you wanna change?',
			default: 0,
			choices: Object.keys(ACCOUNTS)
		}
	], answer => {
		const config = ACCOUNTS[answer.account]
		Object.keys(config).forEach(key => {
			shell.exec(`git config --global user.${key} ${config[key]}`)
		})
    getUserInfo()
	})
}

who && getUserInfo()
