var RTweetRouter = function() {
  
  var routes = [];
  var route  = function(name, fn) { return { 'name': name, 'fn' : fn } };
  
  return {
    'output': function () { 
      jQuery.each(routes,function(i,v){
        console.log("["+ i +"] '" + v.name + "' " + v.fn);
      });
    },
    'append': function (name, fn) {
      routes.push(route(name,fn));
      return RTweetRouter;
    },
    'accept': function (rtweets) {
      if (!jQuery.isArray(rtweets)) rtweets = [ rtweets ]
      
      jQuery.each(routes, function(i,route) { 
        jQuery.each(rtweets, function(p,rtweet) {
          route.fn(route,rtweet);
        });
      });
    }
  };
}();

  