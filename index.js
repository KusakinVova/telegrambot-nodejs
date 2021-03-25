const { Telegraf, Markup, Extra } = require('telegraf')
const random = require('random')
const config = require('config')

const token = config.get('token')
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)
//===================
// выводит в консоль 
bot.use(async (ctx, next) => {
    const start = new Date()
    await next() // ожидаем чтобы клиент получил ответ

    //время ответа клиенту
    const ms = new Date() - start
    console.log('Response time: %sms', ms)

    // сообщение от клиента
    // console.log(ctx.message)
})

//===================
const gameKubes = Telegraf.Extra
  .markdown()
  .markup((m) => m.keyboard([
      ['🎲 Бросать кубик', '🎲 Бросать 2 кубика'],
      ['Главная']
  ]).resize())

bot.hears('Бросать кубики 🎲', (ctx) => ctx.reply('Давай по бросаем кубики 😊!', gameKubes))

bot.hears('🎲 Бросать кубик', (ctx) => ctx.reply('🎲 ' + random.int(1, 6)))
bot.hears('🎲 Бросать 2 кубика', (ctx) => ctx.reply('🎲 ' + random.int(1, 6) + ' и 🎲 ' + random.int(1, 6)))
//===================
// Ответ на сообщение "/start"
const mainMenu = Telegraf.Extra
  .markdown()
  .markup((m) => m.keyboard([
    m.callbackButton('Бросать кубики 🎲')
  ]).resize())

bot.start( ctx => ctx.reply(`Привет ${ctx.from.first_name}! Я Бот 😊`, mainMenu))
bot.hears('Главная', (ctx) => ctx.reply('Вы перешли в главное меню', mainMenu))

// Ответ на сообщение "/help"
bot.help((ctx) => ctx.reply('Send me a sticker'))

// Ответ на полученный стикер
bot.on('sticker', (ctx) => ctx.reply('👍'))


// Ответ на сообщение 'hi'
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears('1', (ctx) => ctx.reply('12345'))
bot.hears('2', (ctx) => ctx.reply('67890'))
bot.hears('3', (ctx) => ctx.reply('100500'))

// ответ на команды "/oldschool" или "/modern" или "/hipster"
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('modern', ({ reply }) => reply('Yo'))
bot.command('hipster', Telegraf.reply('λ'))

// ответ на любое сообщение
bot.on('text', (ctx) => ctx.reply('Сложно что-то ответить', mainMenu))

bot.launch()