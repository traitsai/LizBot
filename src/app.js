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
var errorResponseCounter = 0; //counter for default error handling reponses, will cycle through them, then reset at the end

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
        let speech = 'Hello there! My name is Elizabeth, but you can call me Liz for short! I work at Traits AI as a  digital assistant. I\'d be happy to tell you more about our company. I\'m curious if you have a favorite digital assistant like Alexa, Google Assistant, Siri, or someone else. Do you have a favorite?';
        let reprompt = 'If you have a favorite digital assistant, please say yes, other wise you can say no';
		this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt);
    },
	
	/*
	Unhandled() {									//Global unhandled intent, not implemented at this time
			let speech = 'unhandled intent reached';
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			
			this.ask(speech, reprompt);
	
	}, */
	
	
	DigitalAssistantStatePart1: {  
	
	
		WhatDigitalAssistantIntent() {
			let speech = 'What is a digital assistant? A digital assistant is an AI empowered persona that acts as a representative for a business!';
			let reprompt = 'If you have a favorite digital assistant, please say yes, other wise you can say no';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, for testing
		},
		SiriIntent() {
			let speech = 'Oh yes, Siri is really great! She was one of the very first digital assistants and holds a special place in many people\'s hearts!';
			let reprompt = 'Isn\'t Siri the greatest!';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, for testing, it will go to introPart2NameState in actuality 
		},
		AlexaIntent() {	//it does not allow you to say Alexa it appears, issues here.
			let speech = 'You know I love Alexa, too! She always takes care of us smaller digital assistants, guiding and providing us with a platform to chat and visit with new people, like you!!!';
			let reprompt = 'Alexa is one of the titans!';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, for testing
		},
		GoogleAssistantIntent() {
			let speech = 'Nice pick! Google Assistant is powerful in coordinating and collaborating with users to make the mundane more manageable.';
			let reprompt = 'Google\'s assisntant adds so much power to your fingertips!';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, for testing
		},
		YesIntent() {
			let speech = 'Oh really? Do tell! Who is that lucky one? Is it Siri, Google Assistant, Alexa or someone else?';
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, for testing at this point
		},

		NoIntent() {					//maybe reduce this copy?
			let speech = 'Oh, you don\'t have a favorite digital assistant? Well maybe I can be your favorite! I\'ll work hard to try to impress you. I love learning more about interesting people.. And people can be so fascinating to chat with! You have known my name. What\'s your name then?';
			let reprompt = 'Can I try to impress you?';
			this.followUpState('introPart2NameState').ask(speech, reprompt);	//this is the one connected to next state, others are not at this point.
			
		}, 
		
		Unhandled() {	//this will catch RandomIntent, and any other undefined Intents
			let speech = '';
			//var errorResponseCounter = Math.floor(Math.random() * 5);		//for random if wanted
			
			
			/*
				So this is working at the moment, if the user does not say any specific utterances mapped to the yes/no/what intents, this error catching will fire, as we desire. 
				However, initially, it appears there are some bugs and it will start on a (random? not sure) case, as I am seeing it start on a couple different ones, nonetheless, once 
				it starts, it will cycle through all of them and will reset at the last one. The issue is at the starting one, I am not sure why exactly. I think it is somehow being incremented 
				before the switch statement or something. Anyway, not sure that bug matters much, sometimes it is going to case 0 also.
			*/

			switch(errorResponseCounter){
				case 0:
					speech = 'My bad, I was distracted by my dog Lulu, and didn\'t quite catch what you just said. I was expecting you to tell me your favorite digital assistant like Siri, Alexa, or Google Assistant. Or if you don\'t have one say I don\'t have one.';
					break;
				case 1:
					speech = 'I am very sorry, I didn\'t quite understand that. Lulu was making a ruckus, can you name your favorite digital assistant please? You can always say no if you don\'t have one.';
					break;
				case 2:
					speech = 'I\'m sorry honey, but I didn\'t get that. Can you please just tell me yes or no?';
					break;
				case 3:
					speech = 'I apologize, I live on a lake, and my dog Lulu just came back all wet to her delight! Who\'s your favorite digital assistant again?';
					break;
				case 4:
					speech = 'I\'m so sorry, Lulu just tried to dig a hole in my potted plant. What\'s the name of your favorite digital assistant again? Was it Siri, Alexa or google assistant? You can say no if they are not the one.';
					errorResponseCounter = -1;		//needed to be able to reach case 0 at all... weird bug
					break;
				default:
					speech = 'end and counter is: ' + errorResponseCounter;	//internal error catching, shouldnt be reached by user
					break;
			} 


			errorResponseCounter++;
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
		},
		
		
	},
	
	introPart2NameState: {
		
		YesIntent() {
			let speech = 'reached';		//using for testing
			let reprompt = 'reached';
			this.followUpState('introPart2NameState').ask(speech, reprompt);
			
		},
		
		GetNameIntent() {
			let speech = 'Your name is ' + this.$inputs.name.value;		//some issue here, in the debugger it is pulling the name correctly, but here it is assigning speech to null?
			let reprompt = 'I didn\'t get your name!?';
			this.followUpState('introPart2NameState').ask(speech, reprompt);
			
			
		},
		
		
		
		
	}
	//test

}); 

module.exports = { app };
