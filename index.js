var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});

exports.handler = function(event, context, callback){
  var passedDate, reply;
  switch(event.request.type){
    case "IntentRequest":
      console.log('--------The intent request was captured--------');
      switch(event.request.intent.name){
        case "GetAorBDay":
          var dateHolder = new Date();
          passedDate = dateHolder.getFullYear() + '-' + (dateHolder.getMonth() + 1) + "-" + dateHolder.getDate();
          reply = "Today is ";
          console.log('----------Calling for today-----------');
          //context.succeed(generateResponse(buildSpeechletResponseToday(context)));
          break;
        case "GetAorBDayDate":
          passedDate = event.request.intent.slots.TheDate.value;
          reply = "That is ";
          console.log('-------Passed Date: ' + passedDate + "-------------");
          //context.succeed(generateResponse(buildSpeechletResponseDate(passedDate,context)));
          break;
      }
    break;
  }


  //console.log('----IN getAorBDay FUNCTION----');
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err, connection) {
    if (err) { console.log('----getAorBDay ERROR----'); throw err; }
    //STR_TO_DATE('2018-02-19','%Y-%m-%d')
    var query = "select * from all_dates where day_date = STR_TO_DATE('" + passedDate + "','%Y-%m-%d')";
    console.log('-----query: ' + query + '-----------------');

    connection.query(query,function(error, results, fields){
      console.log('-----IN QUERY------');
      connection.release();

      if(error) {
        console.log('-----IN ERROR------');
        callback(error);
      } else {
        console.log('-----no error------');
        console.log('-----Count: ' + results.length + '-----');
        //console.log('-----RESULT: ' + results[0].day_type + "--------" + results[0].day_date + '--------------');

        try {
          var dayType = results[0].day_type;
        }  catch(error){

        }

        if (dayType === 'A') {
          reply += 'an A day';
        } else if (dayType === 'B') {
          reply += 'a B day';
        } else if (dayType === 'O' || dayType === 'S') {
          reply += 'a day without school';
        } else {
          reply += 'a day I dont know about. Might be a weekend or day off from school';
        }

        //return reply;// + "----" + results[0].day_date);
        context.succeed(
          {
            version: "1.0",
            sessionAttributes: {},
            response: {
              shouldEndSession: true,
              outputSpeech: {
                type: "PlainText",
                text: reply
              }
            }
          }
        );
      }
      //console.log(results[0].day_type + "--" + results[0].day_date); //Old local line, not lambda specific

      //process.exit(); //used for local, not for Lambda
    });



});

/*generateResponse = function(speechletResponse) {
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
