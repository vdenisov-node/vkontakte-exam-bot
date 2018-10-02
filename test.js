const VkBot = require('node-vk-bot-api/lib')
const Session = require('node-vk-bot-api/lib/session')
const Stage = require('node-vk-bot-api/lib/stage')
const Scene = require('node-vk-bot-api/lib/scene')

const processENV = require('./storage/keys.json')

const bot = new VkBot(processENV.TOKEN)
const session = new Session()
const scene = new Scene('meet',
  (ctx) => {
    ctx.scene.next()
    ctx.reply('How old are you?')
  },
  (ctx) => {
    ctx.session.age = +ctx.message.text

    ctx.scene.next()
    ctx.reply('What is your name?')
  },
  (ctx) => {
    ctx.session.name = ctx.message.text

    ctx.scene.leave()
    ctx.reply(`Nice to meet you, ${ctx.session.name} (${ctx.session.age} years old)`)
  })
const stage = new Stage(scene)

bot.use(session.middleware())
bot.use(stage.middleware())

bot.command('/meet', (ctx) => {
  ctx.scene.enter('meet')
})

console.log('bot is running...')

bot.startPolling()