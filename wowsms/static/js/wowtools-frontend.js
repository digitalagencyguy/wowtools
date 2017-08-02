/**
 * Intialises relevant variables based on the page
 * being viewed
 * @type {Object}
 */
var Site = {
	/**
	 * Initialises the relevant functions based
	 * on the page that is currently being viewed
	 */
	init: function( $page ) {
		switch($page) {
			case 'audience':
				// Audience functions
				Audience.init();
				break;

			case 'sms':
				SMS.init();
				break;

			case 'audience2':
				Audience2.init();
				break;

			case 'sequences':
				Sequences.init();
				break;
		}
	}
};

/**
 * Modal functions
 */
var Modal = {
	/**
	 * Handles the modal toggle click action event
	 */
	handleModalToggleBtnClick: function() {
		$('.modal-toggle').click(function() {
			$modal = $(this).attr('data-modal-function');
			Modal.toggleModal($modal);
		});
	},

	/**
	 * Closes Modals 
	 */
	closeModal: function() {
		$(".modal-container").fadeOut(200);
		$('.modal-actions .back-btn').attr('data-next-step', 'closeModal');
		$('.wowtools-modal').hide();
	},

	/**
	 * Toggles modals when buttons are clicked
	 */
	toggleModal: function(targetModal) {
		/* Offset the modal container by the height of the header
			to prevent overlap */
		$headerHeight = $('.dashboard-header').height();
		$(".modal-container .table").css('padding-top', $headerHeight);
		$('.modal-container').fadeIn(100);
		$('#' + targetModal).find('.first-step').addClass('active');
		$('#' + targetModal).show();

		if($('.step.active').hasClass('contains-form')) {
			Modal.changeContinueToSubmit( $('.step.active').attr('data-next-step') );
		} else {
			Modal.changeSubmitToContinue( $('.step.active').attr('data-next-step') );
		}
	},

	/**
	 * Step "Action"
	 * Fades out old step and fades in new one
	 */
	stepAction: function( newStep ) {
		$(".step").removeClass('active');
		$('.step').fadeOut(100);
			
		$('#' + newStep).addClass('active');
		$('#' + newStep).delay(110).fadeIn(100);
	},

	/**
	 * Changes the Continue button into a submit button
	 * in the case of a form
	 */
	changeContinueToSubmit: function() {
		$('.next-btn').attr('data-next-step', $('.step.contains-form.active').attr('data-form'));
		if( ! $('.next-btn').hasClass('payment-btn') && ! $('.next-btn').hasClass('no-change-text-btn') ) {
			$('.next-btn').text('Upload');
		}
		$('.next-btn').addClass('submit-btn');
	},

	/**
	 * Changes a submit button back into a continue button
	 */
	changeSubmitToContinue: function(nextStep) {
		$('.next-btn').attr('data-next-step', nextStep);
		$('.next-btn').text('Continue');
		$('.next-btn').removeClass('submit-btn');
	},

	/**
	 * Handles "steps" (i.e. changing content within a modal)
	 */
	handleModalsteps: function( nextStep, backStep ) {
		this.stepAction( nextStep );

		/**
		 * Check if the new step is a form step (at which point
		 * turn the next button into a submit button)
		 */
		if($('.step.active').hasClass('contains-form')) {
			Modal.changeContinueToSubmit();
		}

		$('.back-btn').attr('data-next-step', backStep);
	},

	/**
	 * Handles step button click event
	 */
	handleStepBtnClick: function() {
		$('.step-btn').click(function() {
			var $backStep 		= $(this).attr('data-back-step'),
				$nextStep 		= $(this).attr('data-next-step');

			Modal.handleModalsteps( $nextStep, $backStep );
		});
	},

	/**
	 * Resets the modal accordingly
	 */
	resetModal: function() {
		Modal.closeModal();

		// Set Timeout to allow transition to finish before changes start being applied
		setTimeout(function() {
			// Buttons
			$('.back-btn').show().removeClass('cancel-btn').text('Back').attr('data-next-step', 'closeModal');
			$('.next-btn').show().removeClass('submit-btn').text('Continue');
			$('.step').hide().removeClass('active');
			$('.back-to-dashboard-button').hide();

			// Show the "Bulk Add Contacts" title
			$('.wowtools-modal h2').show();
		}, 175);
	},

	/**
	 * Handles pressing of back button
	 */
	handleModalBackButtonClick: function() {
		$('.back-btn').click(function() {
			$stepAction = $('.step.active').attr('data-prev-step');

			if($stepAction == 'closeModal') {
				Modal.closeModal();
				return;
			}

			/**
			 * Take a step "back"
			 */
			Modal.stepAction( $stepAction );

			if($('.first-step').hasClass('active')) {
				$('.back-btn').attr('data-next-step', 'closeModal');
			}

			if($('.step.active').hasClass('contains-form')) {
				Modal.changeContinueToSubmit( $('.step.active').attr('data-next-step') );
			} else {
				Modal.changeSubmitToContinue( $('.step.active').attr('data-next-step') );
			}

			if($(this).hasClass('cancel-btn')) {
				$(this).removeClass('cancel-btn');
				$(this).text('Back');
			}
		});
	},

	/**
	 * Handles pressing of next button
	 */
	handleModalNextButtonClick: function() {
		$('.next-btn').click(function() {
			/**
			 * Check if this is a form submission or a normal
			 * next button click
			 */
			if($(this).hasClass("submit-btn")) {
				/**
				 * Form Submission
				 */
				$form = $(this).attr('data-next-step');
				alert('Submitting form: #' + $form);
				
				// Submit the form
				Forms.submitForm($form);
			} else {
				$nextStep = $('.step.active').attr('data-next-step');
				$('.next-btn').attr('data-next-step', $nextStep);

				if($nextStep == 'closeModal') {
					Modal.closeModal();
					return;
				}

				/**
				 * Step Action
				 */
				Modal.stepAction( $nextStep );

				/**
				 * Assign the back and next buttons accordingly
				 */
				if($('.step.active').hasClass('contains-form')) {
					Modal.changeContinueToSubmit( $('.step.active').attr('data-next-step') );
				} else {
					Modal.changeSubmitToContinue( $('.step.active').attr('data-next-step') );
				}

				$('.back-btn').attr('data-next-step', $(".step.active").attr('data-prev-step'));
			}
		});
	},


	/**
	 * Initialises modal
	 */
	initModal: function() {
		this.handleModalToggleBtnClick();
		this.handleStepBtnClick();
		this.handleModalBackButtonClick();
		this.handleModalNextButtonClick();

		$('.back-to-dashboard-btn').click(function() {
			Modal.resetModal();
		});
	},
};

