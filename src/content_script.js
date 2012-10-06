// alert('done loading...');
// knownObjects = [
// 	'top',
// 	'location',
// 	'window',
// 	'external',
// 	'chrome',
// 	'v8Locale',
// 	'document'
// ];

// pollution = Object.keys(window);
// console.log(pollution);

// chrome.extension.sendMessage({name: 'pollution', pollution: pollution}, function(response) {
// 	console.log(response.farewell);
// });


// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
// 	alert('hi');
// 	console.log (request);

// });

// document.addEventListener('load', function () {
// 	console.log('loaded');
// 	alert('loaded');
// });


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
	}

	meta.addEventListener('ready', function() {
		if (meta) {
			var pollution = JSON.parse(meta.content)
			if (Object.keys(pollution).length > 0) {
				chrome.extension.sendMessage({name: 'pollution', pollution: pollution});
			}
		}
	});


})();