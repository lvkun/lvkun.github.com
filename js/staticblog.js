(function() {
  var IndexLoader, IndexRender, PostLoader, PostRender, StateManager, state,
    _this = this;

  IndexRender = (function() {

    function IndexRender(args) {}

    return IndexRender;

  })();

  IndexLoader = (function() {

    function IndexLoader(args) {}

    return IndexLoader;

  })();

  PostRender = (function() {

    function PostRender(args) {}

    return PostRender;

  })();

  PostLoader = (function() {

    function PostLoader(args) {}

    return PostLoader;

  })();

  StateManager = (function() {

    function StateManager(args) {
      var loaders, renders;
      renders = {
        index: new IndexRender(),
        post: new PostRender()
      };
      loaders = {
        index: new IndexLoader(),
        post: new PostLoader()
      };
    }

    StateManager.prototype.init = function() {
      return console.log("StateManager init");
    };

    return StateManager;

  })();

  state = new StateManager();

  $(document).ready(function() {
    return state.init();
  });

}).call(this);
