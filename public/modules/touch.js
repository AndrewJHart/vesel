var item = document.getElementById('range');
item.onchange = function () {
	value = (item.value - item.min)/(item.max - item.min)
	item.style.backgroundImage = [
	'-webkit-gradient(',
	'linear, ',
	'left top, ',
	'right top, ',
	'color-stop(' + value + ', #5cb85c), ',
	'color-stop(' + value + ', #b8b7b8)',
	')'
	].join('');
};




// $(document).on(function() {
// 	var myScroll;

// 	function loaded () {
// 		myScroll = new IScroll('#wrapper');
// 		console.log('iScroll readered afrer dom ready')
// 	}

// 	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
// });






window.addEventListener('load', function() {
    FastClick.attach(document.body);
    console.log('fastClick is firing!');
}, true);


