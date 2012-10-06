(function(){

	chrome.tabs.getSelected(null, function(tab) {
		chrome.extension.sendMessage({name: 'getPollution', tabId: tab.id}, function(response) {
			title = document.getElementsByClassName('title')[0].innerHTML = '<strong>' + response.pollution.length + ' objects </strong><small>polluting the global namespace:</small>';
			table = document.getElementById('pollution-body');
			response.pollution.forEach(function(obj, idx) {
				tr = document.createElement('tr');
				tr.innerHTML = '<td>' + (idx+1) + '</td><td>' + obj.name + '</td><td>' + obj.type + '</td>';
				table.appendChild(tr);
			});
		});
	});

	document.onclick = function(event) {
		var el = event.target;
		if (el.nodeName = 'TD') {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendMessage(tab.id, {name:'console', obj: el.innerText});
			});
			// chrome.extension.sendMessage({name: 'console', object: el.innerText});
			console.log(el.innerText);
		}
	};


})();