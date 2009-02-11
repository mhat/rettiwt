var RGrowler = function() {
  
  var rtlmap   = {
    'DEFAULT'  : { 'rtl': RTweetList('DEFAULT'), 'sel': '.r-tweets-container', 'state': {'rendered':{} } },
  }
  
  var z  = {
    'on_rtweetlist_update' : function (evt, rtweetlist) {
      var state = rtlmap[rtweetlist.name()].state;
      
      rtweetlist.each(function(i,rtweet){
        // do not re-growl 
        if (state.rendered[rtweet.tweet.id] == true) return
        else
          state.rendered[rtweet.tweet.id] = true
        
        window.fluid.showGrowlNotification({
          name:         "Tweet Arrived",
          title:        rtweet.user.screen_name,
          description:  rtweet.tweet.text,
          priority:     0, 
          sticky:       false,
          icon:         rtweet.user.profile_image_url
        });
      });
    }
  };
  
  return {
    'initialize': function () { 
      
      window.console.log("RController#initalize: Creating Routes");
      // create a default routes
      RTweetRouter
        .append("DEFAULT", rtlmap['DEFAULT'].rtl, function(rtweet) {
          return rtweet
        })
        
      jQuery(document).bind('rettiwt.rtweetlist.add', z.on_rtweetlist_update);
    }
  };
}();
