const
  VkBot = require('node-vk-bot-api/lib'),
  Markup = require('node-vk-bot-api/lib/markup'),
  Session = require('node-vk-bot-api/lib/session'),
  Stage = require('node-vk-bot-api/lib/stage'),
  Scene = require('node-vk-bot-api/lib/scene');

const Koa = require('koa');

const
  helper = require('./functions'),
  processENV = require('./config/keys.json'),
  exam = require('./database/exam.json'),
  { botKeyboards, botPhrases } = require('./storage');

// ************************************************************

// CREATE NEW SERVER
const koaServer = new Koa();

// CREATE NEW BOT
const examTutor = new VkBot({
  token: processENV.TOKEN,
  group_id: processENV.GROUP_ID,
});

// CREATE NEW SESSION
const session = new Session();

// ************************************************************

// HANDLERS FOR SCENES

const scene = new Scene('sceneSetupByUser',
  // user class ?
  (ctx) => {
    ctx.scene.next();
    ctx.reply('В каком ты классе ?', null,
      Markup.keyboard(botKeyboards.findUserClass).oneTime());
  },
  // user scores ?
  (ctx) => {
    ctx.session['class'] = ctx.message.text;
    ctx.scene.next();
    ctx.reply('На сколько баллов хочешь сдать ЕГЭ ?', null,
      Markup.keyboard(botKeyboards.findUserScores).oneTime());
  },
  // user intensity ?
  (ctx) => {
    ctx.session['scores'] = ctx.message.text;
    ctx.scene.next();
    ctx.reply('Как часто ты хочешь заниматься ?', null,
      Markup.keyboard(botKeyboards.findUserIntensity).oneTime());
  },
  // validation
  (ctx) => {
    ctx.session['intensity'] = ctx.message.text;
    ctx.scene.leave();
    ctx.reply(`
Всё правильно ?

* учишься в ${ctx.session.class} классе
* хочешь ${ctx.session.scores} баллов по ЕГЭ
* будешь заниматься ${ctx.session.intensity}
      `, null, Markup.keyboard(botKeyboards.isThisCorrect).oneTime());
  }
);

const stage = new Stage(scene);

examTutor.use(session.middleware());
examTutor.use(stage.middleware());

// ************************************************************

// HANDLERS FOR COMMANDS


// examTutor.command('ХЕР', (ctx) => {
//   ctx.reply('типо выбери класc', null, botKeyboards.findUserClass)
// });


// USER SAYS => COMMANDS
examTutor.command('ПОМОЩЬ', (ctx) => {
  ctx.reply(botPhrases.COMMANDS_LIST, null,
    Markup.keyboard(botKeyboards.showMainCommands).oneTime());
});

//                    ###############

// USER SAYS => START
examTutor.command('ОПРОС', (ctx) => {
  ctx.scene.enter('sceneSetupByUser');
});

examTutor.command('СТАРТ', (ctx) => {
  ctx.scene.enter('sceneSetupByUser');
});

//                    ###############

// USER SAYS => START
examTutor.command('ТЕСТ', (ctx) => {
  const result = helper.randomQuestionsFrom(exam);
  ctx.reply(result.textOfTask, null,
    Markup.keyboard(botKeyboards.chooseYourAnswer).oneTime());
});

//                    ###############

// USER SAYS => YES
examTutor.command('ДА', (ctx) => {
  ctx.reply("Отлично !!!", null,
    Markup.keyboard(botKeyboards.showButtonHelp).oneTime());
});

// USER SAYS => NO
examTutor.command('НЕТ', (ctx) => {
  ctx.reply("Печально :(");
});

// USER SAYS => TEST
examTutor.command('ДАВАЙ', (ctx) => {
  ctx.reply("Поехали...");
});

//                    ###############

// USER SAYS => CANCEL
examTutor.command('ОТМЕНА', (ctx) => {
  ctx.reply("Действие отменено", null,
    Markup.keyboard(botKeyboards.showButtonHelp).oneTime());
});

//                    ###############

// USER SAYS => HELLO
examTutor.command('ПРИВЕТ', (ctx) => {
  let answer = helper.randomElementFrom(botPhrases.HELLO_LIST);
  ctx.reply(answer);
});

// USER SAYS => GOODBYE
examTutor.command('ПОКА', (ctx) => {
  let answer = helper.randomElementFrom(botPhrases.GOODBYE_LIST);
  ctx.reply(answer);
});

//                    ###############

// TEST FOR EVENT JOIN
examTutor.command('ИНФА', (ctx) => {
  ctx.reply(botPhrases.GREETING);

});

// ************************************************************

// HANDLERS FOR EVENTS

examTutor.event('message_edit', (ctx) => {
  ctx.reply('Ты отредактировал сообщение, подозрительно &#128529');
});

examTutor.event('group_join', (ctx) => {
  ctx.reply(botPhrases.GREETING, null,
    Markup.keyboard(botKeyboards.showButtonStart).oneTime());
});

examTutor.event('group_leave', (ctx) => {
  ctx.reply(botPhrases.FAREWELL);
});

// ************************************************************

// HANDLER FOR UNKNOWN COMMANDS

examTutor.on((ctx) => {
  let answer = helper.randomElementFrom(botPhrases.ANSWERS_FOR_WRONG_COMMAND);
  ctx.reply(`${answer}\n${botPhrases.ADVICE}`, null,
    Markup.keyboard(botKeyboards.showButtonHelp).oneTime());
});

// ************************************************************

// SERVER -> start
koaServer.use(async ctx => {
  ctx.body = 'Server is running...';
});
koaServer.listen(3000);

// BOT -> start
examTutor.startPolling();
console.log('examTutor is running ...');
