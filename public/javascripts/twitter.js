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



function populate_events() {
  jQuery(".item").live('click', function() {
    $('.selected').removeClass('selected').addClass('seen');
    
    $(this).addClass('selected');
  });
}



  
