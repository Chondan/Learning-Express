window.onload = function() {
	const search = document.querySelector('[type=search]');
	const code = document.querySelector('pre');

	search.addEventListener('keyup', function() {
		if (!search.value) { return; }
		fetch('/search/' + search.value)
		.then(res => res.text())
		.then(data => {
			console.log(data);
			code.textContent = data;
		});
	});
}