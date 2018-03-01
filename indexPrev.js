var mysql = require('mysql');
var connection = mysql.createConnection({
   host: "manitoumiddleschooldb.cnaaiauktiei.us-east-1.rds.amazonaws.com",
   user: "gdufford",
   password: "nilood27",
   database: "ManitouMiddleSchoolDB"
});

exports.handler = (event, context) => {
    connection.connect(function(err) {
      if (err) throw err;
      console.log("=================Connected!======================");
    });
    switch(event.request.type){
        case "IntentRequest":
            console.log('--------The intent request was captured--------');
            switch(event.request.intent.name){
                case "GetAorBDay":
                    console.log('----------Calling for today-----------');
                    context.succeed(generateResponse(buildSpeechletResponseToday()));
                    break;
                case "GetAorBDayDate":
                    var passedDate = event.request.intent.slots.TheDate.value;
                    console.log('-------Passed Date: ' + passedDate + "-------------");
                    context.succeed(generateResponse(buildSpeechletResponseDate(passedDate)));
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

buildSpeechletResponseToday = function() {
    var theDayResult = getAorBDay(new Date());
    console.log("----Today: " + theDayResult + "--------");
    return {
        outputSpeech: {
            type: "PlainText",
            text: "today is " + theDayResult
        },
        shouldEndSession: true
    };
};

buildSpeechletResponseDate = function(passedDate) {
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

getAorBDay = function(passedDate){
    var testDateString = "" + passedDate.getFullYear() + "-" + (passedDate.getMonth() + 1) + "-" + (passedDate.getDate());
    console.log("------TestDateString: " + testDateString + "-------------");
    for (i = 0; i < dates.length; i++) {
        if (testDateString === dates[i].date) {
            return dates[i].response;
        }
    }
    return "not found";
};

var dates = [
  {date: "2018-2-20", response: "an A day"},
  {date: "2018-2-21", response: "a B day"},
  {date: "2018-2-22", response: "an A day"},
  {date: "2018-2-23", response: "a B day"},
  {date: "2018-2-24", response: "neither, its a Saturday"},
  {date: "2018-2-25", response: "neither, its a Sunday"},
  {date: "2018-2-26", response: "an A day"},
  {date: "2018-2-27", response: "a B day"},
  {date: "2018-2-28", response: "an A day"}
];
