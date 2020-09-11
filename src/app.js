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

//so we cannot just set this to -1, because it will always reach the default case in the switch statement the first time, which we do not want, I think it is better to potentially skip 
//the first error-catching, rather than reach the default statement.

var errorResponseCounterDigitalAssistant = 0; //counter for default error handling reponses, will cycle through them, then reset at the end
var errorResponseCounterMainMenu = 0; //counter for error handling in main menu, will reset at the end of the cycle
var errorResponseCounterServices = 0; //counter for error handling in main menu sub menu, services, resets at end of the cycle
var connectingToMainStatementCounter = 0; //counter for ConnectionFromIntroToMainState, to first do one message, then another.
var errorResponseCounterCompanySubMenu = 0; //counter for error handling in AboutCompanySubMenuState, reset at the end of the cycle.
var errorResponseCounterLizSubMenu = 0; //counter for error handling in AboutLizSubMenuState, reset at the end of the cycle.

var AboutAvatarsBeenHeard = false;
var AboutVoiceAssistantsBeenHeard = false;
var AboutChatbotsBeenHeard = false;

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
        let speech = 'Hello there! My name is Elizabeth, but you can call me Liz for short! I work at Traits AI as a digital assistant. How are you today?';
        let reprompt = 'How is your day?';
		this.followUpState('IntroState').ask(speech, reprompt);
    },
	
	
//first state after launching	
	IntroState: {
		
		GoodIntent() {																																	
			let speech = 'I\'m happy to hear that. Before we get started, could I get your first name?';
			let reprompt = 'I\'m so pleased to hear that. Could I get your first name please?';
			
			this.followUpState('IntroNameState').ask(speech, reprompt);
		},
		
		BadIntent() {																																	
			let speech = 'Oh no! I\'m sorry to hear that. Well hopefully your day gets better soon. Before we get started, could I get your first name?';
			let reprompt = 'Could I get your first name please?';
			
			this.followUpState('IntroNameState').ask(speech, reprompt);
		},
		
		HowAreYouIntent() {																																	
			let speech = 'I\'m doing fabulous, thank you for asking! Before we get started, could I get your first name?';
			let reprompt = 'Could I get your first name please?';
			
			this.followUpState('IntroNameState').ask(speech, reprompt);
		},
		
		RepeatIntent() {
			this.repeat(); //once enabled user context in config.js, we can simply use the repeat method to achieve the goal
		},

		Unhandled() {																																	
			let speech = 'I see. Before we get started, could I get your first name please?';
			let reprompt = 'Could I get your first name please?';
			
			this.followUpState('IntroNameState').ask(speech, reprompt);
		},
		
		'AMAZON.CancelIntent'() {
			this.tell('See you next time!');
		},
		
	},
	//connection between IntroState and DigitalAssistantState (the intro part 2) also gathers user name, partly segmented for that reason	
	IntroNameState: {
		
		GetNameIntent() {		//can use user name elsewhere in copy, if desired.																															
			let speech = this.speechBuilder().addText('It\'s nice to meet you ' + this.$inputs.name.value + '! Here at Traits AI we build digital assistants.').addBreak('300ms').addText('I\'m curious about what you think about digital assistants, do you enjoy speaking with any other assistants besides Alexa like Siri, Google, or Bixby?');	
			let reprompt = 'Do you enjoy speaking with any other assistants besides Alexa like Siri, Google, or Bixby?';
			
			this.followUpState('DigitalAssistantState').ask(speech, reprompt);
		},

		
		RepeatIntent() {
			this.repeat();
		},
		
		Unhandled() {																																	
			let speech = 'Could I get your first name please?';			
			let reprompt = 'Could I get your first name please?';
			
			this.followUpState('IntroNameState').ask(speech, reprompt);
		}, 

		'AMAZON.CancelIntent'() {
			this.tell('See you next time!');
		},
	},


	DigitalAssistantState: {  		
	
		WhatDigitalAssistantIntent() {
			let speech = 'What is a digital assistant? A digital assistant is an AI empowered persona that acts as a representative for a business! Don\'t let me talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt); 
		},
		
		BixbyIntent() {
			let speech = 'Great choice! Bixby is a powerful tool in automating commands to save SamSung users\' efforts. Don\'t let me talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt); //to cycle back, asking again for a digital assistant
		},
		
		SiriIntent() {
			let speech = 'Oh yes, Siri is really great! She was one of the very first digital assistants and holds a special place in many people\'s hearts! Don\'t let me talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt); 
		},
		
		GoogleAssistantIntent() {
			let speech = 'Nice pick! Google Assistant is powerful in coordinating and collaborating with users to make the mundane more manageable. Don\'t let me talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt); 
		},
		
		YesIntent() {
			let speech = 'Oh really? Digital assistants can be so engaging and fun! Which is it, Siri, Bixby, or Google Assistant?';
			let reprompt = 'Is it Siri, Bixby, or Google Assistant?';
			this.followUpState('DigitalAssistantState').ask(speech, reprompt); //to cycle back, asking again for a digital assistant
		},
		
		NoIntent() {					
			let speech = 'Oh, I hope you will enjoy speaking with me! Digital assistants may not be perfect but I always bring something to the table. Don\'t let me talk your ear off about how Traits AI can fashion a perfect and personalized AI Avatar for you! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt);	
			
		}, 
		//This is to catch some potential responses of 'someone, someone else' and others at this time, we can add actual Virtual Assistant names to this invocation in the alexa dev. console also.
		UnlistedAssistantIntent() {					
			let speech = 'Oh! I wonder if there is some new competition around! Would you like to hear about our company, services, or I could tell you a little about me?';
			let reprompt = 'I guess there might be a new Sheriff in town! Would you like to hear about our company, services, or I could tell you a little about me?';
			this.followUpState('MainMenuState').ask(speech, reprompt);	
			
		}, 
		
//Repeat Intent, for when user asks for Liz to repeat the question in Intro		
		RepeatIntent() {
			this.repeat();
		},
		
//error catching for DigitalAssistantState		
		Unhandled() {	
			let speech = '';

			switch(errorResponseCounterDigitalAssistant){
				case 0:
					speech = 'My bad, I didn\'t quite catch what you just said. I was expecting you to tell me your favorite digital assistant like Siri, Bixby, or Google Assistant. Or if you don\'t have one say I don\'t have one.';
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
					speech = 'I\'m so sorry, Lulu just tried to dig a hole in my potted plant. What\'s the name of your favorite digital assistant again? Was it Siri, Bixby or google assistant? You can say no if they are not the one.';
					errorResponseCounterDigitalAssistant = -1;		//needed to be able to reach case 0 at all... weird bug
					break;
				default:
					speech = 'end and counter is: ' + errorResponseCounterDigitalAssistant;	//internal error catching, shouldnt be reached by user
					break;
			} 
			errorResponseCounterDigitalAssistant++;
			let reprompt = 'Is it Siri, Google Assistant, Bixby or someone else?';
			this.followUpState('DigitalAssistantState').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
		},

		'AMAZON.CancelIntent'() {
			this.tell('See you next time!');
		},
			
	}, //end digital assistant state


