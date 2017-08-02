var map = {
	'us': .00
}

function calculatorDisplay() {
	var pricingCalculatorSpan = $('#pricing-calculator'),
		node = $('#base-modal'),
		closeModal = $('#close-modal');
	node.hide();
	pricingCalculatorSpan.css({'cursor':'pointer', 'color': '#2F64A6'});
	pricingCalculatorSpan.on('click', function() {
		node.show();
	})
	closeModal.on({
		click: function() {
			node.hide()
		},
		focus: function() {
			closeModal.css('outline','none');
		}
	})
}
function validateNumber(text) {
	var validNumbers = /[^\d]/g;
	return text.replace(validNumbers, '');

}
function calculateCost() {
	var texts = $('.texts');
	for (let i=0;i<texts.length;i++) {
		let number = $(texts[i]);
		number.on('input', function() {
			number.val(validateNumber(number.val()))
			let parent = number.parent(),
				siblings = parent.siblings(),
				pricePerText = parseFloat($(siblings[1].children[0]).html().slice(1)),
				numberOfTexts = parseInt(number.val()),
				totalCost = $(siblings[2].children[0]),
				costForRow = (numberOfTexts * pricePerText).toFixed(3);
			totalCost.html('$' + costForRow);
			Cost();
		})
	}

}
function addCountry() {
	var row = $('.rowObject');
		addCountry = $('#add-country');
	addCountry.on('click', function() {
		let newRow = row.clone(),
			children = newRow.children(),
			numberOfTexts = $(children[2]),
			pricePerText = $(children[3]);
		pricePerText.html("<span class='row-cost'>$0.082</span>");
		numberOfTexts.html('<input type="text" name="#" id="#" value="1" class="texts">');
		row.before(newRow);
		calculateCost();
		deleteCountry();
		Cost();
	})
}
function deleteCountry() {
	var xbox = $('.pricing-calculator-table-option');
	for (let i=0; i < xbox.length; i++) {
		let remove = $(xbox[i]);
		remove.css('cursor','pointer');
		remove.on('click', function() {
			let parent = remove.parent(),
				sibling = parent.siblings();
			if (sibling.length == 2) {
				return null
			}
			else {
				parent.remove();
			}
			Cost();
		})
	}
}
function Cost() {
	var total = $('#total-cost'),
		rows = $('.row-cost'),
		topOff = $('#top-off-amount'),
		cost = 0;
	for (let i=0; i < rows.length; i++) {
		let row = $(rows[i]),
			amount = parseFloat(row.html().slice(1));
		cost += amount;
	}
	total.html('$' + (cost).toFixed(3));
	topOff.html('$' + Math.ceil(cost))
}
function init() {
	calculatorDisplay();
	calculateCost();
	addCountry();
	deleteCountry();
	Cost();
}

$(document).on('ready', function() {
	init();
})
