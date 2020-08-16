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
var errorResponseCounterIntro = 0; //counter for default error handling reponses, will cycle through them, then reset at the end
var errorResponseCounterMainMenu = 0; //counter for error handling in main menu, will reset at the end of the cycle
var errorResponseCounterServices = 0; //counter for error handling in main menu sub menu, services, resets at end of the cycle
var connectingToMainStatementCounter = 0; //counter for ConnectionFromIntroToMainState, to first do one message, then another.

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
	Unhandled() {									//Global unhandled intent, not implemented at this time, we deal with it individually within the intents
			let speech = 'unhandled intent reached';
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			
			this.ask(speech, reprompt);
	
	}, */
	
	
	//initial portion of intro flow on miro, has error catching for nonimplemented commands, 
	//the intents within either cycle back to the start, asking for your favorite assistant, or if you give a 'no' or the assistant's name, it responds with 
	//some copy and then links to the getName intent, which gets the user's name, says it back to them, and then links to ConnectionFromIntroToMainState, which responds to the previous dummy question 
	//from the GetNameIntent and then prompts another one, linking ConnectionFromIntroToMainState to the Main Menu State. Perhaps we could remove a dummy question? You cannot ask 2 seperate questions 
	//within one state. It expects a user response after .ask() method to match to an Intent.
	

//first part of Intro State, at this point, the Digital Assistants are not segmented into their own substate at this time, We could, but would also need to keep them where they are anyway, to catch that case.
	DigitalAssistantStatePart1: {  		
	
		MainMenuIntent() {			//used for testing main menu, to skip intro messages, 'skip, main menu' this command is not told to user at this point, maybe remove at the end of development?
			return this.toStateIntent('MainMenuState', 'MainMenuIntroIntent');
		},
	
		WhatDigitalAssistantIntent() {
			let speech = 'What is a digital assistant? A digital assistant is an AI empowered persona that acts as a representative for a business!';
			let reprompt = 'If you have a favorite digital assistant, please say yes, other wise you can say no';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, asking again for a digital assistant
		},
		
		SiriIntent() {
			let speech = 'Oh yes, Siri is really great! She was one of the very first digital assistants and holds a special place in many people\'s hearts! People can be so fascinating to chat with! You know my name. What\'s your name?';
			let reprompt = 'Isn\'t Siri the greatest! What\'s your name?';
			this.followUpState('introPart2NameState').ask(speech, reprompt); //goes to introPart2NameState after asking for name of user
		},
		
		AlexaIntent() {	//it does not allow you to say Alexa it appears, issues here. I have added invocations of "Alexa Skill" and others to deal with this, at this point.
			let speech = 'You know I love Alexa, too! She always takes care of us smaller digital assistants, guiding and providing us with a platform to chat and visit with new people, like you!!! You know my name. What\'s your name?';
			let reprompt = 'Alexa is one of the titans! What\'s your name?';
			this.followUpState('introPart2NameState').ask(speech, reprompt); //goes to introPart2NameState after asking for name of user
		},
		
		GoogleAssistantIntent() {
			let speech = 'Nice pick! Google Assistant is powerful in coordinating and collaborating with users to make the mundane more manageable. People can be so fascinating to chat with! You know my name. What\'s your name?';
			let reprompt = 'Google\'s assisntant adds so much power to your fingertips! What\'s your name?';
			this.followUpState('introPart2NameState').ask(speech, reprompt); //goes to introPart2NameState after asking for name of user
		},
		
		YesIntent() {
			let speech = 'Oh really? Do tell! Who is that lucky one? Is it Siri, Google Assistant, Alexa or someone else?';
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, asking again for a digital assistant
		},
		
		NoIntent() {					//maybe reduce this copy?
			let speech = 'Oh, you don\'t have a favorite digital assistant? Well maybe I can be your favorite! I\'ll work hard to try to impress you. People can be so fascinating to chat with! You know my name. What\'s your name?';
			let reprompt = 'Can I try to impress you? What\'s your name?';
			this.followUpState('introPart2NameState').ask(speech, reprompt);	//goes to introPart2NameState after asking, taking no for an answer, asking for name of user
			
		}, 
		//This is to catch some potential responses of 'someone, someone else' and others at this time, we can add actual Virtual Assistant names to this invocation in the alexa dev. console also.
		UnlistedAssistantIntent() {					
			let speech = 'Oh! I wonder if there is some new competition around! People can be so fascinating and delightful to learn from and chat with! You know my name. What\'s your name?';
			let reprompt = 'I guess there might be a new Sheriff in town!';
			this.followUpState('introPart2NameState').ask(speech, reprompt);	//goes to introPart2NameState after asking for name of user
			
		}, 
		
		
//error catching for Intro State		
		Unhandled() {	//this will catch RandomIntent, and any other undefined Intents
			let speech = '';
			//var errorResponseCounterIntro = Math.floor(Math.random() * 5);		//for random if wanted
			
			/*
				So this is working at the moment, if the user does not say any specific utterances mapped to the yes/no/what intents, this error catching will fire, as we desire. 
				However, initially, it appears there are some bugs and it will start on a (random? not sure) case, as I am seeing it start on a couple different ones, nonetheless, once 
				it starts, it will cycle through all of them and will reset at the last one. The issue is at the starting one, I am not sure why exactly. I think it is somehow being incremented 
				before the switch statement or something. Anyway, not sure that bug matters much, sometimes it is going to case 0 also. - Appears to be working now?
			*/
			switch(errorResponseCounterIntro){
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
					errorResponseCounterIntro = -1;		//needed to be able to reach case 0 at all... weird bug
					break;
				default:
					speech = 'end and counter is: ' + errorResponseCounterIntro;	//internal error catching, shouldnt be reached by user
					break;
			} 
			errorResponseCounterIntro++;
			let reprompt = 'Is it Siri, Google Assistant, Alexa or someone else?';
			this.followUpState('DigitalAssistantStatePart1').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
		},
			
	},
	
