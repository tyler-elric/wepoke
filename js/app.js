// Generated by CoffeeScript 1.7.1
(function() {
  var DebugLog, Log, module,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Log = (function() {
    function Log(message) {
      this.message = message;
      this.get_text = __bind(this.get_text, this);
      this.priority = 1;
      this.created = Date.now();
      this.expires = 5 * 1000;
    }

    Log.prototype.get_text = function() {
      return "[" + this.created + ":] @message";
    };

    return Log;

  })();

  DebugLog = (function(_super) {
    __extends(DebugLog, _super);

    function DebugLog(message) {
      DebugLog.__super__.constructor.call(this, message);
      this.priority = 2;
      this.expires = 5 * 1000;
    }

    return DebugLog;

  })(Log);

  module = angular.module("WePoke", ["ngAnimate"]);

  module.constant("NewGame", {
    created: Date.now(),
    name: null,
    gender: null,
    roster: [],
    storage: [],
    boxes: [],
    emblems: []
  });

  module.factory("GlobalEvents", function($window) {
    var event_connection, listeners, meta_events;
    meta_events = {
      network_click: function() {
        return $window.alert("Opening network navigation...");
      },
      log: function(message) {
        return new Log(message);
      },
      debug: function(message) {
        return new DebugLog(message);
      }
    };
    listeners = {};
    return event_connection = {
      listen: function(event, handler) {
        var key, lis;
        key = 0;
        lis = listeners[event];
        if (lis != null) {
          lis[key] = handler;
        } else {
          listeners[event] = {};
          listeners[event][key] = handler;
        }
        return key;
      },
      ignore: function(event, key) {
        var lis;
        lis = listeners[event];
        del(lis[key]);
        return null;
      },
      handle: function(event) {
        return meta_events[event];
      }
    };
  });

  module.factory("GameSave", function($q, NewGame) {
    var internal, manager, save_data;
    save_data = null;
    internal = {
      make_new_game: function() {
        var data, promise;
        promise = $q.defer();
        return data = promise.promise;
      }
    };
    return manager = {
      load_game: function() {
        var promise, set_game;
        promise = $q.defer();
        set_game = function(game) {
          return promise.resolve(save_data = game);
        };
        if (save_data != null) {
          set_game(save_data);
        } else {
          internal.make_new_game().then(set_game);
        }
        return promise.promise;
      }
    };
  });

  module.factory("ScriptEngine", function($q, $http, GlobalEvents) {
    var environment;
    environment = {
      init: function(save) {
        var game_save;
        return game_save = save;
      },
      load_script: function(name) {
        var script_load, start_script;
        script_load = null;
        start_script = function() {
          return null;
        };
        return script_load.then(start_script);
      }
    };
    return environment;
  });

  module.controller("Game", function($scope, GameSave, ScriptEngine, GlobalEvents) {
    var start_game;
    $scope.save = null;
    $scope.message_log = [];
    GlobalEvents.listen;
    start_game = function(save) {
      $scope.save = save;
      return ScriptEngine.init($scope.save);
    };
    return GameSave.load_game().then(start_game);
  });

  module.controller("Navigation", function($scope, GlobalEvents) {
    $scope.menu_items = [
      {
        text: "Network",
        icon: "favicon.ico",
        action: "network_click"
      }
    ];
    $scope.handle_event = GlobalEvents.handle;
    return null;
  });

}).call(this);
