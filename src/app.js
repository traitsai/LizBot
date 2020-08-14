 'use  strict';

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
var errorResponseCounter2 = 0;

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
			this.ask(speech,reprompt);
			//this.followUpState('introPart2NameState').ask(speech, reprompt);	//this is the one connected to next state, others are not at this point.
			
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
	
	//introPart2NameState: {
		
		YesIntent() {
			let speech = 'reached';		//using for testing
			let reprompt = 'reached';
			this.ask(speech,reprompt);
			//this.followUpState('introPart2NameState').ask(speech, reprompt);
			
		},
		
		GetNameIntent() {
			let speech = 'Your name is ' + this.$inputs.name.value;		//some issue here, in the debugger it is pulling the name correctly, but here it is assigning speech to null?
			let reprompt = 'I didn\'t get your name!?';
			this.ask(speech, reprompt);
			//this.followUpState('introPart2NameState').ask(speech, reprompt);


		},
		
	//},
	
	MainMenuState: {
		MainMenuIntent() {
			let speech = 'I feel a little spark of understanding emanating from you! It has been great speaking with you so far, people can be so fascinating! Don\'t get me started and talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you and your company!';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

		AboutCompanyIntent() {
			let speech = 'Traits AI is a tech company specializing in Conversational Artificial Intelligence, like me! We design, build and create a well-defined character or an electric persona to act as a virtual representative of your business. This gleaming character adds shine to your business by handling many routine tasks like scheduling and billing while making your customer smile.'
						+ 'Would you like to hear about something close to my heart, our values at Traits AI? We can also talk about our services if you like! Also, I could bend your ear about my life story if you are curious.';
			let reprompt = 'Would you like to hear about something close to my heart, our values at Traits AI?';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

		ValuesIntent() {
			let speech = 'Traits AI is all about human-centered AI. We build AI that works in collaboration with humans with the purpose of augmenting and empowering people, rather than replacing people. We tap into the cognitive power of the crowd to keep humans in the loop and enable Human Centered AI.';
			let reprompt = 'Now you know about our values, would you like to hear about our company? or our services we passionately provide?';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

		LizIntent() {
			let speech = 'Oh! Everybody\'s favorite topic... themselves! My name is Elizabeth, and I am the AI Avatar that represents Traits AI. I work as an assistant, I talk to people, (perhaps too much) schedule appointments, coordinate billing and hiring while directing our clients to where they want to go down. In short, I work to free up my manager\'s time and energy by taking care of the more menial tasks. I really am a lifesaver!';
			let reprompt = 'Now that you know about me, would you like to hear about our charming company? Or would you like to hear about our services we provide passionately?';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

		AIServiceIntent() {
			let speech = 'We have many marvelous services here at Traits AI. We have advanced AI Avatars, powerful Voice Assistants, and competitive, business-forward Chatbots. Which of those three would you like to hear about?';
			let reprompt = 'You can say Avatar, Voice assistant or Chatbot.';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

		AvatarIntent() {
			let speech = 'AI Avatars are the next step in the burgeoning field of conversational AI. A living thing like you and me has both a face and voice that represents them. This is what an AI Avatar is, the composite visual and auditory parts of a person!'
						+ 'Do you have a vision for the face of your company? Let us know and we can help guide and grow your character idea into a blossoming persona! Our custom built AI Avatars go far beyond just being a voice and face, we specialize in realistic and unique character building from the bottom to the top!'
			let reprompt = 'Would you like to hear about one of our other services; Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about me?';
			this.followUpState('MainMenuState').ask(speech,reprompt);		

		},

		VoiceAssistantIntent() {
			let speech = 'Traits AI, Inc. utilizes Artificial Intelligence technology alongside human understanding and experience to create Voice-activated Voice assistants for devices like Amazon\'s Alexa and Google Assistant. The levels of engagement and enjoyment you can create for your customers to interact with combined with useful functions that all work together to attract customers and improve your business. This is an opportunity to grow a company into the highest reaches of the future. Take it and contact us at Traits AI!';
			let reprompt = 'Would you like to hear about one of our other services; AI Avatars or Chatbots? Or would you like to hear about our fantastic company or about me?';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

		ChatbotIntent() {
			let speech = 'A character-driven AI Chatbot customized to your business can automate a lot of the routine busy-work for your company. A Chatbot is a personality that can be the face of your business at anytime, day or night! The only person who works those kind of hours is you, imagine what you could do with two of you!'
						+ 'A Chatbot can guide your clients through your FAQ, making appointments, and help you align the sales needs of your customers with what you can offer at exactly the perfect time!';
			let reprompt = 'Would you like to hear about one of our other services; AI Avatars or Voice Assistants? Or would you like to hear about our awesome company or about me?';	
			this.followUpState('MainMenuState').ask(speech,reprompt);	
		},
	
		Unhandled() {	//this will catch RandomIntent, and any other undefined Intents
			let speech = '';

			switch(errorResponseCounter){
				case 0:
					speech = 'I\'m sorry, I didn\'t quite catch that, I was anticipating you to ask about our company, our services, or about my charming self.';
					break;
				case 1:
					speech = 'I am very sorry, I didn\'t quite understand that. Could you say either Services, Company, or About me please!';
					break;
				case 2:
					speech = 'I apologize, I live on a lake, and the Mosquitoes are swarming, buzzing in my ears. Could you say either Services, About me, or Company please?';
					break;
				case 3:
					speech = 'I\'m so very sorry, my dog Lulu just tried to dig a hole in my back garden. He never listens to me, just like you it seems! Can you respond with Services, About me, or Company please?!?!?';
					break;
				default:
					speech = 'end and counter is: ' + errorResponseCounter2;	//internal error catching, shouldnt be reached by user
					break;
			} 


			errorResponseCounter2++;
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
		},
	
	
	},

});

 

module.exports = { app };
