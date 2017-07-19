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
		}
	}
};

/**
 * Modal functions
 */
var Modal = {
	/**
	 * Closes Modals 
	 */
	closeModal: function() {
		$(".modal-container").fadeOut(200);
		$('.modal-actions .back-btn').attr('data-next-step', 'closeModal');
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
		$('.next-btn').text('Upload');
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
			$('.first-step').show().addClass('active');
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
			if($(this).attr('data-next-step') == 'closeModal') {
				Modal.closeModal();
			} else {
				$stepAction = $('.step.active').attr('data-prev-step');
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
	 * CSV Form Submission (Audience Page)
	 */
	audienceCSVFormSubmission: function() {
		alert('Submitting CSV Form (Event)');

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
	connectACFormSubmission: function() {
		alert("Submitting Active Campaign Form (Event)");
		/**
		 * AJAX Call
		 */
		
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

	/**
	 * Form submission event
	 */
	submitForm: function( $formName ) {
		switch($formName) {
			case 'csvForm':
				Forms.audienceCSVFormSubmission();
				break;

			case 'connectACForm':
				Forms.connectACFormSubmission();
				break;
		}
	},
};

/**
 * All functions being used on the Audience
 * page for the front end
 * @type {Object}
 */
var Audience = {
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
	 * Handles the Bulk Add modal
	 */
	bulkAddModal: function() {
		Modal.toggleModal('bulkAddModal');
	},

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
		this.handleModalToggleBtnClick();
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