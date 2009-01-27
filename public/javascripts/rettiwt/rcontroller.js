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
          sticky:       false,
          icon:         rtweet.user.profile_image_url
        });
        
        // create the tweet, yo!
        var tweet_id = 't_' + rtweet.tweet.id;
        var tweet    = jQuery(".r-tweet-template")
          .clone()
          .attr('id',tweet_id)
          .removeClass('r-tweet-template')
          .addClass('r-tweet-new')
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
      
      
      window.console.log("RController#initalize: Adding Event Handlers");
      jQuery(".r-tweet").live('click', function(evt){
        $(".r-tweet-focus").removeClass('r-tweet-focus');
        $(evt.target).closest(".r-tweet")
          .removeClass('r-tweet-new').addClass('r-tweet-focus');
      });
      
      jQuery(document).keypress(function(evt) {
        var f = $(".r-tweet-focus");
        if (f.size() == 0) f = $(".r-tweet-new:visible:last,.r-tweet:visible:last");
        if (f.size() == 0) return;
        f = $(f[0]);
        
        if      (evt.which == 106 || evt.which == 63233) {
          evt.preventDefault();
          f.next('div').click();
        }
        else if (evt.which == 107 || evt.which == 63232) {
          evt.preventDefault();
          f.prev('div').click();
        }
        
        jQuery('.r-tweets-container').scrollTo($('.r-tweet-focus'));
      });
      
      window.console.log("RController#initalize: Done");
    }
  };
}();