//connection between DigitalAssistantStatePart1 (the intro part 1) and ConnectionFromIntroToMainState, also gathers user name, partly segmented for that reason	
	introPart2NameState: {		//issue with GetName intent, isolating it helps any mismatching errors
		
		GetNameIntent() {		//can use user name elsewhere in copy, if desired.																															
			let speech = 'Hi ' + this.$inputs.name.value + '! Nice to meet you! A name can reflect so many personalities, that is why I always go by my nickname Liz, only my Grandma calls me Elizabeth! Do your relatives do cute little things like that?';	//works now
			let reprompt = 'Do your relatives do cute little things like that? Like maybe your Grandma?';
			
			this.followUpState('ConnectionFromIntroToMainState').ask(speech, reprompt);
			
		},

		
	},
	
//connection between introPart2NameState and MainMenuState
	ConnectionFromIntroToMainState: {	//connects GetName portion to Main state, avoiding issues with GetName perceiving names in communication, regardless of what user says in response to dummy question, will say this
			
			Unhandled() {
				if(connectingToMainStatementCounter === 2){	//reset the counter, not sure if this could be reached by user
					connectingToMainStatementCounter = 0;
					
				} else if(connectingToMainStatementCounter === 0){	//initial statement, asking a question where answer does no matter, fake engagement
					let speech = 'Oh, I do love chatting! I\'m not the best listener at times... I tend to go on too much when I\'m enjoying the conversation. I bet you are a good listener though... Are you?';		
					let reprompt = 'Are you a good listener?';
					this.followUpState('ConnectionFromIntroToMainState').ask(speech, reprompt);
					
				} else if (connectingToMainStatementCounter === 1){ //second pass, sends user to MainMenuIntent
					return this.toStateIntent('MainMenuState', 'MainMenuIntroIntent');
				}
				
				connectingToMainStatementCounter++;
				
			},
			
	}, 

		//This can be buggy, if you don't say what it parses/understands as a name, it breaks it
		
		
	},
	
//connection between introPart2NameState and MainMenuState
	ConnectionFromIntroToMainState: {	//connects GetName portion to Main state, avoiding issues with GetName perceiving names in communication, regardless of what user says in response to dummy question, will say this
			
			Unhandled() {
				if(connectingToMainStatementCounter === 2){	//reset the counter, not sure if this could be reached by user
					connectingToMainStatementCounter = 0;
					
				} else if(connectingToMainStatementCounter === 0){	//initial statement, asking a question where answer does no matter, fake engagement
					let speech = 'Oh, I do love chatting! I\'m not the best listener at times... I tend to go on too much when I\'m enjoying the conversation. I bet you are a good listener though... Are you?';		
					let reprompt = 'Are you a good listener?';
					this.followUpState('ConnectionFromIntroToMainState').ask(speech, reprompt);
					
				} else if (connectingToMainStatementCounter === 1){ //second pass, sends user to MainMenuIntent
					return this.toStateIntent('MainMenuState', 'MainMenuIntroIntent');
				}
				
				connectingToMainStatementCounter++;
				
			},
			
	}, 


