/***********************************
 * 
 *  site mechanics built for Daniel Doyle's website
 *  by Gerry Straathof
 * 
 * March 6, 2022
 * 
 */


var busy = false;


var rolledOutId = '';
var rollBack = true;
var currentId = '';

/****************
 * 
 * update elements on page resize
 * 
 * 
 * */


$( window ).on( "load", checkSizes() );

$(document).ready(function() {
  console.log( "document loaded" );
  checkSizes();
 });
$( window ).on( "orientationchange", function( event ) {
  checkSizes();
});

$(window).resize(function() {
  console.log( "window resized" );
  checkSizes();
});


/*******************
 * 
 *   if div is visible, remove  and open the next div
 * 
 * *****************/
  
function Clicked(what) {
  if (busy)
    return;
  busy = true;
  
  var id = "#" + what.id + "Panel";

  if (currentId != '') 
  {
    $(currentId).fadeOut(500,
      function () { ClickDisplay(id); });
    return;
  }
  ClickDisplay(id);

}



/*******************
 * 
 *   display a new div
 * 
 * *****************/

function ClickDisplay(id) 
{
  $(id).fadeIn(2000)
  currentId = id;
  busy = false;
}


/* 
*   
*   find width and height and resize cards
*   and update where they are placed on the screen
*   
*/

function checkSizes() 
{
  var cwidth = $(window).width()
  var cheight= $(window).height()

  if (cwidth < 800){ /* outerdiv too wide for screen */
    var outerPadding = (cwidth-400)/2;
    $('.panel').removeClass('widePanel').addClass('narrowPanel');
    $('.panel').css({'left':0+'px','margin-right':outerPadding+'px'}); 
    $('#innerdiv').css({'left':outerPadding+'px','margin-right':outerPadding+'px', 'top':25+'px'}); 
    $('#main-title').addClass('main-title-narrow').removeClass('main-title-wide'); 
    $('#outerdiv').addClass('narrowPage').removeClass('widePage');
    $('#footer-contact').css({'width':'auto'});
    $('#callout-text').addClass('calloutNarrow').removeClass('calloutWide');

  } else {            /* outerdiv fits on screen */
    $('.panel').addClass('widePanel').removeClass('narrowPanel');
    $('.panel').css({'left':410+'px','margin-right':'auto'}); 
    $('#innerdiv').css({'left':-430+'px','margin-right':'auto', 'top':105+'px'}); 
    $('#main-title').addClass('main-title-wide').removeClass('main-title-narrow'); 
    $('#outerdiv').addClass('widePage').removeClass('narrowPage');
    $('#footer-contact').css({'width':'810px'});
    $('#callout-text').addClass('calloutWide').removeClass('calloutNarrow');
  }
}
