(function() {
	var knownObjects = [
		'top',
		'location',
		'window',
		'external',
		'chrome',
		'v8Locale',
		'document'
	];

	var pollution = [],
		allKeys = Object.keys(window);

	allKeys.forEach(function(obj, idx) {
		if (knownObjects.indexOf(obj) == -1) {
			console.log ('in here', obj);
			pollution.push(obj);
		}
	});

	console.log(pollution);

	var jsonString = JSON.stringify(pollution);
	var meta = document.getElementById('ns-pollution');
	meta.content = jsonString;

	//Notify Background Page
	var done = document.createEvent('Event');
	done.initEvent('ready', true, true);
	meta.dispatchEvent(done);
})();