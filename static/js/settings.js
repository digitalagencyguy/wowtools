//validate names
function validateName(input) {
	var specialChars = /[!@#$%^&*()_+=\[\]\}\{\\\~\`\?\>\<1-9]/g
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//validate phone numbers
function validateNum(input) {
	var specialChars = /[A-Za-z!@#$%^&*()\[\]\{\}\\\+\_\?\>\<\-\s]/g,
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
function validateAPIKey(input) {
	var specialChars = /\s/g,
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}