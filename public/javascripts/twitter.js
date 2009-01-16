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
** o Come up with a data-structure for storing Twitter state
** 
** o Decide how to handle various Twitter errors
**
*/

window.console.log("Loading twitter.js");

var client        = {};
client.unseen     = [];
client.seen       = [];

function populate_events() {
  jQuery(".item").live('click', function() {
    $('.selected').removeClass('selected')
    $(this).addClass('selected');
  });
}

function populate_tweets() {
  window.console.log("populating " + client.unseen.length + " tweets")
  jQuery.each(client.unseen, function(idx,tweet) {
    window.console.log("populating tweet ..." + tweet['id']);
    
    var tweet_id = 't_' + parseInt(tweet['id']);
    var clone    = jQuery("#t").clone()
    clone.attr('id',tweet_id).appendTo('.list');
    
    // add userpic
    jQuery("#" + tweet_id + " .userpic").attr('src', tweet['user']['profile_image_url']);
    
    // add username
    jQuery("#" + tweet_id + " .name"   ).html(tweet['user']['screen_name']);
    
    // add tweet text
    jQuery("#" + tweet_id + " .tweet"  ).html(tweet['text']);
    
    clone.show();
  });
}


