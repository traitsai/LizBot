// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  intentMap: {
    'AMAZON.StopIntent': 'END',
	'AMAZON.FallbackIntent' : 'Unhandled'
	
	
  },

  db: {
    FileDb: {
      pathToFile: '../db/db.json',
    },
  },

  user: {
    context: {
        enabled: true,
        prev: {
            size: 3,
            request: {
                timestamp: false,
            },
            response: {
                state: false,
            },
        },
    }
},
};
