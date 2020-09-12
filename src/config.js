// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  intentMap: {
    'AMAZON.CancelIntent' : 'CancelIntent',
    'AMAZON.StopIntent' : 'CancelIntent',
    'AMAZON.FallbackIntent' : 'Unhandled',
    'AMAZON.RepeatIntent' : 'RepeatIntent',
	
	
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
