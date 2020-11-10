(() => {
	function getNode(name) {
		return document.querySelector(`[name='${name}']`);
	}
	window.onload = app;
	function app() {
		const emailInput = getNode("email");
		const passwordInput = getNode("password");
		const loginBtn = getNode("login");
		const registerBtn = getNode("register");

		// REGISTER HANDLE
		registerBtn.onclick = function() {
			location.href = "/register";
		}

		// LOGIN HANDLE
		loginBtn.onclick = function() {
			fetch('/login', {
				method: "post",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: `user_email=${emailInput.value}&user_password=${passwordInput.value}`
			})
			.then(res => res.json())
			.then(data => {
				if(data.error) {
					return document.getElementById("status").innerHTML = data.msg;
				}
				location.href = '/home';
			});
		}

	}
})();