/**
 * All forms used throughout the website and the neccessary code
 * that's triggered when they are submitted
 */
var Forms = {
	/**
	 * Form submission event
	 */
	submitForm: function( $formName ) {
		$('#' + $formName).submit();
	},
};

/**
 * All functions being used on the Audience
 * page for the front end
 * @type {Object}
 */
var Audience = {
	/**
	 * Toggles the sync indicator in the bulk add form
	 */
	bulkAddFormSyncIndicator: function() {
		$(".audience-sync-form .sync-indicator").click(function(e) {
			e.preventDefault();
			$(this).toggleClass('active');
			if($(this).hasClass('active')) {
				$(this).find('span').text('Yes');
			} else {
				$(this).find('span').text('No');
			}
		});
	},

	/**
	 * Initialises required functions
	 */
	init: function() {
		this.bulkAddFormSyncIndicator();
		Modal.initModal();

		$('.next-btn, .active-campaign-trigger, .upload-csv-trigger').click(function() {
			$element = $('.step.active');
			if($element.attr('id') == 'connect-active-campaign-step') {
				$('.next-btn').text('Continue');
			}

			if($element.attr('id') == 'upload-csv-step') {
				$('.next-btn').text('Upload');
			}
		});	
	},
};

/**
 * All functions being used on the individual audience
 * page for the front end
 * @type {Object}
 */
