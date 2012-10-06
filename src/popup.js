(function(){

	chrome.tabs.getSelected(null, function(tab) {
		chrome.extension.sendMessage({name: 'getPollution', tabId: tab.id}, function(response) {
			console.log(response);
			console.log(drawFavicon(3));
			chrome.pageAction.setIcon({path: drawFavicon(60), tabId: tab.id});
		});
	});


	var Piecon = {};

	var currentFavicon = null;
	var originalFavicon = null;
	var originalTitle = null;
	var canvas = null;
	var options = {};
	var defaults = {
		color: '#ff0084',
		background: '#bbb',
		shadow: '#eee',
		fallback: false
	};

	var setFaviconTag = function(url) {
		// removeFaviconTag();

		// var link = document.createElement('link');
		// link.type = 'image/x-icon';
		// link.rel = 'icon';
		// link.href = url;

		// document.getElementsByTagName('head')[0].appendChild(link);
		// chrome.pageAction.setIcon({imageData: })
		console.log(url);
	};

	var getCanvas = function () {
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.width = 16;
            canvas.height = 16;
            console.log(canvas);
            document.body.appendChild(canvas);
        }

        return canvas;
    };

    var drawFavicon = function(percentage) {
        var canvas = getCanvas();
        var context = canvas.getContext("2d");
        var percentage = percentage || 0;
        var src = currentFavicon;

        var faviconImage = new Image();
        if (context) {
            context.clearRect(0, 0, 16, 16);

            // Draw shadow
            context.beginPath();
            context.moveTo(canvas.width / 2, canvas.height / 2);
            context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2), 0, Math.PI * 2, false);
            context.fillStyle = defaults.shadow;
            context.fill();

            // Draw background
            context.beginPath();
            context.moveTo(canvas.width / 2, canvas.height / 2);
            context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2) - 2, 0, Math.PI * 2, false);
            context.fillStyle = defaults.background;
            context.fill();

            // Draw pie
            if (percentage > 0) {
                context.beginPath();
                context.moveTo(canvas.width / 2, canvas.height / 2);
                context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2) - 2, (-0.5) * Math.PI, (-0.5 + 2 * percentage / 100) * Math.PI, false);
                context.lineTo(canvas.width / 2, canvas.height / 2);
                context.fillStyle = defaults.color;
                context.fill();
            }

            return canvas.toDataURL();
        }

        // allow cross origin resource requests if the image is not a data:uri
        // as detailed here: https://github.com/mrdoob/three.js/issues/1305
        // if (!src.match(/^data/)) {
        //     faviconImage.crossOrigin = 'anonymous';
        // }

        // faviconImage.src = src;
    };


})();