console.log("HI, I am come from PUBLIC");

(() => {

	function getElementById(id) {
		return document.getElementById(id);
	}

	const postBtn = getElementById("post-btn");

	function postRequest() {
		fetch('/book', {
			method: "post",
		})
		.then(res => console.log(res));
	}

	function app() {
		postBtn.onclick = postRequest;
	}
	app();
})();