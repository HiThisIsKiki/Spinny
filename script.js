var colours = ['#B20000','#B27400','#17B200','#D3C41F','#52B4D8','#4947B2','purple','#CE6388'];
var hicolours = ['#FF0000','#FFA500','#21FF00','#FFFA00','#BFFFFB','#6696FF','#ce41ce','#FF77A7'];

function init()
{
	var spinny = document.getElementById('spinny')
	//Fill in the css of the quadrants
	for (var i=0;i<8;i++)
	{

		var deg = (i*45)+22.5;		
		var str = 'translate(-50%,-100%) rotate('+deg+'deg)';
		$('.quad'+(i+1)).css({
			'transform':str,			
			'border-top-color':colours[i]
		});
	}
	setInterval(flash,500)
	$(document).keydown(function(e){		
		if (e.which == 32) //Space
		{
			e.preventDefault();
			if (tickerSpinning)
			{
				hit();
			}
			else
			{
				spinTicker();
			}			
		}
	})
}
flashing = 'none';
function flash()
{
	if (flashing != 'none')
	{
		var index = colours.indexOf(flashing);
		var elem = $('.quad'+(index+1));
		elem.css('border-top-color',hicolours[index])		
	}
	setTimeout(unflash,300,flashing)
}
function randomFlash()
{
	var flashingNum = colours.indexOf(flashing);
	//Don't choose the same as the current flashing one, or one directly next to it.
	do
	{
		var rand = Math.floor(Math.random()*colours.length);
		var choice = colours[rand];			
	}
	while (choice == flashing || rand == flashingNum - 1 || rand == flashingNum +1);	
	flashing = choice;
}
function unflash(color)
{
	if (flashing != 'none')
	{
		var index = colours.indexOf(color);
		var elem = $('.quad'+(index+1));
		elem.css('border-top-color',color)	
	}
}
var score = 0;
var tickerDirection = 1;
var tickerDegrees = 0;
var tickerDelay = 1;
var tickerSpinning = false;
var tickerStart = 0.08;
var tickerSpeed = tickerStart;;
function speedUp()
{
	//Diminishing returns of speed
	inc = (1/(score+1)) * 0.04;
	tickerSpeed += inc;
}
function spinTicker(){
	prevTime = undefined;
	score = 0;
	tickerSpinning = true;
	$('#ticker').removeClass('fail')
	randomFlash();
	moveTicker();
	updateCount();
}
var prevTime;
function moveTicker()
{	var time = new Date().getTime();
	if (prevTime)
	{		
		var delta = time - prevTime;
		prevTime = time;
		tickerDegrees += tickerSpeed * tickerDirection * delta;
		if (tickerDegrees >= 360)
		{
			tickerDegrees = 0;
		}
		else if (tickerDegrees <= 0)
		{
			tickerDegrees = 360;
		}
		tickerTo(tickerDegrees);
		if(tickerSpinning)
		{
			requestAnimationFrame(moveTicker)
		}	
	}
	else
	{
		prevTime = time;
		requestAnimationFrame(moveTicker)
	}		
}
function tickerTo(deg)
{
	var ticker = $('#ticker')
	var str = 'translate(-50%,-100%) rotate('+deg+'deg)';
	ticker.css('transform',str);
}
function midFlash(color)
{
	$("#middle").stop();
	$('#middle').css('background',color)
	var spinTime = (360 / tickerSpeed); //Number of milliseconds it will take to complete a revolution.	
	$("#middle").animate({'backgroundColor':'#000'},spinTime)
}
function hit()
{
	var deg = tickerDegrees;
	var sector =Math.floor(deg/45);
	if (colours[sector] == flashing)
	{
		tickerDirection = tickerDirection == 1? -1:1;		
		hi = hicolours[colours.indexOf(flashing)];
		midFlash(hi);
		randomFlash();
		speedUp();
		score++;
		updateCount();
	}
	else
	{
		stop();
	}
}
function stop()
{
	tickerSpinning = false;
	$('#ticker').addClass('fail')
	tickerSpeed = tickerStart;
	unflash(flashing)
	flashing="none";	
	updateCount();
}
function updateCount(){	
	$('#middle').html(score)
}