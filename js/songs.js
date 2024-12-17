//Songs
var songs = {
  $songs: [],

  init: function () {
    this.$songs = document.querySelectorAll('#example-songs li');

    this.processList();
  },
  processList: function () {
    var now = Date.now(),
        month_seconds = 1000 * 60 * 60 * 24 * 31;

    this.$songs.forEach(function ($song) {
      var time = new Date($song.dataset.date).getTime();

      if (now - time < month_seconds * 12) {
        var text = 'New-ish',
            className = 'newish';

        if (now - time < month_seconds * 6) {
          text = 'New';
          className = 'new';
        }

        $song.querySelector('strong').insertAdjacentHTML('beforeend', '<span class="label ' + className + '" title="Added ' + $song.dataset.date + '">' + text + '</span>');
      }
    });
  },
};
