//Sidebars
var sidebars = {
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
    window.addEventListener('click', this.clickAnywhere.bind(this), false);

    document.querySelectorAll('.sidebar-menu .example-songs a').forEach(function ($a) {
      $a.addEventListener('click', ui.songLinkClicked.bind(ui), false);
    });
  },
  clickAnywhere: function (e) {
    let $button = null,
        $sidebar = null;

    if (typeof e.target.dataset.sidebarOpen !== 'undefined') {
      $button = e.target;
      $sidebar = this.get(e.target.dataset.sidebarOpen);
    } else if ($button = e.target.closest('[data-sidebar-open]')) {
      $sidebar = this.get($button.dataset.sidebarOpen);
    } else if (e.target.classList.contains('sidebar')) {
      $sidebar = e.target;
    } else {
      $sidebar = e.target.closest('.sidebar');
    }

    if ($button) {
      this.open($button.dataset.sidebarOpen);
      e.preventDefault();
    }

    if ($sidebar) {
      this.closeAll($sidebar.dataset.sidebar);
    } else {
      this.closeAll();
    }
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
