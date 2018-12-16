var colours = ['red','#f3b74a','#28d228','#ffff50','#31dede','blue','purple','pink'];
var hicolours = ['#ff3939','orange','lime','yellow','cyan','#5a5aff','#ce41ce','#ff8fa2'];
/*Red, orange, yellow, Green, Cyan, Blue, Purple, Pink*/
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

	//Don't choose the same as the current flashing one.
	do
	{
		var rand = Math.floor(Math.random()*colours.length);
		var choice = colours[rand];			
	}
	while (choice == flashing);
	console.log(flashing + " => "+choice)
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
var tickerDirection = 1;
var tickerDegrees = 0;
var tickerSpinning = false;
var tickerDelay = 0;
var tickerMoves = 0.5;
function speedUp()
{
	tickerMoves += 0.1;
}
function spinTicker(){
	tickerSpinning = true;
	$('#ticker').removeClass('fail')
	randomFlash();
	moveTicker(tickerDelay);
	updateCount();
}
function moveTicker(delay)
{	
	tickerDegrees += tickerMoves * tickerDirection;
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
		setTimeout(moveTicker,delay,delay)	
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
	$('#middle').css('background',color)
	setTimeout(function(){
		$('#middle').css('background','black')
	},200)
}
function hit()
{
	var deg = tickerDegrees;
	var sector =Math.floor(deg/45);
	if (colours[sector] == flashing)
	{
		tickerDirection = tickerDirection == 1? -1:1;		
		midFlash(flashing);
		randomFlash();
		speedUp();
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
	tickerMoves = 0.5;
	flashing="none";
	updateCount();
}
function updateCount(){
	var score = Math.round((tickerMoves-0.5)*10);
	$('#middle').html(score)
}