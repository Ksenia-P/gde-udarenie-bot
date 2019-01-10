const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const cheerio = require('cheerio')
const config = require('./config')
const helper = require('./helper')

require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
})

helper.logStart()

const bot = new TelegramBot(config.TOKEN, {
	polling: true
})



bot.on('message', msg => {
	console.log('Working', msg.from.first_name)
	const chatId = helper.getChatId(msg)
	if (msg.text !== '/start' && msg.text !== '/test') {
	getRequest(chatId, msg.text)
  console.log(msg.text)
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
var p = text.toLowerCase();
var t = encodeURIComponent('в-слове-') + encodeURIComponent(p);


var url = `https://xn----8sbhebeda0a3c5a7a.xn--p1ai/${t}`;

request(url, function (error, response, body) {
  if (!error && response.statusCode === 200) {

    var $ = cheerio.load(body),
    t = $('.rule');
    var results = t.text();
    
    if (results != '') {
    bot.sendMessage(chatId, results);
    }
    else bot.sendMessage(chatId, 'Извините, такого слова я не знаю.');


  } else {
    bot.sendMessage(chatId, 'Извините, такого слова я не знаю.');
  }
});

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
      },
      {
        title:'Как правильно ставить ударение в слове ПЛОМБИРОВАТЬ?',
        buttons: [
            [{ text: 'пломбИровать', callback_data: '12_1' }],
            [{ text: 'пломбировАть', callback_data: '12_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение должно быть поставлено на слог с буквой А — пломбировАть.'
      },
      {
        title:'Как правильно ставить ударение в слове ДИСПАНСЕР?',
        buttons: [
            [{ text: 'диспАнсер', callback_data: '13_1' }],
            [{ text: 'диспансЕр', callback_data: '13_2' }]
          ],
        right_answer: 2,
        full_answer: ' В указанном выше слове ударение следует ставить на слог с буквой Е — диспансЕр.'
      },
      {
        title:'Как правильно ставить ударение в слове КВАРТАЛ?',
        buttons: [
            [{ text: 'квАртал', callback_data: '14_1' }],
            [{ text: 'квартАл', callback_data: '14_2' }]
          ],
        right_answer: 2,
        full_answer: ' В таком слове ударение должно быть поставлено на слог с последней буквой А — квартАл.'
      },
      {
        title:'Как правильно ставить ударение в слове ОПТОВЫЙ?',
        buttons: [
            [{ text: 'Оптовый', callback_data: '15_1' }],
            [{ text: 'оптОвый', callback_data: '15_2' }]
          ],
        right_answer: 2,
        full_answer: ' В указанном выше слове ударение следует ставить на слог с последней буквой О — оптОвый.'
      },
      {
        title:'Как правильно ставить ударение в слове КУХОННЫЙ?',
        buttons: [
            [{ text: 'кУхонный', callback_data: '16_1' }],
            [{ text: 'кухОнный', callback_data: '16_2' }]
          ],
        right_answer: 1,
        full_answer: ' В упомянутом выше слове ударение должно быть поставлено на слог с буквой У — кУхонный.'
      },
      {
        title:'Как правильно ставить ударение в слове ПРОСВЕРЛИТ?',
        buttons: [
            [{ text: 'просвЕрлит', callback_data: '17_1' }],
            [{ text: 'просверлИт', callback_data: '17_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение следует ставить на слог с буквой И — просверлИт.'
      },
      {
        title:'Как правильно ставить ударение в слове ШАРФЫ?',
        buttons: [
            [{ text: 'шАрфы', callback_data: '18_1' }],
            [{ text: 'шарфЫ', callback_data: '18_2' }]
          ],
        right_answer: 1,
        full_answer: ' В указанном выше слове ударение следует ставить на слог с буквой А — шАрфы.'
      },
      {
        title:'Как правильно ставить ударение в слове ОТРОЧЕСТВО?',
        buttons: [
            [{ text: 'Отрочество', callback_data: '19_1' }],
            [{ text: 'отрОчество', callback_data: '19_2' }]
          ],
        right_answer: 1,
        full_answer: ' В таком слове ударение должно быть поставлено на слог с первой буквой О — Отрочество.'
      },
      {
        title:'Как правильно ставить ударение в слове НАЧАВШИСЬ?',
        buttons: [
            [{ text: 'нАчавшись', callback_data: '20_1' }],
            [{ text: 'начАвшись', callback_data: '20_2' }]
          ],
        right_answer: 2,
        full_answer: ' В указанном выше слове ударение ставят на слог с последней буквой А — начАвшись.'
      },
      {
        title:'Как правильно ставить ударение в слове ЗАВИДНО?',
        buttons: [
            [{ text: 'зАвидно', callback_data: '21_1' }],
            [{ text: 'завИдно', callback_data: '21_2' }]
          ],
        right_answer: 2,
        full_answer: ' В указанном выше слове ударение ставят на слог с буквой И — завИдно.'
      },
      {
        title:'Как правильно ставить ударение в слове ДОНЕЛЬЗЯ?',
        buttons: [
            [{ text: 'дОнельзя', callback_data: '22_1' }],
            [{ text: 'донЕльзя', callback_data: '22_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение следует ставить на слог с буквой Е — донЕльзя.'
      },
      {
        title:'Как правильно ставить ударение в слове УГЛУБИТЬ?',
        buttons: [
            [{ text: 'углУбить', callback_data: '23_1' }],
            [{ text: 'углубИть', callback_data: '23_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение ставят на слог с буквой И — углубИть.'
      },
      {
        title:'Как правильно ставить ударение в слове ПРОЗОРЛИВА?',
        buttons: [
            [{ text: 'прозОрлива', callback_data: '24_1' }],
            [{ text: 'прозорлИва', callback_data: '24_2' }]
          ],
        right_answer: 2,
        full_answer: ' В упомянутом выше слове ударение должно быть поставлено на слог с буквой И — прозорлИва.'
      },
      {
        title:'Как правильно ставить ударение в слове ОБЛЕГЧИТЬ?',
        buttons: [
            [{ text: 'облЕгчить', callback_data: '25_1' }],
            [{ text: 'облегчИть', callback_data: '25_2' }]
          ],
        right_answer: 2,
        full_answer: ' В данном слове ударение ставят на слог с буквой И — облегчИть.'
      },
      {
        title:'Как правильно ставить ударение в слове СЛИВОВЫЙ?',
        buttons: [
            [{ text: 'слИвовый', callback_data: '26_1' }],
            [{ text: 'сливОвый', callback_data: '26_2' }]
          ],
        right_answer: 1,
        full_answer: ' В таком слове ударение должно быть поставлено на слог с буквой И — слИвовый.'
      },
      {
        title:'Как правильно ставить ударение в слове НАЧАЛСЯ?',
        buttons: [
            [{ text: 'начАлся', callback_data: '27_1' }],
            [{ text: 'началсЯ', callback_data: '27_2' }]
          ],
        right_answer: 2,
        full_answer: ' В указанном выше слове ударение следует ставить на слог с буквой Я — началсЯ.'
      },
      {
        title:'Как правильно ставить ударение в слове КРАЛАСЬ?',
        buttons: [
            [{ text: 'крАлась', callback_data: '28_1' }],
            [{ text: 'кралАсь', callback_data: '28_2' }]
          ],
        right_answer: 1,
        full_answer: ' В упомянутом выше слове ударение ставят на слог с первой буквой А — крАлась.'
      },
      {
        title:'Как правильно ставить ударение в слове ЩЕЛКАТЬ?',
        buttons: [
            [{ text: 'щЁлкать', callback_data: '29_1' }],
            [{ text: 'щелкАть', callback_data: '29_2' }]
          ],
        right_answer: 1,
        full_answer: ' В упомянутом выше слове ударение должно быть поставлено на слог с буквой Ё — щЁлкать.'
      }
    ];
