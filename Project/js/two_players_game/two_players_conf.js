// Get the canvas and context
var canvas = document.getElementById("canvas"); 
var context = canvas.getContext("2d");   

context.font = '68px Lasco-Boldr';

// Timing and frames per second
var lastframe = 0;
var fpstime = 0;
var framecount = 0;
var fps = 0;
var backgroundColor = "#fff"
var backgroundColorWall = "#000"
var firststartgame = true;
var initialized = false;

var appleCount = 0;
var gameStarted = false;
//only the first player is able to create array with snakes
var g_snakeCreated = false;

// Images
var images = [];
var tileimage;
var g_timerToStartAfterDeath = 4000;

// Image loading global variables
var loadcount = 0;
var loadtotal = 0;
var preloaded = false;



function drawWaitingScreen()
{
    context.fillStyle = backgroundColor;
    context.fillStyle = "#E8000C";
    context.font = "45px Lasco-Bold";  
    drawCenterText("waiting other player ... ", 0, 2*canvas.height/4, canvas.width); 
}