var Audience2 = {
	/**
	 * Handles behaviour of pressing the plus button on the
	 * individual audience page
	 */
	addIndividualAudienceRow: function(counter) {
		event.preventDefault();
		counter = counter + 1;

		// Turn the current add row button into a trash button
		$('.individual-add-audience ul li button.plus').hide();
		$('.individual-add-audience ul li.contains-trash').show();

		// Append a row
		$('.add-audience-individual-rows').append(
			'<div class="d-flex individual-add-audience" id="row-' + counter + '">' +
				'<label>First Name</label>' +
				'<input type="text" name="#">' +
				'<label>Last Name</label>' +
				'<input type="text" name="#">' +
				'<label>Mobile</label>' +
					'<select>' +
							'<option value="+61">+61</option>' +
					'</select>' +
				'<input type="text" name="#">' +
				'<label>Tags</label>' +
				'<input type="text" name="#">' +
				'<ul class="d-flex">' +
					'<li class="contains-trash" style="display:none;">' +
						'<button class="delete-individual-add-audience trash" onclick="Audience2.removeIndividualAudienceRow(' + counter + ');"><i class="fa fa-minus"></i></button>' +
					'</li>' +
					'<li>' +
						'<button class="plus" onclick="Audience2.addIndividualAudienceRow(' + counter + ');"><i class="fa fa-plus"></i></button>' +
					'</li>' +
				'</ul>' +
			'</div>'
		);
	},

	/**
	 * Handles behaviour of pressing the plus button on the
	 * individual audience page but only within the modal object
	 */
	addIndividualAudienceRowModal: function(counter) {
		event.preventDefault();
		counter = counter + 1;

		// Turn the current add row button into a trash button
		$('.individual-audience-sync ul li.contains-plus').hide();
		$('.individual-audience-sync ul li.contains-trash').show();

		// Append a row
		$('#individual-audience-sync-app').append(
			'<div class="d-flex individual-audience-sync" id="modal-row-' + counter + '">' +
				'<label>First Name</label>' +
				'<input type="text" name="#">' +
				'<label>Last Name</label>' +
				'<input type="text" name="#">' +
				'<label>Mobile</label>' +
					'<select>' +
							'<option value="+61">+61</option>' +
					'</select>' +
				'<input type="text" name="#">' +
				'<ul>' +
					'<li class="contains-trash" style="display:none;">' +
						'<button class="trash" onclick="Audience2.removeIndividualAudienceRowModal(' + counter + ');"><i class="fa fa-minus"></i></button>' +
					'</li>' +
					'<li class="contains-plus">' +
						'<button class="plus" onclick="Audience2.addIndividualAudienceRowModal(' + counter + ');"><i class="fa fa-plus"></i></button>' +
					'</li>' +
				'</ul>' +
			'</div>'
		);
	},

	/**
	 * Handles behaviour when pressing the minus button
	 * on the individual audience page
	 */
	removeIndividualAudienceRow: function(counter) {
		event.preventDefault();
		$('#row-' + counter).remove();

		var counter = counter + 1;
		if(! $('#row-' + counter).length) {
			var counter = counter - 1;
			if(counter > 0) {
				$('#row-' + counter + ' ul.d-flex').append(
					'<li>' +
						'<button class="plus" onclick="Audience2.addIndividualAudienceRow(' + counter + ');"><i class="fa fa-plus"></i></button>' +
					'</li>'
				);
			}
		}
	},

	/**
	 * Handles behaviour when pressing the minus button
	 * on the individual audience page but only within the modal
	 */
	removeIndividualAudienceRowModal: function(counter) {
		event.preventDefault();
		$('#modal-row-' + counter).remove();

		var counter = counter + 1;
		if(! $('#modal-row-' + counter).length) {
			var counter = counter - 1;
			if(counter > 0) {
				$('#modal-row-' + counter + ' ul.d-flex').append(
					'<li>' +
						'<button class="plus" onclick="Audience2.addIndividualAudienceRow(' + counter + ');"><i class="fa fa-plus"></i></button>' +
					'</li>'
				);
			}
		}
	},

	init: function() {
		Modal.initModal();

		$('.modal-toggle').click(function() {
			event.preventDefault();
		});
	},
};

/**
 * All functions being used on the SMS
 * page for the front end
 * @type {Object}
 */
var SMS = {
	/**
	 * Handles the modal toggle click action event
	 */
	handleModalToggleBtnClick: function() {
		$('.modal-toggle').click(function() {
			$modal = $(this).attr('data-modal-function');
			switch($modal) {
				case 'bulkAddModal':
					Audience.bulkAddModal();
					break;
			}
		});
	},

	/**
	 * Handle discount form
	 */
	handleDiscountForm: function() {
		$('.apply-discount').click(function(e) {
			e.preventDefault();

			// Perform form action
			SMSForms.checkPricesAfterDiscount();
		});
	},

	init: function() {
		this.handleModalToggleBtnClick();
		this.handleDiscountForm();
		Modal.initModal();
	}
};

/**
 * All functions being used on the Sequences
 * page for the front end
 * @type {Object}
 */
var Sequences = {
	init: function() {
		$('.add-sequence').click(function() {
			event.preventDefault();
			alert("Add Sequence Event");
		});
		$('.sqnce-btn-dlt').click(function() {
			event.preventDefault();
			alert("Delete Event");
		});
		Modal.initModal();
	},
};