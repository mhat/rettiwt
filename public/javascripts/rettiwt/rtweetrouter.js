var RTweetRouter = function() {
  
  var routes = [];
  var route  = function(name, list, fn) { return { 
    'name' : name, 
    'list' : list,
    'fn'   : fn,
  } };
  
  return {
    'output': function () { 
      jQuery.each(routes,function(i,v){
        console.log("["+ i +"] '" + v.name + "' " + v.fn);
      });
    },
    
    'append': function (name, list, fn) {
      routes.push(route(name,list,fn));
      return RTweetRouter;
    },
    
    'accept': function (rtweets) {
      if (!jQuery.isArray(rtweets)) rtweets = [ rtweets ]
      
      jQuery.each(routes, function(i,route) { 
        
        route.list.add(jQuery.grep(rtweets, route.fn));
        
      });
    }
  };
}();