//Main Menu State, the largest, most major state.	
	MainMenuState: {
		//end the session when user say no to hear more about any services                   - Should this be a quit intent or something? will the user say No if they want to end session?
		NoIntent() {
			let speech = 'Sure, we can talk later when you are interested.';
			this.tell(speech);
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
							+ 'Do you have a vision for the face of your company? Let us know and we can help guide and grow your character idea into a blossoming persona! Our custom built AI Avatars go far beyond just being a voice and face, we specialize in realistic and unique character building from the bottom to the top! Would you like to hear more about our services?'
				let reprompt = 'Would you like to hear about one of our other services; Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about me?';
				AboutAvatarsBeenHeard = true;
				this.followUpState('MainMenuState.ServicesExitingState').ask(speech,reprompt);		

			},

			VoiceAssistantIntent() {
				let speech = 'Traits AI, Inc. utilizes Artificial Intelligence technology alongside human understanding and experience to create Voice-activated Voice assistants for devices like Amazon\'s Alexa and Google Assistant. The levels of engagement and enjoyment you can create for your customers to interact with combined with useful functions that all work together to attract customers and improve your business. This is an opportunity to grow a company into the highest reaches of the future. Take it and contact us at Traits AI! Would you like to hear more about our services?';
				let reprompt = 'Would you like to hear about one of our other services; AI Avatars or Chatbots? Or would you like to hear about our fantastic company or about me?';
				AboutVoiceAssistantsBeenHeard = true;
				this.followUpState('MainMenuState.ServicesExitingState').ask(speech,reprompt);
			},

			ChatbotIntent() {
				let speech = 'A character-driven AI Chatbot customized to your business can automate a lot of the routine busy-work for your company. A Chatbot is a personality that can be the face of your business at anytime, day or night! The only person who works those kind of hours is you, imagine what you could do with two of you!'
							+ 'A Chatbot can guide your clients through your FAQ, making appointments, and help you align the sales needs of your customers with what you can offer at exactly the perfect time! Would you like to hear more about our services?';
				let reprompt = 'Would you like to hear about one of our other services; AI Avatars or Voice Assistants? Or would you like to hear about our awesome company or about me?';	
				AboutChatbotsBeenHeard = true;
				this.followUpState('MainMenuState.ServicesExitingState').ask(speech,reprompt);	
			},
		//Error-catching
			Unhandled() {	//error catching specific for services submenu portion.
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
		
//State to ask user which service to hear about next, routing through logic so only services you have not heard yet are listed, until all are heard and it resets. 
//Connects to ServicesCabooseState to give more options than are available in ServicesSubmenu
		ServicesExitingState: {
			
			
			NoIntent() {		//user says No to hear more about company or services at the end of listening to a service
				let speech = 'Would you like to hear about our Company or about me?'
				let reprompt = 'Would you like to hear about me or our company?';
				this.followUpState('MainMenuState.ServicesCabooseState').ask(speech, reprompt); 
			}, 

			//catching the 'dummy' question of "Do you want to hear more about our services?" Anything else except for no
			Unhandled() {
				let speech = '';
				let reprompt = '';
				
				if(AboutAvatarsBeenHeard && AboutChatbotsBeenHeard && AboutVoiceAssistantsBeenHeard){
					//will only be reached on reseting
					speech = 'Would you like to hear about one of our services; AI Avatars, Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					//all have been heard, reset
					AboutAvatarsBeenHeard = false;
					AboutChatbotsBeenHeard = false;
					AboutVoiceAssistantsBeenHeard = false;
				} else if (AboutAvatarsBeenHeard && !AboutChatbotsBeenHeard && !AboutVoiceAssistantsBeenHeard){
					speech = 'Would you like to hear about one of our other services; Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					
				} else if (AboutAvatarsBeenHeard && AboutChatbotsBeenHeard && !AboutVoiceAssistantsBeenHeard){
					speech = 'Would you like to hear about one of our other services; Voice Assistants? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					
				} else if (AboutAvatarsBeenHeard && !AboutChatbotsBeenHeard && AboutVoiceAssistantsBeenHeard){
					speech = 'Would you like to hear about one of our other awesome services; Chatbots? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					
				} else if (!AboutAvatarsBeenHeard && AboutChatbotsBeenHeard && AboutVoiceAssistantsBeenHeard){
					speech = 'Would you like to hear about one of our other awesome services; AI Avatars? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					
				} else if (!AboutAvatarsBeenHeard && AboutChatbotsBeenHeard && !AboutVoiceAssistantsBeenHeard){
					speech = 'Would you like to hear about one of our other awesome services; AI Avatars or Voice Assistants? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					
				} else if (!AboutAvatarsBeenHeard && !AboutChatbotsBeenHeard && AboutVoiceAssistantsBeenHeard){
					speech = 'Would you like to hear about one of our other awesome services; AI Avatars or Chatbots? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
					
				} else {	//Don't think this will ever be reached?
					speech = 'ELSE CASE. Would you like to hear about one of our services; AI Avatars, Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about me?';
					reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
				}
				
				this.followUpState('MainMenuState.ServicesCabooseState').ask(speech, reprompt); 
			
			},
		},
//connecting state to give user all options in services, as well as some of those in main menu, routing user back through the various parts of the main menu or main submenus	
		ServicesCabooseState: {
			
			NoIntent() {
				let speech = 'Sure, we can talk later when you are interested! Thanks for talking with me!';
				this.tell(speech);
			},
								
			AvatarIntent() {
				return this.toStateIntent('MainMenuState.ServicesSubMenuState', 'AvatarIntent');
			},

			VoiceAssistantIntent() {
				return this.toStateIntent('MainMenuState.ServicesSubMenuState', 'VoiceAssistantIntent');
			},

			ChatbotIntent() {
				return this.toStateIntent('MainMenuState.ServicesSubMenuState', 'ChatbotIntent');
			},
			
			AboutLizIntent() {
				return this.toStateIntent('MainMenuState', 'AboutLizIntent');
			},
			
			AboutCompanyIntent() {
				return this.toStateIntent('MainMenuState', 'AboutCompanyIntent');
			},
			
			//basic error catching for the moment
			Unhandled() {
				let speech = 'Would you like to hear about one of our services; AI Avatars, Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about me?';
				let reprompt = 'WWould you like to hear about one of our services; AI Avatars, Voice Assistants or Chatbots? Or would you like to hear about our marvelous company or about little ol\' me?';
				this.followUpState('MainMenuState.ServicesCabooseState').ask(speech, reprompt); 
			},
			
		},
		
		
//About Company with a sub menu, places user in submenu state, this is within MainMenuState
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

				this.followUpState('MainMenuState.AboutCompanySubMenuState').ask(speech,reprompt);
				
			}, 
			
			AboutLizIntent() {
				return this.toStateIntent('MainMenuState', 'AboutLizIntent');
			},
			
			AIServicesIntent() {
				return this.toStateIntent('MainMenuState', 'AIServicesIntent');
			}, 
			//Repeat Intent, for when user asks for Liz to repeat herself in AboutCompanySubMenuState, sends user back to AboutCompanyIntent, to hear about company again, and then ask what to do next
			RepeatIntent() {
				return this.repeat();
			},
		//Error-catching
			Unhandled() {	//error catching specific for about company submenu portion.
				let speech = '';
				switch(errorResponseCounterCompanySubMenu){
					case 0:
						speech = 'I\'m sorry, I didn\'t quite catch that, I was anticipating you to ask about our company, our values, the AI services or about me!';
						break;
					case 1:
						speech = 'I am very sorry, I didn\'t understand that. Could you say either company, values, AI services or Liz please!?!';
						break;
					case 2:
						speech = 'I apologize, I live near a glacier, and a massive floe just broke off, and I couldn\'t understand that. Could you say company, values, AI services or Liz either please?';
						break;
					case 3:
						speech = 'I\'m so very sorry, my dog Lulu just chewed a hole in my favorite blouse! He never follows my instructions, you take after him! Can you respond with company, values, AI services or Liz please?!?!?';
						errorResponseCounterCompanySubMenu = -1; // to reset the counter
						break;
					default:
						speech = 'end and counter is: ' + errorResponseCounterCompanySubMenu;	//internal error catching, shouldnt be reached by user
						break;
				} 

				errorResponseCounterCompanySubMenu++;
				let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
				this.followUpState('MainMenuState.AboutCompanySubMenuState').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
			},
		},

