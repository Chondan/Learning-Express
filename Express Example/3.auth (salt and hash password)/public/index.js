function getNode(name) {
	return document.querySelector(`[name='${name}']`);
}

window.onload = function() {
	const username = getNode("username");
	const password = getNode("password");
	const loginBtn = getNode("login");
	const registerBtn = getNode("register");

	registerBtn.onclick = () => location.href = '/register';

	loginBtn.onclick = () => {
		fetch('/login', {
			method: "post",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: `username=${username.value}&password=${password.value}`
		})
		.then(res => res.text())
		.then(data => {
			console.log(data);
			if (data === "done") {
				location.href = '/home';
			}
		});
	}
}