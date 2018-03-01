var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});

exports.handler = function(event, context, callback){
  switch(event.request.type){
    case "IntentRequest":
      console.log('--------The intent request was captured--------');
      switch(event.request.intent.name){
        case "GetAorBDay":
          console.log('----------Calling for today-----------');
          context.succeed(generateResponse(buildSpeechletResponseToday(context)));
          break;
        case "GetAorBDayDate":
          var passedDate = event.request.intent.slots.TheDate.value;
          console.log('-------Passed Date: ' + passedDate + "-------------");
          context.succeed(generateResponse(buildSpeechletResponseDate(passedDate,context)));
          break;
      }
    break;
  }
};

generateResponse = function(speechletResponse) {
  return {
      version: "1.0",
      sessionAttributes: {},
      response: speechletResponse
  };
};

buildSpeechletResponseToday = function(context) {
  var theDayResult = getAorBDay(new Date(),context);
  console.log("----Today: " + theDayResult + "--------");
  return {
      outputSpeech: {
          type: "PlainText",
          text: "today is " + theDayResult
      },
      shouldEndSession: true
  };
};

buildSpeechletResponseDate = function(passedDate,context) {
  var theDayResult = getAorBDay(new Date(passedDate));
  console.log("----Date: " + theDayResult + "--------");
  return {
    outputSpeech: {
      type: "PlainText",
      text: "that is " + theDayResult
    },
    shouldEndSession: true
  };
};

getAorBDay = function(passedDate,context){
  console.log('----IN getAorBDay FUNCTION----');
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err, connection) {
    if (err) { console.log('----getAorBDay ERROR----'); throw err; }

    var query = 'select * from all_dates where day_date = ' + passedDate;
    console.log('-----query: ' + query + '-----------------');

    connection.query(query,function(error, results, fields){
      connection.release();

      if(error) {
        callback(error);
      } else {
        console.log('-----no error------');
        console.log('-----RESULT: ' + results[0].day_type + "--------" + results[0].day_date + '--------------');

        var reply = "That is ";
        var dayType = results[0].day_type;

        if (dayType === 'A') reply += "an A day";
        if (dayType === 'B') reply += "a B day";
        if (dayType === 'O' || dayType === 'S') reply += "a day without school";

        return reply;// + "----" + results[0].day_date);
      }
      //console.log(results[0].day_type + "--" + results[0].day_date); //Old local line, not lambda specific

      //process.exit(); //used for local, not for Lambda
    });
  });

  //--OLD CODE-PRE-DB------//
  /*var testDateString = "" + passedDate.getFullYear() + "-" + (passedDate.getMonth() + 1) + "-" + (passedDate.getDate());
  console.log("------TestDateString: " + testDateString + "-------------");
  for (i = 0; i < dates.length; i++) {
      if (testDateString === dates[i].date) {
          return dates[i].response;
      }
  }
  return "not found";*/
};
