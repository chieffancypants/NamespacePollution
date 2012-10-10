(function(){

	chrome.tabs.getSelected(null, function(tab) {
		chrome.extension.sendMessage({name: 'getPollution', tabId: tab.id}, function(response) {
			title = document.getElementsByClassName('title')[0].innerHTML = '<strong>' + response.pollution.length + ' objects </strong><small>polluting the global namespace:</small>';
			table = document.getElementById('pollution-body');

			// Alphabetize, son.
			response.pollution.sort(function(a,b) {
				var cmp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
				if (cmp > 0) {
					return 1;
				} else if (cmp < 0) {
					return -1;
				}
				return 0;
			});


			response.pollution.forEach(function(obj, idx) {
				tr = document.createElement('tr');
				tr.setAttribute('fulldata', obj.name);
				name = obj.name;
				if (name.length > 30) {
					name = name.substr(0,30) + ' ...';
				}
				tr.innerHTML = '<td>' + (idx+1) + '</td><td>' + name + '</td><td>' + obj.type + '</td>';
				table.appendChild(tr);
			});
		});
	});

	document.onclick = function(event) {
		var el = event.target;
		if (el.nodeName = 'TD') {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendMessage(tab.id, {name:'console', obj: el.parentNode.getAttribute('fulldata')} );
			});
			el.parentNode.className = 'consoled';
		}
	};


})();