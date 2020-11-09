fetch("http://localhost:3000/api")
.then(res => res.json())
.then(data => {
	document.querySelector("#root").innerHTML = `<h1>Hello, My name is ${data.name}. I am ${data.age} years old.</h1>`;
})
.catch(err => console.error(err));