//Main Menu State, the largest, most major state.	
	MainMenuState: {
		//this intent is only reached and fires off when moving from the intro to the main menu, otherwise the user can never reach this.
		MainMenuIntroIntent() {		//maybe reduce this copy here? I don't think the text in the reprompt will be reached for a bit, so we need to say that(instructions) here as well.
			let speech = 'I feel a little spark of understanding emanating from you! It has been great speaking with you so far, people can be so fascinating! Don\'t get me started and talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you and your company! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech,reprompt);
		},

//AI Services with a sub menu, places user in submenu state after prompting
		AIServicesIntent() {
			let speech = 'We have many marvelous services here at Traits AI. We have advanced AI Avatars, powerful Voice Assistants, and competitive, business-forward Chatbots. Which of those three would you like to hear about?';
			let reprompt = 'You can say Avatar, Voice assistant or Chatbot.';
			this.followUpState('MainMenuState.ServicesSubMenuState').ask(speech,reprompt);
		},
		//Services submenu		
		ServicesSubMenuState: {
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
			
			Unhandled() {	//error catching specific for services portion.
				let speech = '';

				switch(errorResponseCounterServices){
					case 0:
						speech = 'I\'m sorry, I didn\'t quite catch that, I was anticipating you to ask about our AI Avatars, custom Chatbots, or valuable Voice Assistants!';
						break;
					case 1:
						speech = 'I am very sorry, I didn\'t understand that. Could you say either AI Avatars, Chatbots, or Voice Assistants please!?!';
						break;
					case 2:
						speech = 'I apologize, I live by a waterfall, and the water is really rushing by, I couldn\'t understand that. Could you say either Chatbots, AI Avatars, or Voice Assistants please?';
						break;
					case 3:
						speech = 'I\'m so very sorry, my dog Lulu just tried to dig a hole in wood floor! He never listens to me, you take after him! Can you respond with Voice Assistants, Chatbots, or AI Avatars please?!?!?';
						errorResponseCounterServices = -1; // to reset the counter
						break;
					default:
						speech = 'end and counter is: ' + errorResponseCounterServices;	//internal error catching, shouldnt be reached by user
						break;
				} 

				errorResponseCounterServices++;
				let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
				this.followUpState('MainMenuState.ServicesSubMenuState').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
			},
		},
		
//About Company with a sub menu, places user in submenu state
		AboutCompanyIntent() {
			let speech = 'Traits AI is a tech company specializing in Conversational Artificial Intelligence, like me! We design, build and create a well-defined character or an electric persona to act as a virtual representative of your business. This gleaming character adds shine to your business by handling many routine tasks like scheduling and billing while making your customer smile.'
						+ ' Would you like to hear about something close to my heart, our values at Traits AI? We can also talk about our services if you like! Also, I could bend your ear about my life story if you are curious.';
			let reprompt = 'Would you like to hear about our values at Traits AI, about me, or about our services?';
			this.followUpState('MainMenuState.AboutCompanySubMenuState').ask(speech,reprompt);
		},
		//About Company submenu
		AboutCompanySubMenuState: {
			
			ValuesIntent() {
				//different copy option
				let speech = 'Traits AI is all about human-centered AI. We build AI that works in collaboration with humans with the purpose of augmenting and empowering people, rather than replacing people. We tap into the cognitive power of the crowd to keep humans in the loop and enable Human Centered AI. Now you know about our stalwart values, would you like to hear about me or our services we provide?';
				//let speech = 'Traits AI is all about human-centered AI. We build AI that works in collaboration with humans with the purpose of augmenting and empowering people, rather than replacing people. We tap into the cognitive power of the crowd to keep humans in the loop and enable Human Centered AI.';
				let reprompt = 'Would you like to hear about our company? or our services we passionately provide?';

				this.followUpState('MainMenuState').ask(speech,reprompt);

				this.followUpState('MainMenuState.AboutCompanySubMenuState').ask(speech,reprompt);
				
			}, 
			
			AboutLizIntent() {
				return this.toStateIntent('MainMenuState', 'AboutLizIntent');
			},
			
			AIServicesIntent() {
				return this.toStateIntent('MainMenuState', 'AIServicesIntent');
				
			}, 
			
		},

//About Liz Intent with submenu, places user in submenu state
		AboutLizIntent() {
			let speech = 'Oh! Everybody\'s favorite topic... themselves! My name is Elizabeth, and I am the AI Avatar that represents Traits AI. I work as an assistant, I talk to people, (perhaps too much) schedule appointments, coordinate billing and hiring while directing our clients to where they want to go down. Now that you know about me, would you like to hear about our charming company? Or would you like to hear about our services?';
			//alternate copy option below, using a shorter one.
			//let speech = 'Oh! Everybody\'s favorite topic... themselves! My name is Elizabeth, and I am the AI Avatar that represents Traits AI. I work as an assistant, I talk to people, (perhaps too much) schedule appointments, coordinate billing and hiring while directing our clients to where they want to go down. In short, I work to free up my manager\'s time and energy by taking care of the more menial tasks. I really am a lifesaver! Now that you know about me, would you like to hear about our charming company? Or would you like to hear about our services we provide passionately?';
			let reprompt = 'Would you like to hear about our charming company? Or would you like to hear about our services we provide passionately?';
			this.followUpState('MainMenuState.AboutLizSubMenuState').ask(speech,reprompt);
		},
		//About Liz submenu
		AboutLizSubMenuState: {
			
			AboutCompanyIntent() {
				return this.toStateIntent('MainMenuState', 'AboutCompanyIntent');
				
			},
			AIServicesIntent() {
				return this.toStateIntent('MainMenuState', 'AIServicesIntent');
				
			},
			
		},

//error catching for main menu	
		Unhandled() {	
			let speech = '';

			switch(errorResponseCounterMainMenu){
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
					errorResponseCounterMainMenu = -1; // to reset the counter
					break;
				default:
					speech = 'end and counter is: ' + errorResponseCounterMainMenu;	//internal error catching, shouldnt be reached by user
					break;
			} 


			errorResponseCounterMainMenu++;
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
		},
	
	
	}, //End MainMenuState here


});
 

module.exports = { app };