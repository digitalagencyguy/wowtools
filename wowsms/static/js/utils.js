function Cookies() {
	var cookies = document.cookie,
		cArray = cookies.split(';');
		json = new Object;
	for (elem in cArray) {
		let element = cArray[elem],
			obj = element.split('=')
		json[obj[0]] = obj[1]}
	return json
}