function getNode(name) {
	return document.querySelector(`[name='${name}']`);
}

window.onload = function() {
	const username = getNode("username");
	const password = getNode("password");
	const registerBtn = getNode("register");

	registerBtn.onclick = () => {
		fetch('/register', {
			method: "post",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: `username=${username.value}&password=${password.value}`
		})
		.then(res => res.text())
		.then(data => {
			console.log(data);
			location.href = '/';
		});
	}
}