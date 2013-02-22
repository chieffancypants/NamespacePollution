(function(){

	var populateTable = function (filter) {
		title = document.getElementsByClassName('title')[0].innerHTML = '<strong>' + pollution.length + ' objects </strong><small>polluting the global namespace:</small>';
		table = document.getElementById('pollution-body');
		filter = filter && filter.toLowerCase();

		// Remove the contents of the table:
		table.innerHTML = '';

		pollution.forEach(function (obj, idx) {
			if (!filter || obj.name.toLowerCase().indexOf(filter) > -1) {
				tr = document.createElement('tr');
				tr.setAttribute('fulldata', obj.name);
				name = obj.name;
				if (name.length > 30) {
					name = name.substr(0,30) + ' ...';
				}
				tr.innerHTML = '<td>' + (idx+1) + '</td><td>' + name + '</td><td>' + obj.type + '</td>';
				table.appendChild(tr);
			}
		});

	}

	chrome.tabs.getSelected(null, function (tab) {
		chrome.extension.sendMessage({name: 'getPollution', tabId: tab.id}, function(response) {
			// Attache the pollution list to window:
			pollution = response.pollution;

			// Alphabetize, son.
			pollution.sort(function (a,b) {
				var cmp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
				if (cmp > 0) {
					return 1;
				} else if (cmp < 0) {
					return -1;
				}
				return 0;
			});
			
			populateTable();
			
		});
	});

	document.onclick = function (event) {
		var el = event.target;
		if (el.nodeName = 'TD') {
			var elWithName = el.parentNode.children[1];
			var originalText = elWithName.innerHTML;
			elWithName.innerHTML += '<div class="click-text">Logged to console window!</div>'
			elWithName.children[0].className += ' hidden';

			setTimeout(function() {
				elWithName.innerHTML = originalText;
			}, 5000);

			chrome.tabs.getSelected(null, function (tab) {
				chrome.tabs.sendMessage(tab.id, {name:'console', obj: el.parentNode.getAttribute('fulldata')} );
			});
			el.parentNode.className = 'consoled';
		}
	};

	document.getElementById('filter-input').onkeyup = function (event) {
		populateTable(this.value);
	}

})();