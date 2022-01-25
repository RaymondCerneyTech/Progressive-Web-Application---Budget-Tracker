function createIndexedDB() {
	const request = indexedDB.open("budget-tracker", 1);

	request.onupgradeneeded = e => {

	};

	request.onsuccess = e => { };

	request.onerror = e => { };
}