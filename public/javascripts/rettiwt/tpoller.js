/*
** Take 1 - I want to keep this fairly simple, poll on an interval and avoid
** overlapping pollers if a request is taking a long time. 
**
*/

var TwitterPoller = function(){
  
  var interval     = 60000;
  var interval_id  = 0;
  var variable     = 0;
  
  var waiting      = false;
  
  var poller = function() {
    if (waiting == true) {
      window.console.log("No rest for the weary...");
      return;
    }
    else {
      waiting = true;
      window.console.log("Active polling...");
      jQuery.getJSON(
        'http://twitter.com/statuses/friends_timeline.json', 
        function(data,textStatus){
          
          
          RTweetRouter.accept(jQuery.map(data, function(v,i){
            return RTweetFactory.parse_json(v);
          }));
          
          
          // mutex go-bye-bye
          waiting = false;
          
        }
      );
    
    }
  };
  
  return {
    'start' : function() { window.setInterval(poller, interval); poller(); },
    'stop'  : function() { window.clearInterval(interval_id);    },
    'test'  : function(v){ variable = v; }
  }
}();