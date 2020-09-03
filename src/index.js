'use strict';

const { WebhookVerified: Webhook, ExpressJS } = require('jovo-framework');
const { app } = require('./app.js');

/*
const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
																		trying to solve verification issue, from guide on website.

const skillBuilder = SkillBuilders.custom();
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true); */

// ------------------------------------------------------------------
// HOST CONFIGURATION
// ------------------------------------------------------------------

// ExpressJS (Jovo Webhook)
if (process.argv.indexOf('--webhook') > -1) {
  const port = process.env.JOVO_PORT || 3000;
  Webhook.jovoApp = app;

  Webhook.listen(port, () => {
    console.info(`Local server listening on port ${port}.`);
  });

  Webhook.post(['/webhook','/webhook_alexa'], async (req, res) => {
    await app.handle(new ExpressJS(req, res));
  });
}

//if(adapter.verifyTimeStamp && adapter.verifySignature){
	
//}


// AWS Lambda
exports.handler = async (event, context, callback) => {
  await app.handle(new Lambda(event, context, callback));
};
