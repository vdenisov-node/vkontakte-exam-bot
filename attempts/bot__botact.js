/*
https://www.npmjs.com/package/botact
https://github.com/bifot/botact
*/

const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

const processENV = require('./keys.json')

// ************************************************************

const bot = new Botact({
  token: processENV.TOKEN,
  confirmation: processENV.CONFIRMATION
})

// User wrote command 'start'
bot.command('/start', (ctx) => {
  ctx.reply('Давай начнём :)')
})
// bot.command('...', ({ reply }) => reply('This is start!'));

// User wrote message which contains ...
bot.hears(/(ЕГЭ|учеба|экзамены)/, (ctx) => {
  ctx.reply('Что ? Мамка заставила ?')
})
 
// User joined in the group
bot.event('group_join', ({ reply }) => {
  reply('Привет, я - твой персональный тренер по ЕГЭ !')
})


bot.on( (ctx) => {
  console.log(`data from vk => ${JSON.stringify(ctx)}`)
  // ctx.reply('what ?')
  ctx.reply()
})

// User wrote any message
bot.on(({ reply }) => {
  reply('What?')
})

// ************************************************************

const server = express()

// Parser request body
server.use(bodyParser.json())

// Bot's endpoint
server.post('/', bot.listen)
 
// Start listen on 3000
server.listen(3000, () => console.log('Server is listening on port 3000...'))
