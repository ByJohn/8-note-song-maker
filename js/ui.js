//UI
var ui = {
  $form: document.getElementById('form'),
  $songData: document.getElementById('song-data'),

  init: function () {
    this.setupEvents();
    this.processForm();
  },
  setupEvents: function () {
		this.$form.addEventListener('submit', this.formSubmitted.bind(this), false);

		this.$songData.addEventListener('keyup', this.processForm.bind(this), false);
  },
  formSubmitted: function (e) {
    e.preventDefault();

    this.processForm();
  },
  processForm: function () {
    sequencer.draw(this.$songData.value.trimEnd());
  },
  
};
