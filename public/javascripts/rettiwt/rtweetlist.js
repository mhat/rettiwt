var RTweetList = function (name) {
  
  // private instance variables
  var table    = {};
  var list     = [];
  var queue    = [];
  var max_size = 200;
  
  return {
    'name'     : function ()   { return name        },
    'size'     : function ()   { return list.length },
    'length'   : function ()   { return list.length },
    'each'     : function (fn) { 
      for(var idx=0; idx < list.length; idx++){ fn(idx,list[idx]) }
    },
    
    // TODO: Needs more thought since the Router doesn't have direct access to
    // the RTweetList's so it can't call flush.
    'queue' : function ( tweets ) {
        queue = jQuery.merge(queue, jQuery.isArray(tweets) ? tweets : [tweets]);
    },
    'flush' : function () {
        this.add(queue);
        queue = [];
    },
    
    
    'add' : function ( tweets ) {
      // simpler if we just assume its always an array
      if (!jQuery.isArray(tweets)) tweets = [tweets];
      
      // FIXME: right now I'm assuming that RTweets will always be passed in
      // descending order, this probably isn't reasonable.
      
      var add_ctr = 0;
      jQuery.each(tweets, function(ctr,tweet) {
        // first, let's make sure we were really passed an RTweet
        if (typeof tweet['state'] == "undefined" ||
            typeof tweet['user']  == "undefined" ||
            typeof tweet['tweet'] == "undefined"  ) return;
        
        // second, ignore RTeets that have already been added to the list
        if (table[tweet.tweet.id] == true         ) return;
        
        // add the tweet list and lookup table
        list.unshift(tweet);
        table[tweet.tweet.id] = true;
        add_ctr++;
      });
      
      // get all eventy with the added RTweets
      if (add_ctr != 0)
        jQuery(document).trigger('rettiwt.rtweetlist.add', [this]);
    }, 
    
    // TODO: Need to have a method to ensure the list stays below 500.
  };
};



