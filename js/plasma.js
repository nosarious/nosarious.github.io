/**
 * HTML5 Canvas Plasma (fillRect technique)
 * 
 * Kevin Roast 10/8/11
 *
 * modified for circles & offset
 * Gerry Straathof 11/16/16
 */

var RAD = Math.PI/90.0; //was180
var Sin = Math.sin;
var Cos = Math.cos;
var Sqrt = Math.sqrt;

var HEIGHT;
var WIDTH;
var g_plasma;
var g_canvas;
var g_framestart;

window.addEventListener('load', onloadHandler, false);
window.addEventListener('resize', resizeHandler, true);

/**
 * Global window onload handler
 */
function onloadHandler()
{
    // fullscreen the canvas element
    g_canvas = document.getElementById('canvas');
    WIDTH = g_canvas.width = window.innerWidth;
    HEIGHT = g_canvas.height = window.innerHeight;
    
    // create the Plasma object
    g_plasma = new Plasma();
    /*
    // create the GUI controls
    var gui = new DAT.GUI(); // height of 30px per control ish
    gui.domElement.style.opacity = "0.75";
    gui.add(g_plasma, "PaletteIndex").min(0).max(4).step(1);
    gui.add(g_plasma, "CycleSpeed").min(0).max(8).step(1);
    gui.add(g_plasma, "PlasmaDensity").min(16).max(256).step(16);
    gui.add(g_plasma, "PlasmaFunction").min(0).max(1).step(1);
    gui.add(g_plasma, "TimeFunction").min(64).max(640).step(64);
    gui.add(g_plasma, "Jitter").min(0).max(16).step(1);
    gui.add(g_plasma, "Alpha").min(0.1).max(1.0).step(0.1);
    gui.add(g_plasma, "ShowFPS");
    gui.close();
    
    // init the animation loop
    g_framestart = Date.now();
    */
    requestAnimFrame(loop);
}

/**
 * Global window resize handler
 */
function resizeHandler()
{
    if (g_canvas)
    {
        WIDTH = g_canvas.width = window.innerWidth;
        HEIGHT = g_canvas.height = window.innerHeight;
    }
}

/**
 * Main render loop
 */
function loop()
{
  //  if ($('#article1').has('.active')){
        var frameStart = Date.now();
        
        g_plasma.frame.call(g_plasma)
        
        if (g_plasma.ShowFPS)
        {
            var g = g_canvas.getContext('2d');
            g.save();
            g.globalAlpha = 1;
            g.fillStyle = "#000";
           // g.fillRect(0,26,72,16);
            g.font = "12pt Courier New";
            g.fillStyle = "#FFF";
            g.fillText("FPS: " + Math.round(1000 / (frameStart - g_framestart)), WIDTH/2-(72/2), 50);
            g_framestart = frameStart;
            g.restore();
        }
        
        requestAnimFrame(loop);
  //  }
}

