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

			case 'pricingCalculator':
				// Show the pricing calculator modal by default
				Modal.toggleModal('smsPricingCalculator');
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
		if( ! $('.next-btn').hasClass('payment-btn')) {
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
		switch($formName) {
			/**
			 * Audience page
			 */
			// Audience page CSV form
			case 'csvForm':
				AudienceForms.CSVFormSubmission();
				break;

			// Audience page connect Active Campaign Form
			case 'connectACForm':
				AudienceForms.ACFormSubmission();
				break;

			/**
			 * SMS page
			 */
			// Purchase 1000 messages at $100
			case 'buy1000Form':
				SMSForms.buy1000FormSubmission();
				break;

			case 'buy5000Form':
				SMSForms.buy5000FormSubmission();
				break;

			case 'buy36Form':
				SMSForms.buy36FormSubmission();
				break;

			case 'buy47Form':
				SMSForms.buy47FormSubmission();
				break;

			case 'buy425Form':
				SMSForms.buy425FormSubmission();
				break;
		}
	},
};

// All forms on the Audience page
var AudienceForms = {
	/**
	 * CSV Form Submission (Audience Page)
	 */
	CSVFormSubmission: function() {
		alert('Submitting CSV Form (Event)');

		/**
		 * AJAX Call
		 */
		var CSVFormData = [
			'uploadCSVCountry',
			'uploadCSVFile',
			'uploadCSVAudienceName',
			'uploadCSVActiveList',
			'uploadCSVTags',
			'uploadCSVAgree',
		];
		var CSVFormDestination = 'api/v1/audience/bulkAddUploadCSV';

		// AJAX Call
		sendRequest(CSVFormData, CSVFormDestination);

		// Format the back button to become a cancel button
		$('.back-btn').addClass('cancel-btn');
		$('.back-btn').text('Cancel');

		// Temporarily hide the next button
		$('.next-btn').hide();

		// Progress bar
		Modal.stepAction('upload-progress-bar-step');

		// Mock progress bar completion (5 seconds)
		$progressBarCompletion = setTimeout(function() {
			alert('Submitted CSV Form');

			// Successful upload
			Modal.stepAction('successful-bulk-upload');

			// Hide buttons
			$('.back-btn').hide();
			$('.next-btn').hide();

			// Hide the "Bulk Add Contacts" title
			$('.wowtools-modal h2').hide();

			// Show the back to dashboard button
			$('.back-to-dashboard-button').show();
		}, 3000);

		$('.cancel-btn').click(function() {
			// If cancel button is pressed, abort AJAX call i.e.
			// var xhr = $.ajax();
			// xhr.abort();
			$('.next-btn').show(); // Show the next button again
			clearTimeout($progressBarCompletion);
		});
	},

	/**
	 * Connecting Active Campaign Form Submission (Audience Page)
	 */
	ACFormSubmission: function() {
		alert("Submitting Active Campaign Form (Event)");

		/**
		 * AJAX Call
		 */
		var ACFormData = [
			'connectACFormACList'
		];
		var ACFormDestination = 'api/v1/audience/bulkAddActiveCampaign';

		// AJAX Call
		sendRequest(ACFormData, ACFormDestination);

		alert("Submitted AC Form");

		// Assume a successful AJAX call
		Modal.stepAction('successful-ac-sync');

		// Hide buttons
		$('.back-btn').hide();
		$('.next-btn').hide();

		// Hide the "Bulk Add Contacts" title
		$('.wowtools-modal h2').hide();

		// Show the back to dashboard button
		$('.back-to-dashboard-button').show();
	},
};

// All forms on the SMS page
var SMSForms = {
	/**
	 * Shows the Stripe overlay
	 */
	Stripe: function() {
		// Shows the Stripe overlay
		$('.wowtools-modal').hide();
		$('.modal-container').fadeIn(200);
		$('.stripe-overlay').show();

		// Pretend a Stripe payment happened

		// Fade out
		setTimeout(function() {
			// Modal.closeModal();
			$('.stripe-overlay').hide();
		}, 3000);
	},

	/**
	 * Shows the success modal
	 */
	Success: function() {
		$('.wowtools-modal').hide();
		$("#success-modal .first-step").addClass('active');
		$("#success-modal .back-to-dashboard-button").show();

		// TODO: Remove the delay in the final site to be replaced with AJAX success
		$('#success-modal').delay(3000).fadeIn(200);
	},

	/**
	 * Performs buy 5000 form action
	 */
	buy5000FormSubmission: function() {
		// Modal.closeModal();
		// Fade out modals
		$('.wowtools-modal').fadeOut(200);
		/**
		 * Stripe related code goes here
		 */
		SMSForms.Stripe();
		alert('Stripe payment completed - $400');
		/**
		 * Stripe payment completed, show success screen
		 */
		SMSForms.Success();
	},

	/**
	 * Performs buy 1000 form action
	 */
	buy1000FormSubmission: function() {
		// Modal.closeModal();
		// Fade out modals
		$('.wowtools-modal').fadeOut(200);
		/**
		 * Stripe related code goes here
		 */
		SMSForms.Stripe();
		alert('Stripe payment completed - $100');
		/**
		 * Stripe payment completed, show success screen
		 */
		SMSForms.Success();
	},

	/**
	 * Performs buy 36 form action
	 */
	buy36FormSubmission: function() {
		// Modal.closeModal();
		// Fade out modals
		$('.wowtools-modal').fadeOut(200);
		/**
		 * Stripe related code goes here
		 */
		SMSForms.Stripe();
		alert('Stripe payment completed - $36');
		/**
		 * Stripe payment completed, show success screen
		 */
		SMSForms.Success();
	},

	/**
	 * Performs buy 47 Monthly form action
	 */
	buy47FormSubmission: function() {
		// Modal.closeModal();
		// Fade out modals
		$('.wowtools-modal').fadeOut(200);
		/**
		 * Stripe related code goes here
		 */
		SMSForms.Stripe();
		alert('Stripe payment completed - $47/month');
		/**
		 * Stripe payment completed, show success screen
		 */
		SMSForms.Success();
	},

	/**
	 * Performs buy 425 Yearly form action
	 */
	buy425FormSubmission: function() {
		// Modal.closeModal();
		// Fade out modals
		$('.wowtools-modal').fadeOut(200);
		/**
		 * Stripe related code goes here
		 */
		SMSForms.Stripe();
		alert('Stripe payment completed - $425/year');
		/**
		 * Stripe payment completed, show success screen
		 */
		SMSForms.Success();
	},

	/**
	 * Checks prices after discount coupon is applied 
	 */
	checkPricesAfterDiscount: function() {
		/**
		 * Replace with production code
		 */
		alert('Checking price after discount...');
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