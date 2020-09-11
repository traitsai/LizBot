// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  intentMap: {
    'AMAZON.StopIntent': 'END',
    'AMAZON.FallbackIntent' : 'Unhandled',
    'AMAZON.RepeatIntent' : 'RepeatIntent',
	
	
  },
/*

  db: {
        DynamoDb: {
            tableName: 'LizTable',
        }
  }
	*/

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
