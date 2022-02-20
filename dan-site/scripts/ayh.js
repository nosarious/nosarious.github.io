var splash = true;
var busy = false;
var requireMapLoad = true;
var map;
function FirstLoad() 
{
  splash = true;
  busy = true;
  $('#access').fadeIn(2000,
    function () { SlideDownAccess(); });
  // LoadScript();
}
function Initialize() 
{
  var myLatlng = new google.maps.LatLng(51.04613, -114.07817);
  var myOptions = {
    zoom: 16,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: "Access Your Health - 734 - 8th Avenue S.W."
  });
}
function LoadScript() 
{
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=Initialize";
  document.body.appendChild(script);
}
function SlideDownAccess() 
{
  $('#access').animate({ top: 200 }, 2000,
    function () { ShowTextBubble(); });
}
function ShowTextBubble() 
{
  busy = false;
}
// Need the following for ValidAccess
var comingSoon = false;
function ValidAccess() {
  if (comingSoon)
    return ValidateAccess();
  return true;
}
function ValidateAccess() {
  if ($.cookie("access_login") == 'Access')
    return true;
  var m = QueryStringValue("m");
  var minutes = new Date();
  minutes = minutes / 60000;
  var mNow = m * 1;
  if (mNow > minutes - 10 && mNow < minutes + 30) 
  {
    $.cookie('access_login', 'Access');
    return true;
  }
  return false;
}
var rolledOutId = '';
var rollBack = true;
var currentId = '';
function Clicked(what) {
  if (busy)
    return;
  busy = true;
  if (splash) 
  {
    $('#access').fadeOut(2000);
    $('#access').animate({ top: -200 }, 10);
    splash = false;
  }
  var id = "#" + what.id + "Panel";
  if (currentId != '') 
  {
    $(currentId).fadeOut(1000,
      function () { ClickDisplay(id); });
    return;
  }
  ClickDisplay(id);
}
function ClickDisplay(id) 
{
  if (requireMapLoad && id.indexOf('location') >= 0) {
    LoadScript();
    requireMapLoad = false;
  }
  if (id.indexOf('schedule') >= 0)
    ClearForm();
  $(id).fadeIn(2000)
  currentId = id;
  busy = false;
}
function ClearForm()
{
  $('.inputText').val('');
  $('.inputTextArea').val('');
  $('#emailRtn').html('');
  $('#emailRtn').hide();
}
function Rollout(theId) 
{
  if (rolledOutId != theId) 
  {
    rolledOutId = theId;
    $(theId).show("slide", { direction: "left" }, 600);
  }
}
function Rollback(theId) 
{
  if (rolledOutId == theId) 
  {
    rollBack = true;
    setTimeout('SlideBack()', 600);
  }
}
function SlideBack() {
  if (rollBack) 
  {
    $(rolledOutId).hide("slide", { direction: "left" }, 600);
    rolledOutId = "";
  }  
}
function StillOver(theId) 
{
  if (theId == rolledOutId)
    rollBack = false;
}
function Email() 
{
  var my_email = "gerry@entiro.com";
  var subject = "Appointment Request";
  var contactName = $('#contactName').val();
  var phone = $('#phone').val();
  var mobile = $('#mobile').val();
  var reason = $('#reason').val();
  var email_version = "formemail.bml v1.01";
  var rtnVal = '';
  var request = "http://www2.netfirms.com/scripts/formemail.bml";
  $.get(request, { my_email: my_email, subject: subject, name: contactName, phone: phone, mobile: mobile, reason: reason, email_version: email_version },
   function (data) {
     $('#emailRtn').show();
     $('#emailRtn').html(data);
     rtnVal = data;
   });
   if (rtnVal.length < 1) {
     $('#emailRtn').html("Appointment request submitted, thank-you!");
     $('#emailRtn').show();
   }
 }
function QueryStringValue(name) 
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
// Need the preceeding for ValidAccess
function Home() 
{
  location.href = 'index.html';
}
function PageWidth() 
{
  var width = 0;
  if (typeof (window.innerWidth) == 'number')
    width = window.innerWidth;
  else if (document.documentElement && document.documentElement.clientWidth)
    width = document.documentElement.clientWidth;
  else if (document.body && document.body.clientWidth)
    width = document.body.clientWidth;
  return width;
}
function PageHeight() {
  var height = 0;
  if (typeof (window.innerHeight) == 'number')
    height = window.innerHeight;
  else if (document.documentElement && document.documentElement.clientHeight)
    height = document.documentElement.clientHeight;
  else if (document.body && document.body.clientHeight)
    height = document.body.clientHeight;
  return height;
} 