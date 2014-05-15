

// Zepto(document).on(function() {
// 	var listScroll;

// 	function loaded () {
// 		listScroll = new IScroll('#wrapper', {
// 			bounceEasing: 'elastic', bounceTime: 1200
// 		});
// 	}

// 	document.addEventListener('touchmove', function (e) {
// 		e.preventDefault();
// 	}, true);

// 	console.log('iScroll render after document ready');
//   });




$(document).on(function() {
	var myScroll;

	function loaded () {
		myScroll = new IScroll('#wrapper');
		console.log('iScroll readered afrer dom ready')
	}

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
});






window.addEventListener('load', function() {
    FastClick.attach(document.body);
    console.log('fastClick is firing!');
}, true);


