//validate names
function validateName(input) {
	var specialChars = /[^A-Za-z-]+/g,
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//validate email
function validateEmail(input) {
	var specialChars = /[^\w\d-_\.@]/g;
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//validate phone numbers
function validateNum(input) {
	var specialChars = /[A-Za-z!@#$%^&*()\[\]\{\}\\\+\_\?\>\<\-\s]/g,
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//validate AC api key
function validateAPIKey(input) {
	var specialChars = /\s/g,
		obj = $(input);
	obj.val(obj.val().replace(specialChars, ''))
}
//give each user a "thing" tag to help distinguish them
function createIds() {
	var users = $('#users-field'),
		children = users[0].children;
	for (let i = 0; i < children.length; i++) {
		let child = $(children[i]);
		child.attr('thing', i)
	}
}
//add users on "Add User" click
function addUser() {
	var add = $('#add-user'),
		userField = $('#user-field'),
		usersField = $('#users-field');
	add.on('click', function() {
		var newForm = userField.clone();
			children = newForm.children();
			firstname = $(children[0].children[1]),
			lastname = $(children[1].children[1]),
			email = $(children[2].children[1]);
		firstname.val('');
		email.val('');
		lastname.val('');
		var newField = usersField.append(newForm);
		createIds();
	})
}
//delete user on "trash" click
function deleteUser(element) {
	$(element).on('click', function() {
		field = $(this).parent().parent().parent()
		div = field.parent()
		if (field.attr('thing') != 0) {
			field.remove();
			createIds();
		}
	})
}
//Search users from search bar
function searchUsers() {
	var search = $('#search-users');
	search.on('input', function() {
		var users = $('.user'),
			regex = new RegExp(search.val(), 'g');
		for (let i = 0; i < users.length; i++) {
			let user = $(users[i]),
				children = user.children(),
				firstname = $(children[0].children[1]),
				lastname = $(children[1].children[1]),
				email = $(children[2].children[1]),
				bigly = `${firstname.val()} ${lastname.val()} ${email.val()}`;
				match = regex.test(bigly);
			if (!match) {
				user.removeClass('unhide-user').addClass('hide-user');
			}
			else if (match) {
				user.removeClass('hide-user').addClass('unhide-user');
			}
			if (search.val() == '') {
				user.removeClass('hide-user').addClass('unhide-user');
			}
		}
	})
}

function init() {
	addUser();
	createIds();
	searchUsers();
}

$(document).on('ready', function(){
	init()
})