/*
https://www.npmjs.com/package/node-vk-bot-api
https://github.com/node-vk-bot-api
*/

const VkBot = require('node-vk-bot-api')

const Markup = require('node-vk-bot-api/lib/markup')

const processENV = require('./keys.json')

// ************************************************************

const bot = new VkBot({
  token: processENV.TOKEN,
  group_id: processENV.GROUP_ID,
})

bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})

bot.command(/(K|k)eyboard/, (ctx) => {
  ctx.reply('Select your sport', null, Markup
  .keyboard([
    'Football',
    'Basketball',
  ])
  .oneTime()
)
})

bot.on((ctx) => {
  ctx.reply('No commands for you.')
})

bot.startPolling()

console.log('bot is rinning ...')
console.log('token =>', processENV.TOKEN)
