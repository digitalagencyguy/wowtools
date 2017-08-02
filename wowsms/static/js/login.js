
function validateForm() {
	var validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
		validPassword = /^\d{8,}$/i,
		password = $('#password'),
		email = $('#email'),
		login = $('#login'),
		validate = function() {
			if (validEmail.test(email.val()) && validPassword.test(password.val())) {
				login.show(50)
			}
			else {
				login.hide(50)
			}
		};
	validate();
	email.on('input', function() {
		email.val(email.val().replace(/[^\w\d-_\.@]/g,''));
		validate();
	})
	password.on('input', function() {
		validate();
	})
}

$(document).on('ready', function() {
	validateForm();
})