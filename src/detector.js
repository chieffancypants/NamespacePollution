(function() {
	var knownObjects = [
		'top',
		'location',
		'window',
		'external',
		'chrome',
		'v8Locale',
		'v8Intl',
		'document',
		'Intl'
	];

	var pollution = [],
		allKeys = Object.keys(window);

	allKeys.forEach(function(obj, idx) {
		if (knownObjects.indexOf(obj) == -1) {
			pollution.push({name: obj, type: typeof window[obj]});
		}
	});

	var jsonString = JSON.stringify(pollution);
	var meta = document.getElementById('ns-pollution');
	meta.content = jsonString;

	//Notify Background Page
	var done = document.createEvent('Event');
	done.initEvent('ready', true, true);
	meta.dispatchEvent(done);

	window.addEventListener("message", function(event) {
		// We only accept messages from ourselves
		if (event.source != window || event.data.name != 'console')
		  return;

		console.log(event.data.obj + ':', window[event.data.obj]);
	}, false);

})();