//About Liz Intent with submenu, places user in submenu state, this is within MainMenuState
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
			//Repeat Intent, for when user asks for Liz to repeat herself in AboutLizSubMenuState, sends user back to AboutLiz intent, to hear about her again, and then ask what to do next
			RepeatIntent() {
				return this.toStateIntent('MainMenuState', 'AboutLizIntent');
			},
		//Error-catching 
			Unhandled() {	//error catching specific for about liz submenu portion.
				let speech = '';

				switch(errorResponseCounterLizSubMenu){
					case 0:
						speech = 'I\'m sorry, I didn\'t quite catch that, I was anticipating you to ask about our company, the AI services or about me!';
						break;
					case 1:
						speech = 'I am very sorry, I didn\'t understand that. Could you say either company, AI services or Liz please!?!';
						break;
					case 2:
						speech = 'I apologize, I\'m just next door to a construction site, and they just started up the jackhammer! I couldn\'t understand that. Could you say company, AI services or Liz either please?';
						break;
					case 3:
						speech = 'I\'m so very sorry, my dog Lulu just tromped through my place with dirty paws!!! He never does what I tell him, you take after him! Can you respond with company, AI services or Liz please?!?!?';
						errorResponseCounterLizSubMenu = -1; // to reset the counter
						break;
					default:
						speech = 'end and counter is: ' + errorResponseCounterLizSubMenu;	//internal error catching, shouldnt be reached by user
						break;
				} 

				errorResponseCounterLizSubMenu++;
				let reprompt = 'Would you like to hear about our company, services, or I could tell you a little about me?';
				this.followUpState('MainMenuState.AboutLizSubMenuState').ask(speech, reprompt); //to cycle back, as we would want to if they say an unassigned intent
			
			},
			
			
		},
		
//Repeat Intent, for when user asks for Liz to repeat the question in the Main Menu	
		RepeatIntent() {
			this.repeat();
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
	
		'AMAZON.CancelIntent'() {
			this.tell('See you next time!');
		},
	
	}, //End MainMenuState here


});
 

module.exports = { app };