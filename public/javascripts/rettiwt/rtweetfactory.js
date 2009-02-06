var RTweetFactory = function(){
  // define the structure for an RTweet that can be expected
  var RTweet = function(){
    var rt                    = {};
    
    rt.state                  = {};
    rt.state.seen             = {};
    rt.state.rendered         = {};
    
    rt.user                   = {};
    rt.user.screen_name       = '';
    rt.user.url               = '';
    rt.user.profile_image_url = '';
    
    rt.tweet                  = {};
    rt.tweet.id               = '';
    rt.tweet.text             = '';
    rt.tweet.favorited        = '';
    
    return rt;
  };
  
  return {
    // RTweetFactory will ultimately provide two parse methods, one for JSON 
    // and another for SQL ResultSets such as we'll likely get from Gears.   
    'parse_json' : function (twitter_tweet_json) {
      var rt = RTweet();
      
      // any state we might want to keep about a tweet
      rt.state.seen             = false;
      rt.state.rendered         = false;
      
      // just the fields from tweet.user we care about
      rt.user.url               = twitter_tweet_json.user.url;
      rt.user.profile_image_url = twitter_tweet_json.user.profile_image_url;
      rt.user.screen_name       = twitter_tweet_json.user.screen_name;
      
      // just the fields from the tweet we care about 
      rt.tweet.id               = twitter_tweet_json.id;
      rt.tweet.text             = twitter_tweet_json.text;
      rt.tweet.favorited        = twitter_tweet_json.favorited;
      rt.tweet.created_at       = new Date(Date.parse(twitter_tweet_json.created_at));
      
      rt.tweet.in_reply_to_user_id   = parseInt(twitter_tweet_json.in_reply_to_user_id);
      rt.tweet.in_reply_to_status_id = parseInt(twitter_tweet_json.in_reply_to_status_id);
      
      // determin the tweet type: tweet types are applied as I check for more
      // and more specific identifiers in the order:  tweet, retweet, replyto
      // and finally direct.
      rt.type = 'tweet'
      
      // type: re-tweet
      if (rt.tweet.text.match(^(\s*?)RT))  rt.type = 'retweet'
      
      // type: reply-to
      if (rt.tweet.in_reply_to_user_id || 
          rt.tweet.in_reply_to_status_id ) rt.type = 'replyto'
      
      // type: direct
      // FIXME: i don't have an example of the json for a DM yet
      
      
      // get all eventy with the created RTweet
      jQuery(document).trigger('rettiwt.rtweet.create', [rt]);
      
      return rt;
    }
  };
}();