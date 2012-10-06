
(function(){
	var head = document.getElementsByTagName('head')[0];

	if (head) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = chrome.extension.getURL('src/detector.js');
		head.appendChild(script);

		var meta = document.createElement('meta');
		meta.name = 'ns-pollution';
		meta.id = 'ns-pollution';
		head.appendChild(meta);

		var metaConsole = document.createElement('meta');
		metaConsole.name = 'ns-pollution-console';
		metaConsole.id = 'ns-pollution-console';
		head.appendChild(metaConsole);
	}

	meta.addEventListener('ready', function() {
		if (meta) {
			var pollution = JSON.parse(meta.content)
			if (Object.keys(pollution).length > 0) {
				chrome.extension.sendMessage({name: 'pollution', pollution: pollution});
			}
		}
	});




	chrome.extension.onMessage.addListener(function (message, sender, sendResp) {
		if (message.name == 'console') {
			window.postMessage(message, "*");
		}
	});

})();