const
  VkBot = require('node-vk-bot-api/lib'),
  Markup = require('node-vk-bot-api/lib/markup'),
  Session = require('node-vk-bot-api/lib/session'),
  Stage = require('node-vk-bot-api/lib/stage'),
  Scene = require('node-vk-bot-api/lib/scene');

const Koa = require('koa');

const
  helper = require('./functions'),
  processENV = require('./storage/keys.json'),
  botPhrases = require('./storage/phrases');

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

const scene = new Scene('meet',
  (ctx) => {
    ctx.scene.next();
    ctx.reply('В каком ты классе ?', null, Markup
      .keyboard([
        [
          Markup.button('8', 'primary'),
          Markup.button('9', 'primary'),
          Markup.button('10', 'primary'),
          Markup.button('11', 'primary')
        ]
      ])
      .oneTime()
    );
  },
  (ctx) => {
    ctx.session['class'] = ctx.message.text;

    ctx.scene.next();
    ctx.reply('На сколько баллов хочешь сдать ЕГЭ ?', null, Markup
      .keyboard([
        [
          Markup.button('> 60', 'primary'),
          Markup.button('> 70', 'primary'),
          Markup.button('> 80', 'primary'),
          Markup.button('> 90', 'primary')
        ]
      ])
      .oneTime()
    );
  },
  (ctx) => {
    ctx.session['scores'] = ctx.message.text;

    ctx.scene.next();
    ctx.reply('Какая у тебя мотивация ?', null, Markup
      .keyboard([
        [ Markup.button('Я отличник', 'primary') ],
        [ Markup.button('Хочу сдать и забыть', 'primary') ],
        [ Markup.button('Просто потренироваться', 'primary') ],
        [ Markup.button('Мамка заставила', 'primary') ]
      ])
      .oneTime()
    );
  },
  (ctx) => {
    ctx.session['motivation'] = ctx.message.text;

    ctx.scene.leave();
    ctx.reply(`
      Всё правильно ?
      * учишься в ${ctx.session.class} классе
      * хочешь по ЕГЭ баллов -> ${ctx.session.scores}
      * мотивация -> ${ctx.session.motivation}
      `, null, Markup
        .keyboard([
          [
            Markup.button('ДА', 'positive'),
            Markup.button('НЕТ', 'negative')
          ]
        ])
        .oneTime()
    );
  }
);

const stage = new Stage(scene);

examTutor.use(session.middleware());
examTutor.use(stage.middleware());

// ************************************************************

// HANDLERS FOR COMMANDS

examTutor.command('СТАРТ', (ctx) => {
  ctx.reply(botPhrases.START_TESTING);
});

examTutor.command('КЛАВА', (ctx) => {
  ctx.reply('Какое у тебя настроение ?', null, Markup
    .keyboard([
      [
        Markup.button('Normally', 'primary')
      ],
      [
        Markup.button('Fine', 'positive'),
        Markup.button('Bad', 'negative'),
      ],
      [
        Markup.button(
          { 
            "action": { 
              "type": "text", 
              "payload": "{\"button\": \"qwerty\"}", 
              "label": "White" 
            }, 
            "color": "default" 
          }
        )
      ],
    ])
    .oneTime()
  );
});

examTutor.command('ПРИВЕТ', (ctx) => {
  ctx.reply('HELLO !!!');
});

examTutor.command('КОМАНДЫ', (ctx) => {
  ctx.reply(botPhrases.COMMANDS_LIST, null, Markup
    .keyboard([
      [
        Markup.button('СТАРТ', 'positive'),
        Markup.button('ОПРОС', 'primary')
      ],
      [
        Markup.button('КОМАНДЫ', 'default')
      ],
      [
        Markup.button('ОТМЕНА', 'negative')
      ]
    ])
    .oneTime()
  );
});

examTutor.command('ОПРОС', (ctx) => {
  ctx.scene.enter('meet');
});

examTutor.command('ДА', (ctx) => {
  ctx.reply("Отлично !!!");
});

examTutor.command('НЕТ', (ctx) => {
  ctx.reply("Печально :(");
});

examTutor.command('ОТМЕНА', (ctx) => {
  ctx.reply("Действие отменено");
});

// ************************************************************

// HANDLERS FOR EVENTS

examTutor.event('message_edit', (ctx) => {
  ctx.reply('Ты отредактировал сообщение, подозрительно &#128529');
});

examTutor.event('group_join', (ctx) => {
  const btn = [
    [
      Markup.button( { 
        "action": { 
          "type": "text", 
          "payload":  "{\"button\": \"qwerty\"}", 
          "label": "СТАРТ" 
        }, 
        "color": "positive" 
      })
    ]
  ]
  ctx.reply(botPhrases.GREETING, null, Markup
    // .keyboard([
    //   [
    //     Markup.button('/старт', 'primary')
    //   ]
    // ])
    .keyboard(btn)
    .oneTime()
  );
});

examTutor.event('group_leave', (ctx) => {
  ctx.reply(botPhrases.GOODBYE);
});

// ************************************************************



// ************************************************************

// HANDLER FOR UNKNOWN COMMANDS

examTutor.on((ctx) => {
  let answer = helper.randomElementFrom(
    botPhrases.ANSWERS_FOR_WRONG_COMMAND
  );
  console.log('=> extreme answer <=\n', answer);
  ctx.reply(`${answer}\n${botPhrases.ADVICE}`, null, Markup
    .keyboard([
      [
        Markup.button('КОМАНДЫ', 'default')
      ]
    ])
    .oneTime()
  );
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
