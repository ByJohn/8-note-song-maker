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

    document.addEventListener('click', this.maybePlaySoundOnClick.bind(this), false);
  },
  formSubmitted: function (e) {
    e.preventDefault();

    this.processForm();
  },
  processForm: function () {
    sequencer.draw(this.$songData.value);
  },
  maybePlaySoundOnClick: function (e) {
    if (typeof e.target.dataset.play !== 'undefined') {
      sounds.play(e.target.dataset.play);
    }
  },
};
