function register() {
	var firstname = $('#firstname'),
		lastname = $('#lastname'),
		email = $('#email'),
		password = $('#password'),
		verifyPassword = $('#passwordVerification'),
		csrfmiddlewaretoken = "{{ csrf_token }}",
		signUp = $('#signup');
	signUp.on('click', function() {
		data = {
			'firstname': firstname.val(),
			'lastname': lastname.val(),
			'email': email.val(),
			'password': password.val(),
			'csrfmiddlewaretoken': csrfmiddlewaretoken,
		}
		$.post('/api/v1/register', data, function(data, status) {
			console.log(data);
		})
	})
}

function validateForm() {
	var firstname = $('#firstname'),
		lastname = $('#lastname'),
		email = $('#email'),
		password = $('#password'),
		confirm = $('#passwordVerification'),
		register = $('#signup'),
		validName = /^[a-zA-Z\-]{2,30}$/,
		validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
		validPassword = /\d{8,}/i,
		validate = function() {
			if (
				validPassword.test(password.val()) && 
				password.val() === confirm.val() && 
				validName.test(firstname.val()) && 
				validName.test(lastname.val()) && 
				validEmail.test(email.val())
				) 
			{
				register.show(50);
			}
			else 
			{
				register.hide(50);
			}
		};
		validate();
		firstname.on('input', function() {
			firstname.val(firstname.val().replace(/[^A-Za-z-]+/g,""))
			validate();
		})
		lastname.on('input', function() {
			lastname.val(lastname.val().replace(/[^A-Za-z-]+/g,""));
			validate();
		})
		password.on('input', function() {
			validate();
		})
		confirm.on('input', function() {
			validate();
		})
}

$(document).on('ready', function() {
	register();
	validateForm();
})