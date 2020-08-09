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
};
