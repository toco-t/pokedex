function withWhiteSpace(string) {
	return /\s/.test(string);
}

function validateEmail(email) {
	const validEmail = /\S+@\S+\.\S+/;
	return validEmail.test(email);
}

function validateCredentials(route) {
	const username = $(".username").val();
	const email = $(".email").val();
	const password = $(".password").val();
	
	if (
		withWhiteSpace(username) ||
		withWhiteSpace(email) ||
		withWhiteSpace(password)
	) {
		$(".login__message").html("NO WHITESPACE ALLOWED...");
	} else if (username === "" || email === "" || password === "") {
		$(".login__message").html("EMPTY CREDENTIALS...");
	} else if (!validateEmail(email)) {
		$(".login__message").html("INVALID EMAIL...");
	} else {
		$.ajax({
			url: `http://localhost:3000/${route}`,
			type: "POST",
			data: {
				username: username,
				email: email,
				password: password,
			},
			success: (data) => {
				data === "" ? window.location.href = "/account" : $(".login__message").html(data);
			},
		});
	}
} 

function signUp() {
	validateCredentials("signup");
}

function logIN() {
	validateCredentials("login");
}