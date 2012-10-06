(function() {

	var tabs = [];

	// free memory
	chrome.tabs.onRemoved.addListener(function(tabId) {
		delete tabs[tabId];
	});

	// Respond to messages
	chrome.extension.onMessage.addListener(function (message, sender, sendResp) {
		switch(message.name) {
			case 'pollution':
				console.log('Saving pollution:', message.pollution, sender)
				tabs[sender.tab.id] = message.pollution;
				chrome.pageAction.setIcon({path: drawFavicon(message.pollution.length), tabId: sender.tab.id});
				break;
			case 'getPollution':
				console.log('sending response: ', tabs[message.tabId], message.tabId);
				sendResp({ pollution: tabs[message.tabId] });
				break;
			case 'console':
				console.log(message);
				break;
		}
	});

	
	// Place the pageAction icon on each tab
	function showPageAction(tabId, changeInfo, tab) {
		chrome.pageAction.show(tabId);
	};
	chrome.tabs.onUpdated.addListener(showPageAction);


	var Piecon = {};

	var canvas = null;
	var defaults = {
		color: '#ff0084',
		background: '#bbb',
		shadow: '#eee',
		fallback: false
	};


	var getCanvas = function () {
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.width = 16;
            canvas.height = 16;
        }
        return canvas;
    };

    var drawFavicon = function(percentage) {
        var canvas = getCanvas();
        var context = canvas.getContext("2d");
        var percentage = percentage || 0;

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
    };

})();