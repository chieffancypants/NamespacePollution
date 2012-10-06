(function() {

	var tabs = [];

	// free memory
	chrome.tabs.onRemoved.addListener(function(tabId) {
		delete tabs[tabId];
	});


	// Place the pageAction icon on each tab
	function showPageAction(tabId, changeInfo, tab) {
		chrome.pageAction.show(tabId);
	};
	chrome.tabs.onUpdated.addListener(showPageAction);


	chrome.extension.onMessage.addListener(function (message, sender, sendResp) {
		switch(message.name) {
			case 'pollution':
				console.log('Saving pollution:', message.pollution, sender)
				tabs[sender.tab.id] = message.pollution;
				break;
			case 'getPollution':
				console.log('sending response: ', tabs[message.tabId], message.tabId);
				sendResp({ pollution: tabs[message.tabId] });
				break;
		}
	});

})();