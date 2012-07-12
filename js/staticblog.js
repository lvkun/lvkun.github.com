(function() {
  var IndexLoader, IndexRender, PostLoader, PostRender, StateManager, state,
    _this = this;

  IndexRender = (function() {

    function IndexRender(args) {}

    IndexRender.prototype.show = function() {
      return console.log("IndexRender show");
    };

    IndexRender.prototype.hide = function() {
      return console.log("IndexRender hide");
    };

    return IndexRender;

  })();

  IndexLoader = (function() {

    function IndexLoader(args) {}

    IndexLoader.prototype.load = function(callback) {
      return console.log("IndexLoader load");
    };

    return IndexLoader;

  })();

  PostRender = (function() {

    function PostRender(args) {}

    PostRender.prototype.show = function() {
      return console.log("PostRender show");
    };

    PostRender.prototype.hide = function() {
      return console.log("PostRender hide");
    };

    return PostRender;

  })();

  PostLoader = (function() {

    function PostLoader(args) {}

    PostLoader.prototype.load = function(callback) {
      return console.log("PostLoader load");
    };

    return PostLoader;

  })();

  StateManager = (function() {

    function StateManager(args) {
      this.renders = {
        index: new IndexRender(),
        post: new PostRender()
      };
      this.loaders = {
        index: new IndexLoader(),
        post: new PostLoader()
      };
    }

    StateManager.prototype.get_state = function() {
      var path;
      path = location.hash.replace(/^#/, '').replace(/^!/, '');
      if (path.length === 0 || path.indexOf("@") !== -1) return "index";
      return "post";
    };

    StateManager.prototype.update = function() {
      if (this.state) this.renders[this.state].hide();
      this.state = this.get_state();
      return this.loaders[this.state].load(this.renders[this.state].show);
    };

    return StateManager;

  })();

  state = new StateManager();

  $(document).ready(function() {
    return state.update();
  });

}).call(this);
