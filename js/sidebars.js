//Sidebars
var sidebars = {
  $menuToggle: document.getElementById('menu-toggle'),
  sidebars: {},

  init: function () {
    let that = this;

    document.querySelectorAll('.sidebar[data-sidebar]').forEach(function ($sidebar) {
      let name = $sidebar.dataset.sidebar;

      that.sidebars[name] = $sidebar;
    });

    this.setupEvents();
  },
  setupEvents: function () {
    this.$menuToggle.addEventListener('click', this.open.bind(this, 'menu'), false);
    window.addEventListener('click', this.clickAnywhere.bind(this), false);
  },
  clickAnywhere: function (e) {
    let $sidebar = null;

    if (e.target.classList.contains('sidebar')) {
      $sidebar = e.target;
    } else {
      $sidebar = e.target.closest('.sidebar');
    }

    if ($sidebar)
  },

  get: function (name) {
    if (typeof this.sidebars[name] !== 'undefined') {
      return this.sidebars[name];
    }

    return null;
  },
  open: function (name) {
    let $sidebar = this.get(name);

    if ($sidebar && !$sidebar.classList.contains('open')) {
      $sidebar.classList.add('open');
    }
  },
  close: function (name) {
    let $sidebar = this.get(name);

    if ($sidebar && $sidebar.classList.contains('open')) {
      $sidebar.classList.remove('open');
    }
  },
  closeAll: function (except) {
    for (name in this.sidebars) {
      if (typeof except === 'undefined' || except != name) {
        this.close(name);
      }
    }
  },
};
