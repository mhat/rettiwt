var RController = function() {
  
  var rtlmap   = {
    'DEFAULT'  : { 'rtl': RTweetList('DEFAULT'), 'sel': '.list', 'state': {'rendered':{} } },
    'REPLIES'  : { 'rtl': RTweetList('REPLIES'), 'sel': '.list', 'state': {'rendered':{} } }
  }
  
  var z  = {
    'on_rtweetlist_update' : function (evt, rtweetlist) {
      var state    = rtlmap[rtweetlist.name()].state;
      var selector = rtlmap[rtweetlist.name()].sel;
      
      rtweetlist.each(function(i,rtweet){
        if (state.rendered[rtweet.tweet.id] == true) return
        else
          state.rendered[rtweet.tweet.id] = true
        
        var tweet_id = 't_' + rtweet.tweet.id;
        var clone    = jQuery("#t").clone().attr('id',tweet_id).prependTo(selector);
        jQuery("#" + tweet_id + " .userpic").attr('src', rtweet.user.profile_image_url);
        jQuery("#" + tweet_id + " .name"   ).html(rtweet.user.screen_name);
        jQuery("#" + tweet_id + " .tweet"  ).html(rtweet.tweet.text + '/'  + rtweet.tweet.created_at);
        
        clone.show();
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
