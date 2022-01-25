function createIndexedDB() {
	let db;

	const request = indexedDB.open("budget-tracker", 1);

	request.onupgradeneeded = (e) => {
		const db = e.target.result;
		db.createObjectStore("transaction", { autoIncrement: true });
	};

	request.onsuccess = (e) => {
		const db = e.target.result;

		//checks if online and uploads
		if (navigator.onLine) {
			uploadTransaction();
		}
	};

	request.onerror = (e) => {
		console.log(e.target.errorCode);
	};

	function uploadTransaction() {
		const transaction = db.transaction(["transaction"], "readwrite");
		const transactionObjectStore = transaction.objectStore("transaction");
		const getAll = transactionObjectStore.getAll();

		getAll.onsuccess = function () {
			if (getAll.result.length > 0) {
				fetch("/api/transaction/bulk", {
					method: "POST",
					body: JSON.stringify(getAll.result),
					headers: {
						Accept: "application/json, text/plain, */*",
						"Content-Type": "application/json",
					},
				})
					.then((response) => response.json())
					.then((serverResponse) => {
						if (serverResponse.message) {
							throw new Error(serverResponse);
						}
						const transaction = db.transaction(["transaction"], "readwrite");
						const transactionObjectStore = transaction.objectStore("transaction");
						transactionObjectStore.clear();

						alert("All saved transactions have been submitted!");
					})
					.catch((err) => {
						console.log(err);
					});
			}
		};
	}

	window.addEventListener("online", uploadTransaction);
}

createIndexedDB();