(function()
 {
 Plasma = function()
 {
 // generate some palettes
 function rgb(r,g,b)
 {
 return "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
 }
 
 this.palettes = [];
 
 var palette = [];
 for (var i=0; i<256; i++)
 {
 palette.push(rgb(i,i,i));
 }
 this.palettes.push(palette);
 
 palette = [];
 for (var i=0; i<128; i++)
 {
 palette.push(rgb(i*2,i*2,i*2));
 }
 for (var i=0; i<128; i++)
 {
 palette.push(rgb(255-(i*2),255-(i*2),255-(i*2)));
 }
 this.palettes.push(palette);
 
 palette = new Array(256);
 for (var i = 0; i < 64; i++)
 {
 palette[i] = rgb(i << 2,255 - ((i << 2) + 1),64);
 palette[i+64] = rgb(255,(i << 2) + 1,128);
 palette[i+128] = rgb(255 - ((i << 2) + 1),255 - ((i << 2) + 1),192);
 palette[i+192] = rgb(0,(i << 2) + 1,255);
 }
 this.palettes.push(palette);
 
 palette = [];
 for (var i = 0,r,g,b; i < 256; i++)
 {
 r = ~~(128 + 128 * Sin(Math.PI * i / 32));
 g = ~~(128 + 128 * Sin(Math.PI * i / 64));
 b = ~~(128 + 128 * Sin(Math.PI * i / 128));
 palette.push(rgb(r,g,b));
 }
 this.palettes.push(palette);
 
 palette = [];
 for (var i = 0,r,g,b; i < 256; i++)
 {
 r = ~~(Sin(0.3 * i) * 64 + 190),
 g = ~~(Sin(0.3 * i + 2) * 64 + 190),
 b = ~~(Sin(0.3 * i + 4) * 64 + 190);
 palette.push(rgb(r,g,b));
 }
 this.palettes.push(palette);
 
 // init public properties for the GUI controls
 this.CycleSpeed = 1.0;
 this.ShowFPS = true;
 this.PlasmaDensity = 16;
 this.TimeFunction = 1000;
 this.PlasmaFunction = 1;
 this.Jitter = 0;
 this.Alpha = 1.0;
 this.PaletteIndex = 3;
 
 return this;
 };
 
 Plasma.prototype =
 {
 // public properties - exposed by GUI controls
 ShowFPS: false,
 CycleSpeed: 0,
 PlasmaDensity: 0,
 TimeFunction: 0,
 PlasmaFunction: 0,
 Jitter: 0,
 Alpha: 0.0,
 PaletteIndex: 0,

 
 // internal properties
 paletteoffset: 0,
 palettes: null,
 
 // animation frame rendering function
 frame: function frame()
 {
 // init context and img data buffer
 
 WIDTH = window.innerWidth;
 HEIGHT = window.innerHeight;
 var w = WIDTH, h = HEIGHT,                      // canvas width and height
 

 
 pw = this.PlasmaDensity, ph = (pw * (h/w)),    // plasma source width and height
 ctx = g_canvas.getContext('2d'),
 palette = this.palettes[this.PaletteIndex],
 paletteoffset = this.paletteoffset+=this.CycleSpeed,
 plasmafun = this.PlasmaFunction;
 // scale the plasma source to the canvas width/height
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

 if (!isMobile) this.PlasmaDensity = 32;
 var vpx = (w/pw), vpy = (h/ph);
 
 var dist = function dist(a, b, c, d)
 {
 return Sqrt((a - c) * (a - c) + (b - d) * (b - d));
 }
 
 var time = Date.now() / this.TimeFunction;
 
 var colour = function colour(x, y)
 {
 switch (plasmafun)
 {
 case 0:
 return ((Sin(dist(x + time, y, 128.0, 128.0) / 8.0)
          + Sin(dist(x - time, y, 64.0, 64.0) / 8.0)
          + Sin(dist(x, y + time / 7, 192.0, 64) / 7.0)
          + Sin(dist(x, y, 192.0, 100.0) / 8.0)) + 4) * 32;
 break;
 case 1:
 return (128 + (128 * Sin(x * 0.0625)) +
         128 + (128 * Sin(y * 0.03125)) +
         128 + (128 * Sin(dist(x + time, y - time, w, h) * 0.125)) +
         128 + (128 * Sin(Sqrt(x * x + y * y) * 0.125)) ) * 0.25;
 break;
 }
 }
 
 ctx.save();
 ctx.globalAlpha = this.Alpha;
 var jitter = this.Jitter ? (-this.Jitter + (Math.random()*this.Jitter*2)) : 0;
 var addThis  = 0;
 var extraRound = 1;



 for (var y=0,x; y<ph+6; y++)
 {
  if (y%2){ 
    addThis = vpx/2; 
    //extraRound = 0;
  } else {
    addThis = 0;
    //extraRound = 1;
  }
 for (x=0; x<pw+extraRound; x++)
 {
 // map plasma pixels to canvas pixels using the virtual pixel size
 ctx.fillStyle = palette[(~~colour(x, y) + paletteoffset) % 256];

 var hexHeight,
        hexUp,
        hexOver,
        hexagonAngle = 0.523598776; // 30 degrees in radians
         
     var xStart = x * vpx + jitter + addThis;
     var yStart = y * vpy/1.25 + jitter;
     var sideLength = vpy/1.75;
     hexOver = Math.sin(hexagonAngle) * sideLength;
     hexUp = Math.cos(hexagonAngle) * sideLength;

 

    ctx.beginPath();
        ctx.moveTo(xStart - hexUp, yStart - hexOver);
        ctx.lineTo(xStart  , yStart - sideLength);
        ctx.lineTo(xStart + hexUp, yStart - hexOver);
        ctx.lineTo(xStart + hexUp, yStart + hexOver);
        ctx.lineTo(xStart , yStart + sideLength);
        ctx.lineTo(xStart - hexUp, yStart + hexOver);
     ctx.closePath();
     /*
     ctx.beginPath();
        ctx.moveTo(xStart - sideLength, yStart);
        ctx.lineTo(xStart - sideLength + hexOver, yStart - hexUp);
        ctx.lineTo(xStart + sideLength - hexOver, yStart - hexUp);
        ctx.lineTo(xStart + sideLength, yStart );
        ctx.lineTo(xStart + sideLength - hexOver, yStart + hexUp);
        ctx.lineTo(xStart - sideLength + hexOver, yStart + hexUp);
     ctx.closePath();
     */
     ctx.fill();
     ctx.lineWidth=3;
     ctx.strokeStyle="#000000";
     ctx.stroke();
     ctx.lineWidth=1;
     ctx.strokeStyle="#ffffff";
     ctx.stroke();
 
 }
 }
 ctx.restore();
 }
 };
 })();

window.requestAnimFrame = (function()
                           {
                           return  window.requestAnimationFrame       || 
                           window.webkitRequestAnimationFrame || 
                           window.mozRequestAnimationFrame    || 
                           window.oRequestAnimationFrame      || 
                           window.msRequestAnimationFrame     || 
                           function(callback, element)
                           {
                           window.setTimeout(callback, 1000 / 60);
                           };
                           })();
