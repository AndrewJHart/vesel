

Zepto(document).ready(function() {
	var listScroll;

	function loaded () {
		listScroll = new IScroll('#wrapper', {
			bounceEasing: 'elastic', bounceTime: 1200
		});
	}

	document.addEventListener('touchmove', function (e) {
		e.preventDefault();
	}, false);

	console.log('iScroll render after document ready');
  });




window.addEventListener('load', function() {
    FastClick.attach(document.body);
    console.log('fastClick is firing!');
}, true);