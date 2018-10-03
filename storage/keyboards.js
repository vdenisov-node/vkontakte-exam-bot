const Markup = require('node-vk-bot-api/lib/markup');

module.exports = {

  findUserClass: [
    [
      Markup.button('8', 'primary'),
      Markup.button('9', 'primary'),
      Markup.button('10', 'primary'),
      Markup.button('11', 'primary')
    ]
  ],

  findUserScores: [
    [
      Markup.button('> 60', 'primary'),
      Markup.button('> 70', 'primary'),
      Markup.button('> 80', 'primary'),
      Markup.button('> 90', 'primary')
    ]
  ],

  findUserIntensity: [
    [
      Markup.button('каждый день', 'primary'),
      Markup.button('3 раза в неделю', 'primary')
    ],
    [
      Markup.button('1 раз в неделю', 'primary'),
      Markup.button('как прикажет бот', 'primary')
    ]
  ],

  isThisCorrect: [
    [
      Markup.button('да', 'positive'),
      Markup.button('нет', 'negative')
    ]
  ],

  showMainCommands: [
    [
      Markup.button('тест', 'positive'),
      Markup.button('опрос', 'primary')
    ],
    [ Markup.button('помощь', 'default') ],
    [ Markup.button('отмена', 'negative') ]
  ],

  chooseYourAnswer: [
    [
      Markup.button('1', 'default'),
      Markup.button('2', 'default'),
      Markup.button('3', 'default'),
      Markup.button('4', 'default'),
    ]
  ],

  showButtonHelp: [
    [
      Markup.button('помощь', 'default')
    ]
  ],

  showButtonStart: [
    [
      Markup.button('старт', 'positive')
    ]
  ]

}

// EXANPLE

// [
//   [
//     Markup.button( { 
//       "action": { 
//         "type": "text", 
//         "payload":  "{\"button\": \"qwerty\"}", 
//         "label": "старт" 
//       }, 
//       "color": "positive" 
//     })
//   ]
// ]
