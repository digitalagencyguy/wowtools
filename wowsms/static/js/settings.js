//validate names
function validateName(input) {
	var specialChars = /[!@#$%^&*()_+=\[\]\}\{\\\~\`\?\>\<]/g
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//validate phone numbers
function validateNum(input) {
	var specialChars = /[A-Za-z!@#$%^&*()\[\]\{\}\\\+\_\?\>\<\-\s]/g,
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//swap values on 
function swapValues(input, labelId) {
	var obj = $(input);
		label = $(`#${labelId}`);
	label.html(obj.val())
}
