const TelegramBot = require('node-telegram-bot-api')
const Parser = require('goose-parser')
const PhantomEnvironment = require('goose-phantom-environment')
const config = require('./config')
const helper = require('./helper')

helper.logStart()

const bot = new TelegramBot(config.TOKEN, {
	polling: true
})



bot.on('message', msg => {
	console.log('Working', msg.from.first_name)
	const chatId = helper.getChatId(msg)
	if (msg.text !== '/start' && msg.text !== '/test') {
	getRequest(chatId, msg.text)
	}
})



bot.onText(/\/start/, msg => {
	const chatId = helper.getChatId(msg)
	const text = "Привет, "+ msg.from.first_name+"!\nВведи слово, которое хочешь проверить:"

	bot.sendMessage(chatId, text)
})



bot.onText(/\/test/, function (msg, match) {
  newQuestion(msg);
});

bot.on('callback_query', function (msg) {
  var answer = msg.data.split('_');
  var index = answer[0];
  var button = answer[1];

  if (questions[index].right_answer==button) {
    bot.sendMessage(msg.from.id, 'Правильно!' + questions[index].full_answer);
  } else {
    bot.sendMessage(msg.from.id, 'Неправильно!' + questions[index].full_answer);
  }

  newQuestion(msg);
});


//__________________________________________________________________________//

function getRequest(chatId, text) {
//const chatId = helper.getChatId(msg)
var p = text;
var t = encodeURIComponent('в-слове-') + encodeURIComponent(p);

const env = new PhantomEnvironment({
  url: `https://xn----8sbhebeda0a3c5a7a.xn--p1ai/${t}`
});

const parser = new Parser({ environment: env });

(async function () {
  try {
    const results = await parser.parse({
      actions: 
      	[
	        {
	         type: 'click',
	         scope: 'div.row>div.col-sm-8>div.rule'
	        }
        ],
        
      rules: 
	    {
	    	name: 'word',
	      	scope: 'div.row>div.col-sm-8>div.rule'
	      
	    }
    });
//    console.log(results)
//    console.log(typeof(results))
    
    bot.sendMessage(chatId, results)
  } catch (e) {
    console.log('Error occured:');
    console.log(e.stack);
  }
})();
}

function getRandomQuestion(){
  return questions[Math.floor(Math.random()*questions.length)];
}

function newQuestion(msg){
  var arr = getRandomQuestion();
  var text = arr.title;
  var options = {
    reply_markup: JSON.stringify({
      inline_keyboard: arr.buttons,
      parse_mode: 'Markdown'
    })
  };
  chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
  bot.sendMessage(chat, text, options);
}



//_____________________________________________________________________________________//

 var questions = [
      {
        title:'Как правильно ставить ударение в слове ПРИБЫВ?',
        buttons: [
            [{ text: 'прИбыв', callback_data: '0_1' }],
            [{ text: 'прибЫв', callback_data: '0_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение ставят на слог с буквой Ы — прибЫв.'
      },
      {
        title:'Как правильно ставить ударение в слове ПЛОДОНОСИТЬ?',
        buttons: [
            [{ text: 'плодонОсить', callback_data: '1_1' }],
            [{ text: 'плодоносИть', callback_data: '1_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение ставят на слог с буквой И — плодоносИть.'
      },
      {
        title:'Как правильно ставить ударение в слове БАЛУЯСЬ?',
        buttons: [
            [{ text: 'балУясь', callback_data: '2_1' }],
            [{ text: 'бАлуясь', callback_data: '2_2' }]
          ],
        right_answer: 1,
        full_answer: ' В данном слове ударение должно быть поставлено на слог с буквой У — балУясь.'
      },
      {
        title:'Как правильно ставить ударение в слове ОПОШЛИТЬ',
        buttons: [
            [{ text: 'опОшлить', callback_data: '3_1' }],
            [{ text: 'опошлИть', callback_data: '3_2' }]
          ],
        right_answer: 1,
        full_answer: ' В указанном выше слове ударение падает на слог с последней буквой О — опОшлить.'
      },
      {
        title:'Как правильно ставить ударение в слове ВРУЧАТ?',
        buttons: [
            [{ text: 'врУчат', callback_data: '4_1' }],
            [{ text: 'вручАт', callback_data: '4_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение следует ставить на слог с буквой А — вручАт.'
      },
      {
        title:'Как правильно ставить ударение в слове СОСРЕДОТОЧЕНИЕ?',
        buttons: [
            [{ text: 'сосредотОчение', callback_data: '5_1' }],
            [{ text: 'сосредоточЕние', callback_data: '5_2' }]
          ],
        right_answer: 1,
        full_answer: ' В таком слове ударение ставят на слог с последней буквой О — сосредотОчение.'
      },
      {
        title:'Как правильно ставить ударение в слове СРЕДСТВА?',
        buttons: [
            [{ text: 'срЕдства', callback_data: '6_1' }],
            [{ text: 'средствА', callback_data: '6_2' }]
          ],
        right_answer: 1,
        full_answer: ' В указанном выше слове ударение ставят на слог с буквой Е — срЕдства.'
      },
      {
        title:'Как правильно ставить ударение в слове МОЗАИЧНЫЙ?',
        buttons: [
            [{ text: 'мозАичный', callback_data: '7_1' }],
            [{ text: 'мозаИчный', callback_data: '7_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение падает на слог с буквой И — мозаИчный.'
      },
      {
        title:'Как правильно ставить ударение в слове ПОСЛАЛА?',
        buttons: [
            [{ text: 'послАла', callback_data: '8_1' }],
            [{ text: 'послалА', callback_data: '8_2' }]
          ],
        right_answer: 1,
        full_answer: ' В указанном выше слове ударение падает на слог с первой буквой А — послАла.'
      },
      {
        title:'Как правильно ставить ударение в слове ЗАГНУТЫЙ?',
        buttons: [
            [{ text: 'зАгнутый', callback_data: '9_1' }],
            [{ text: 'загнУтый', callback_data: '9_2' }]
          ],
        right_answer: 1,
        full_answer: ' В таком слове ударение ставят на слог с буквой А — зАгнутый.'
      },
      {
        title:'Как правильно ставить ударение в слове НЕФТЕПРОВОД?',
        buttons: [
            [{ text: 'нефтепрОвод', callback_data: '10_1' }],
            [{ text: 'нефтепровОд', callback_data: '10_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение ставят на слог с последней буквой О — нефтепровОд.'
      },
      {
        title:'Как правильно ставить ударение в слове ДОНИЗУ?',
        buttons: [
            [{ text: 'дОнизу', callback_data: '11_1' }],
            [{ text: 'донИзу', callback_data: '11_2' }]
          ],
        right_answer: 1,
        full_answer: ' В данном слове ударение должно быть поставлено на слог с буквой О — дОнизу.'
      }
    ];
