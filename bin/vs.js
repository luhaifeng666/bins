#! /usr/bin/env node
/*
 * @Author: haifeng.lu haifeng.lu@ly.com
 * @Date: 2022-11-08 16:45:52
 * @LastEditors: haifeng.lu
 * @LastEditTime: 2022-11-25 18:16:06
 * @Description: 
 */

const shell = require('shelljs')
const path = require('path')
const { existsSync } = require('fs')
const { opendir } = require('node:fs/promises')
const { promptCreator } = require('../utils')
const { version } = require('../package.json')
const { Command } = require('commander')

const program = new Command()
program.version(version, '-v, --version')
program
  .option('-b, --base <base>', 'rewrite the BASE_URL')
  .option('-o, --open <name...>', 'open a director')
  .option('-l, --list', 'list the map of all objects')
  .option('-f, --fuzzy [fuzzy...]', 'fuzzy search')
  .option('-g, --greedy', 'greedy matching')
  .option('-p, --pagesize <pagesize>', 'set pagesize')
program.parse(process.argv)

const { open, list, fuzzy, greedy, base, pagesize } = program.opts()

const BASE_URL = base || '/Users/luhaifeng/codes'

if (!existsSync(BASE_URL)) {
  console.error(`No such directory, opendir '${BASE_URL}'`)
  return
}

// 获取所有的项目
async function getFileNames(dir = '') {
  const dirs = await opendir(path.resolve(BASE_URL, dir))
  const names = []
  for await (const dirent of dirs) {
    names.push(dirent.name)
  }
  return names.filter(dirname => !dirname.includes('.'))
}

async function getDirNames(pathnames, cb) {
  (async () => {
    // 如果输入的名称长度 > 1，默认直接打开 BASE_URL + pathnames.join('/') 路径下的文件
    if (pathnames.length > 1) {
      shell.exec(`code ${path.resolve(BASE_URL, pathnames.join('/'))}`)
    } else {
      let parentNames = await getFileNames(pathnames[0])
      if (fuzzy && fuzzy.length) {
        parentNames = parentNames.filter(
          name => fuzzy[greedy ? 'every' : 'some'](
            key => name.toLowerCase().includes(key.toLowerCase())
          )
        )
      }
      parentNames.length ? promptCreator([
        {
          type: 'rawlist',
          name: 'name',
          message: 'Please select the director that you wanna open',
          default: 0,
          choices: parentNames,
          pageSize: pagesize || 10
        }
      ], answer => {
        cb ? cb(answer) : shell.exec(`code ${path.resolve(path.resolve(BASE_URL, pathnames[0]), answer.name)}`)
      }) : console.log('No directors!')
    }
  })()
}


if (open) {
  getDirNames(open)
}

if (list) {
  (async () => {
    const parentNames = await getFileNames()
    const tree = await Promise.all(parentNames.map(async value => {
      const childrenNames = await getFileNames(value)
      return {
        value,
        children: childrenNames.map(cm => ({ value: cm }))
      }
    }))
    promptCreator([
      {
        type: 'tree',
        name: 'position',
        message: 'Please select the director that you wanna open',
        tree
      }
    ], ({ position }) => {
      const keys = Object.keys(tree)
      let parentDir = ''
      for(let i = 0; i < keys.length; i++) {
        if (tree[keys[i]].children.find(item => item.value === position)) {
          parentDir = tree[keys[i]].value
          break
        }
      }
      shell.exec(`code ${path.resolve(BASE_URL, parentDir, position)}`)
    })
  })()
}
