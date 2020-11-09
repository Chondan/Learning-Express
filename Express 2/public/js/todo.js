(() => {
	const addTodoBtn = document.getElementById("add-todo-btn");
	const input = document.getElementById("input");
	const todos = document.querySelectorAll(".todo-item");
	const viewTodoBtns = document.querySelectorAll(".view-todo-btn");

	function addTodo() {
		fetch('/todo', {
			method: "post",
			headers: {
		      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		    },
			body: `item=${input.value}&id=${Date.now() + input.value.replace(/\s/g, '-').replace(/\?/g, '-')}`
		})
		.then(res => res.json())
		.then(data => {
			location.reload();
		});
	}

	function deleteTodo(id) {
		fetch('/todo', {
			method: "delete",
			headers: {
		      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		    },
			body: `id=${id}`
		})
		.then(res => res.json())
		.then(data => {
			location.reload();
		});

	}

	function app() {
		window.onload = () => input.focus();
		addTodoBtn.onclick = addTodo;

		todos.forEach(todo => todo.onclick = function() {
			deleteTodo(todo.parentNode.getAttribute("data-todo-id"));
		});

		viewTodoBtns.forEach(btn => btn.onclick = function() {
			location.href = `/todo/${btn.parentNode.getAttribute("data-todo-id")}`;
		});
	}
	app();
})();