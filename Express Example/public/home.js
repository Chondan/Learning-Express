(() => {
	window.onload = app;
	function app() {
		const fetchBtn = document.getElementById("fetch");
		const list = document.getElementById("list");
		const addPostBtn = document.getElementById("addPost");
		const post = document.querySelector(`[name = 'post']`);

		fetchBtn.onclick = function() {
			fetch('/fetchStatus')
			.then(res => res.json())
			.then(data => {
				const { error, results } = data;
				if(!results) { return; }
				if(results.length > 0) {
					results.forEach(r => {
						const l = document.createElement('li');
						l.innerHTML = r.user_status;
						list.append(l);
					});
				}

			});
		}

		addPostBtn.onclick = function() {
			fetch('/addStatus', {
				method: "post",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: `user_status=${post.value}`
			})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				post.value = "";
			});
		}
	}
})();