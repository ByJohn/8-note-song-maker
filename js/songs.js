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
      var added = new Date($song.dataset.added).getTime(),
          updated = new Date($song.dataset.updated).getTime(),
          text = '',
          description = '',
          className = '';

      if (now - added < month_seconds * 12) {
        text = 'New-ish';
        className = 'newish';
        description = 'Added ' + $song.dataset.added;

        if (now - added < month_seconds * 6) {
          text = 'New';
          className = 'new';
        }
      } else if (now - updated < month_seconds * 6) {
        text = 'Updated';
        className = 'updated';
        description = 'Updated ' + $song.dataset.updated;
      }

      if (text && className) {
        $song.querySelector('strong').insertAdjacentHTML('beforeend', '<span class="label ' + className + '" title="' + description + '">' + text + '</span>');
      }
    });
  },
};
