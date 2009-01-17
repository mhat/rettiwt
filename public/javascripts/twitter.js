/*
** TODO
** x Explore how to do Basic-Auth with XHR. -- Turns out this was pretty easy to do, but then I
**   realized since we're running within Fluid/Safari we're better off NOT implementing our own
**   Basic-Auth and storing Credentials when Fluid/Safari will happily do it on a Session basis
**   or through Keychain. Either way it's better to let them deal.
**
** o Explore Google-Gears, as a note in the future Webkit will have it's own take on Goog-Gears
**   so we'll probably switch to that then. 
**
** o Look at the Twitter API JSON Feeds
** 
** o Come up with a data-structure for storing Twitter state -- For our first pass let's just
**   think about Tweets we've seen and Tweet's we haven't seen yet. A solution would be to
**   have two queues, one of what we've seen and one of what we haven't. That seems a little
**   bit heavy handed. Instead why not simply add a seen flag to the twitter data ...
** 
** 
** o Decide how to handle various Twitter errors
**
*/

window.console.log("Loading twitter.js");

var client        = {};
client.unseen     = [];
client.seen       = [];

client.list       = function() {
  var max_tweet_count = 200;
  var tweets          = [];
  var tweet_table     = {};
  
  var parser          = function (twitter_tweet) {
    var tweet   = {};
    tweet.state = {};
    tweet.user  = {};
    tweet.tweet = {};
    
    // any state we might want to keep about a tweet
    tweet.state.seen             = false;
    tweet.state.rendered         = false;
    
    // just the fields from tweet.user we care about
    tweet.user.url               = twitter_tweet.user.url;
    tweet.user.profile_image_url = twitter_tweet.user.profile_image_url;
    tweet.user.screen_name       = twitter_tweet.user.screen_name;
    
    // just the fields from the tweet we care about 
    tweet.tweet.id               = twitter_tweet.id;
    tweet.tweet.text             = twitter_tweet.text;
    tweet.tweet.favorited        = twitter_tweet.favorited;
    tweet.tweet.created_at       = new Date(Date.parse(twitter_tweet.created_at));
    
    return tweet;
  };
  
  return {
    size:   function ()   { return tweets.length },
    each:   function (fn) {
      for (i=0; i<tweets.length; i++) { fn(i, tweets[i]); }
      return true;
    },
    
    append: function (twitter_tweets) {
      window.console.log(
        "client.list.append: appending " + twitter_tweets.length + " tweets to " + tweets.length + ".");
      
      jQuery.each(twitter_tweets, function(i,twitter_tweet) {
        tweet = parser(twitter_tweet);
        
        if (tweet_table[tweet.tweet.id] == true) {
          window.console.log("client.list.append: skipping seen tweet " + tweet.tweet.id);
        }
        else {
          window.console.log("client.list.append: memoizing " + tweet.tweet.id)
          tweets.unshift(tweet);
          tweet_table[tweet.tweet.id] = true;
        }
      });
      
      // ensure that we're not memorizing more than 200 tweets
      client.list.remove();
      
      // this feels a little leaky 
      jQuery('.list').trigger('update');
    },
    
    remove: function () {
      if (tweets.length >= max_tweet_count)
        jQuery.each(tweets.splice(max_tweet_count, tweets.length - max_tweet_count, function(i,tweet) {
          delete tweet_table[tweet.tweet.id];
        }));
        
      return client.list.size();
    }
  }
}();



function populate_events() {
  jQuery(".item").live('click', function() {
    $('.selected').removeClass('selected').addClass('seen');
    
    $(this).addClass('selected');
  });
}

jQuery(document).bind('update', function() {
  window.console.log("event handler update on document: " + client.list + ", " + client.list.length);
  client.list.each(function(i,tweet){
    if (tweet.state.rendered == false) {
      tweet.state.rendered = true;
      var tweet_id = 't_' + parseInt(tweet.tweet.id);
      var clone    = jQuery("#t").clone()
      clone.attr('id',tweet_id).prependTo('.list');
      
      // add userpic
      jQuery("#" + tweet_id + " .userpic").attr('src', tweet.user.profile_image_url);
      
      // add username
      jQuery("#" + tweet_id + " .name"   ).html(tweet.user.screen_name);
      
      // add tweet text
      jQuery("#" + tweet_id + " .tweet"  ).html(tweet.tweet.text + '/'  + tweet.tweet.created_at);
      
      clone.show();
    }
  });
});


