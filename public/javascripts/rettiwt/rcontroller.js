var RController = function() {
  
  var rtlmap   = {
    'DEFAULT'  : { 'rtl': RTweetList('DEFAULT'), 'sel': '.r-tweets-container', 'state': {'rendered':{} } },
    'REPLIES'  : { 'rtl': RTweetList('REPLIES'), 'sel': '.r-tweets-container', 'state': {'rendered':{} } }
  }
  
  var z  = {
    'on_rtweetlist_update' : function (evt, rtweetlist) {
      var state    = rtlmap[rtweetlist.name()].state;
      var selector = rtlmap[rtweetlist.name()].sel;
      
      rtweetlist.each(function(i,rtweet){
        if (state.rendered[rtweet.tweet.id] == true) return
        else
          state.rendered[rtweet.tweet.id] = true
        
        // FIXME: I really should do something so that I don't generate growl
        // spam on startup.
        window.fluid.showGrowlNotification({
          name:         "Tweet Arrived",
          description:  rtweet.tweet.text,
          priority:     0, 
          sticky:       false
        });
        
        // create the tweet, yo!
        var tweet_id = 't_' + rtweet.tweet.id;
        var tweet    = jQuery(".r-tweet-template")
          .clone()
          .attr('id',tweet_id)
          .removeClass('r-tweet-template')
          .prependTo(selector);
        
        tweet.find(".r-tweet-picture").attr('src', rtweet.user.profile_image_url);
        tweet.find(".r-tweet-name").html(rtweet.user.screen_name);
        tweet.find(".r-tweet-text").html(rtweet.tweet.text + '/'  + rtweet.tweet.created_at);
        
        tweet.fadeIn();
      });
    }
  };
  
  return {
    
    'initalize' : function () {
      
      window.console.log("RController#initalize: Routes");
      window.console.log(RTweetRouter);
      // create several default routes
      RTweetRouter
        .append("DEFAULT", rtlmap['DEFAULT'].rtl, function(rtweet) {
          return rtweet
        })
        .append("REPLIES", rtlmap['REPLIES'].rtl, function(rtweet) {
          if (rtweet.tweet.in_reply_to_user_id) {
            return rtweet
          }
        });
        
      window.console.log("RController#initalize: Tweetlist Binder!");
      
      jQuery(document).bind('rettiwt.rtweetlist.add', z.on_rtweetlist_update);
      
      window.console.log("RController#initalize: Done");
    }
  };
}();
