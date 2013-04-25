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
				tabs[sender.tab.id] = message.pollution;
				chrome.pageAction.setIcon({path: drawFavicon(message.pollution.length), tabId: sender.tab.id});
				chrome.pageAction.show(sender.tab.id);
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


	var canvas = null;
	var defaults = {
		color: '#ff0084',
		background: '#bbb',
		shadow: '#ddd',
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

			defaults.color = convertToColor(percentage / 100);

			// Draw bar
			var width = (percentage * canvas.width) / 100;
			context.fillStyle = '#999';
			context.fillRect(0, 12, 16, 4);
			context.fillStyle = defaults.color;
			context.fillRect(1, 13, width, 2);

			// Draw Text
			context.font = 'bold 10px arial';
			context.textAlign = "center";
			context.textBaseline = "top";
			context.fillStyle = defaults.color
			context.maxWidth = 12;
			// Put a shadow on the number if it's a light color
			if (percentage < 63) {
				context.shadowColor = '#666';
				context.shadowOffsetX = 1;
				context.shadowOffsetY = 1;
				context.shadowBlur = 0;
				context.strokeStyle = 'black';
				context.strokeText(percentage, canvas.width / 2, 0, canvas.width);
			}
			context.fillText(percentage, canvas.width / 2, 0, canvas.width);

			return canvas.toDataURL();
		}
	};


	var convertToColor = function(pct) {
		if (pct > 1) {
			pct = 1;
		}
		// Fade between green, yellow, and red for the text
		var percentColors = [
			{ pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
			{ pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
			{ pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } } ];

		for (var i = 0; i < percentColors.length; i++) {
			if (pct <= percentColors[i].pct) {
				var lower = percentColors[i - 1];
				var upper = percentColors[i];
				var range = upper.pct - lower.pct;
				var rangePct = (pct - lower.pct) / range;
				var pctLower = 1 - rangePct;
				var pctUpper = rangePct;
				var color = {
					r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
					g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
					b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
				};
				return '#' + padHex(color.r.toString(16)) + padHex(color.g.toString(16)) + padHex(color.b.toString(16));
			}
		}
	}

	var padHex = function(hex) {
		if (hex.length <= 1) {
			hex = '0' + hex;
		}
		return hex;
	}

})();