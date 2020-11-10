(() => {
	function getNode(name) {
		return document.querySelector(`[name='${name}']`);
	}
	window.onload = app;
	function app() {
		const userNameInput = getNode("username");
		const emailInput = getNode("email");
		const passwordInput = getNode("password");
		const registerBtn = getNode("register");

		// REGISTER HANDLE
		registerBtn.onclick = function() {
			fetch('/register', {
				method: "post",
				body: `user_name=${userNameInput.value}&user_email=${emailInput.value}&user_password=${passwordInput.value}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				}
			})
			.then(res => res.json())
			.then(data => {
				if(data.error) {
					return document.getElementById("status").innerHTML = data.msg;
				}
				document.getElementById("status").innerHTML = data.msg;
				setTimeout(() => {
					location.href = '/';
				}, 1000);
			});
		}

	}
})();