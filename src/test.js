

module.exports = {
  getQuestion: function() {
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
		    full_answer: 'В данном слове ударение должно быть поставлено на слог с буквой У — балУясь.'
		  }
		];
    return questions[Math.floor(Math.random()*questions.lenght)];
  }
};