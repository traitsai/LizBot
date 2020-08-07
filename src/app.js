'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	
  LAUNCH() {
		var errorResponseCounter = 0; //counter for default error handling reponses, will cycle through them, then reset at the end
        let speech = 'Hello there! My name is Elizabeth, but you can call me Liz for short! I work at Traits AI as a  digital assistant. I\'d be happy to tell you more about our company. I\'m curious if you have a favorite digital assistant like Alexa, Google Assistant, Siri, or someone else. Do you have a favorite?';
        let reprompt = 'If you have a favorite digital assistant, please say yes, other wise you can say no';
		this.followUpState('DigitalAssistantState').ask(speech, reprompt);
    },
	
	
	DigitalAssistantState: {  
		
		WhatDigitalAssistantIntent() {
			let speech = 'What is a digital assistant? A digital assistant is an AI empowered persona that acts as a representative for a business!';
			let reprompt = 'If you have a favorite digital assistant, please say yes, other wise you can say no';
			this.followUpState('DigitalAssistantState').ask(speech, reprompt); //to cycle back, as we would want to if they say what
		},
		
		YesIntent() {
			let speech = 'You chose Yessssssssir!';
			let reprompt = 'ok';
			this.followUpState('DigitalAssistantState').ask(speech, reprompt); //to cycle back, for testing at this point
		},

		NoIntent() {
			let speech = 'You chose No!';
			let reprompt = 'nope';
			this.followUpState('DigitalAssistantState').ask(speech, reprompt);	//to cycle back, for testing at this point
		}, 
		
		Unhandled() {	//not working at this moment
			let speech = 'unhandled intent reached';
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			
			//this.speech.addText('Unhandled intent reached');
            //this.reprompt.addText('Please answer with yes or no.');
			
			
			this.ask(speech, reprompt);
	
		},
		
		
		
	}
	

});

module.exports = { app };
