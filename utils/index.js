const inquirer = require('inquirer')
const TreePrompt = require('inquirer-tree-prompt')

inquirer.registerPrompt('tree', TreePrompt)

/**
 * promptCreator
 * @param {Object[]} configs
 * @param {Function} cb
 */
module.exports.promptCreator = function (configs, cb) {
	inquirer.prompt(configs).then(answer => {
		cb(answer)
	}).catch(err => {
		console.error(err.message)
	})
}
