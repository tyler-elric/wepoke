// Generated by CoffeeScript 1.6.3
(function() {
  var OverworldControls,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OverworldControls = (function() {
    var MenuHandler, MovementHandler;

    MenuHandler = (function(_super) {
      __extends(MenuHandler, _super);

      MenuHandler.minHold = 100;

      MenuHandler.openMenu = 16;

      MenuHandler.openInventory = 69;

      MenuHandler.openRoster = 81;

      function MenuHandler(syndicator, owc) {
        MenuHandler.__super__.constructor.call(this, syndicator);
        this.overworldInterface = owc;
      }

      MenuHandler.prototype.shouldHandleSignal = function(code, duration) {
        if (duration >= this.constructor.minHold) {
          return code === this.constructor.openMenu;
        } else {
          return false;
        }
      };

      MenuHandler.prototype.handleSignalOff = function(signal) {
        if (signal === this.constructor.openMenu) {
          return this.overworldInterface.openMenu();
        }
      };

      return MenuHandler;

    })(InputEventDelegater);

    MovementHandler = (function(_super) {
      __extends(MovementHandler, _super);

      MovementHandler.moveCodes = {
        65: "left",
        87: "up",
        83: "down",
        68: "right"
      };

      MovementHandler.holdRunning = 32;

      MovementHandler.minHold = 30;

      MovementHandler.currentDirection = null;

      MovementHandler.running = false;

      function MovementHandler(syndicator, owc) {
        this.endMovement = __bind(this.endMovement, this);
        this.changeMovement = __bind(this.changeMovement, this);
        this.startMovement = __bind(this.startMovement, this);
        this.handleSignalOff = __bind(this.handleSignalOff, this);
        this.handleSignalOn = __bind(this.handleSignalOn, this);
        this.shouldHandleSignal = __bind(this.shouldHandleSignal, this);
        MovementHandler.__super__.constructor.call(this, syndicator);
        this.overworldInterface = owc;
      }

      MovementHandler.prototype.shouldHandleSignal = function(code, duration) {
        return code in this.constructor.moveCodes || code === this.constructor.holdRunning;
      };

      MovementHandler.prototype.handleSignalOn = function(signal) {
        var direction;
        if (signal in this.constructor.moveCodes) {
          direction = this.constructor.moveCodes[signal];
          if (this.currentDirection === null) {
            return this.startMovement(this.constructor.moveCodes[signal]);
          } else if (this.currentDirection !== direction) {
            return this.changeMovement(this.constructor.moveCodes[signal]);
          }
        } else if (signal === this.constructor.holdRunning && !this.running) {
          console.log("Now running");
          return this.running = true;
        }
      };

      MovementHandler.prototype.handleSignalOff = function(signal) {
        if (signal in this.constructor.moveCodes) {
          if (this.constructor.moveCodes[signal] === this.currentDirection) {
            this.currentDirection = null;
            return this.endMovement();
          }
        } else if (signal === this.constructor.holdRunning && this.running) {
          console.log("No longer running.");
          return this.running = false;
        }
      };

      MovementHandler.prototype.startMovement = function(direction) {
        return console.log("Moving:", this.currentDirection = direction);
      };

      MovementHandler.prototype.changeMovement = function(direction) {
        return console.log("New Direction:", this.currentDirection = direction);
      };

      MovementHandler.prototype.endMovement = function() {
        return console.log("Done moving.");
      };

      return MovementHandler;

    })(InputEventDelegater);

    function OverworldControls(player, gameInterface) {
      this.player = player;
      this.gameInterface = gameInterface;
      this.openMenu = __bind(this.openMenu, this);
      this.disable = __bind(this.disable, this);
      this.enable = __bind(this.enable, this);
      this.syndicator = new Syndicator();
      this.keyboard = new Keyboard(this.syndicator);
      this.menuHandler = new MenuHandler(this.syndicator, this);
      this.movementHandler = new MovementHandler(this.syndicator, this);
    }

    OverworldControls.prototype.enable = function() {
      this.menuHandler.enable();
      return this.movementHandler.enable();
    };

    OverworldControls.prototype.disable = function() {
      this.menuHandler.disable();
      return this.movementHandler.disable();
    };

    OverworldControls.prototype.openMenu = function() {
      return this.gameInterface.gameMode("saving");
    };

    return OverworldControls;

  }).call(this);

  this.OverworldMovementInterface = (function() {
    OverworldMovementInterface.stepDuration = 1000;

    OverworldMovementInterface.prototype.elapsedTime = 0;

    function OverworldMovementInterface(bindedOverworld) {
      this.reset = __bind(this.reset, this);
      this.progress = __bind(this.progress, this);
      this.overworld = bindedOverworld;
    }

    OverworldMovementInterface.prototype.progress = function(time) {
      return this.elapsedTime += 1;
    };

    OverworldMovementInterface.prototype.reset = function() {
      return this.elapsedTime = 0;
    };

    return OverworldMovementInterface;

  })();

  this.OverworldEntity = (function() {
    OverworldEntity.prototype.position = {
      x: ko.observable(0),
      y: ko.observable(0)
    };

    OverworldEntity.prototype.sprite = null;

    OverworldEntity.prototype.direction = "down";

    OverworldEntity.prototype.nextStepCompletion = 0;

    OverworldEntity.prototype._setSprite = function(sprite) {
      return this.sprite = sprite;
    };

    function OverworldEntity(cls, onLoad) {
      var _this = this;
      if (onLoad == null) {
        onLoad = null;
      }
      this.render = __bind(this.render, this);
      this._setSprite = __bind(this._setSprite, this);
      if (onLoad === null) {
        onLoad = function() {
          return null;
        };
      }
      this.spriteClass = cls;
      OverworldSprite.loadSprite(this.spriteClass, function(spr) {
        _this._setSprite(spr);
        return onLoad(_this.sprite);
      });
    }

    OverworldEntity.prototype.render = function(context, tw, th) {
      var directionalMultiplier, sf;
      directionalMultiplier = 0;
      if (this.nextStepCompletion > 0) {
        directionalMultiplier = {
          'left': tw,
          'right': tw,
          'up': th,
          'down': 'down',
          th: th
        };
        directionalMultiplier = directionalMultiplier[this.direction];
      }
      sf = math.floor(this.nextStepCompletion / 100 * directionalMultiplier);
      return this.sprite.render(context, this.position.x(), position.y(), this.direction, sf, tw, th);
    };

    return OverworldEntity;

  })();

  this.HeroEntity = (function(_super) {
    __extends(HeroEntity, _super);

    function HeroEntity(saveInfo, onLoad) {
      if (onLoad == null) {
        onLoad = null;
      }
      if (onLoad === null) {
        onLoad = function() {
          return null;
        };
      }
      HeroEntity.__super__.constructor.call(this, "hero_" + saveInfo.gender, onLoad);
      this.saveInfo = saveInfo;
      this.position = this.saveInfo.position;
    }

    return HeroEntity;

  })(OverworldEntity);

  this.OverworldSprite = (function() {
    OverworldSprite.cache = {};

    OverworldSprite.loadSprite = function(cls, cb) {
      if (cls in OverworldSprite.cache) {
        return cb(OverworldSprite.cache[cls]);
      } else {
        return new OverworldSprite(cls, function(sprite) {
          return cb(OverworldSprite.cache[cls] = sprite);
        });
      }
    };

    function OverworldSprite(overworldClass, cb) {
      var _this = this;
      this.overworldClass = overworldClass;
      this.render = __bind(this.render, this);
      this.image = new Image();
      this.image.src = "overworld/" + this.overworldClass + ".png";
      this.image.onload = function(event) {
        return cb(_this);
      };
    }

    OverworldSprite.prototype.render = function(context, x, y, direction, frameStep, tw, th) {
      var blitX, blitY, frames, sliceX, sliceY, spriteHeight, spriteWidth, _ref, _ref1, _ref2;
      _ref = [x * tw, y * th], blitX = _ref[0], blitY = _ref[1];
      _ref1 = [parseInt(this.image.width) / 4, parseInt(this.image.height) / 3], spriteWidth = _ref1[0], spriteHeight = _ref1[1];
      if (this.image.width > tw) {
        blitX -= (spriteWidth - tw) / 2;
      }
      if (spriteHeight > th) {
        blitY -= spriteHeight - th;
      }
      console.log("Drawing position:", blitX, blitY);
      console.log("Map position:", x, y);
      frames = {
        "down": 0,
        "up": 1,
        "left": 2,
        "right": 3
      };
      _ref2 = [frames[direction], 0], sliceX = _ref2[0], sliceY = _ref2[1];
      return context.drawImage(this.image, sliceX, sliceY, spriteWidth, spriteHeight, blitX, blitY, spriteWidth, spriteHeight);
    };

    return OverworldSprite;

  }).call(this);

  this.GamePlay = (function() {
    GamePlay.prototype.running = false;

    GamePlay.prototype.handle = null;

    GamePlay.tileWidth = 16;

    GamePlay.tileHeight = 16;

    function GamePlay(canvas, _interface) {
      this.canvas = canvas;
      this["interface"] = _interface;
      this.requestFrame = __bind(this.requestFrame, this);
      this.pause = __bind(this.pause, this);
      this.getTileSlice = __bind(this.getTileSlice, this);
      this.getOverworlds = __bind(this.getOverworlds, this);
      this.drawOverworlds = __bind(this.drawOverworlds, this);
      this.changePlayerMovement = __bind(this.changePlayerMovement, this);
      this.endPlayerMovement = __bind(this.endPlayerMovement, this);
      this.startPlayerMovement = __bind(this.startPlayerMovement, this);
      this.frame = __bind(this.frame, this);
      this.play = __bind(this.play, this);
      this.getSave = __bind(this.getSave, this);
      this.overworldResponse = new OverworldControls(null, this["interface"]);
      this["interface"].currentSave();
    }

    GamePlay.prototype.getSave = function(cb) {
      return cb(this["interface"].currentSave());
    };

    GamePlay.prototype.loadedMap = null;

    GamePlay.prototype.tileset = null;

    GamePlay.prototype.heroEntity = null;

    GamePlay.prototype.play = function() {
      var allowPlay, checkBack, mapLoaded, playerLoaded, _ref,
        _this = this;
      allowPlay = function() {
        _this.running = true;
        _this.overworldResponse.enable();
        _this.requestFrame(_this.frame);
        return true;
      };
      _ref = [!(this.tileset === null || this.loadedMap === null), !this.heroEntity === null], mapLoaded = _ref[0], playerLoaded = _ref[1];
      checkBack = function() {
        if (mapLoaded && playerLoaded) {
          return allowPlay();
        } else {
          return false;
        }
      };
      if (!checkBack()) {
        if (!mapLoaded) {
          this["interface"].loadMap(1, function(mapObject, tileset) {
            _this.loadedMap = mapObject;
            _this.tileset = tileset;
            mapLoaded = true;
            return checkBack();
          });
        }
        if (!playerLoaded) {
          return this.getSave(function(saveInfo) {
            return _this.heroEntity = new HeroEntity(saveInfo, function() {
              playerLoaded = true;
              return checkBack();
            });
          });
        }
      }
    };

    GamePlay.prototype.frame = function() {
      var _this = this;
      return this.getSave(function(save) {
        var blitX, blitY, boundsH, boundsW, cameraAdjustX, cameraAdjustY, context, frame, height, layer, mapx, mapy, playerPositionX, playerPositionY, playerSpriteHeight, playerSpriteWidth, tile, tileHeight, tileWidth, tilex, tiley, width, xpos, ypos, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        _ref = [16, 32], playerSpriteWidth = _ref[0], playerSpriteHeight = _ref[1];
        _ref1 = [save.position.x(), save.position.y()], playerPositionX = _ref1[0], playerPositionY = _ref1[1];
        _ref2 = [16, 16], width = _ref2[0], height = _ref2[1];
        _ref3 = [_this.canvas.width - width, _this.canvas.height - height], boundsW = _ref3[0], boundsH = _ref3[1];
        _ref4 = [Number.random(boundsW), Number.random(boundsH)], xpos = _ref4[0], ypos = _ref4[1];
        _ref5 = [_this.canvas.width / 2, _this.canvas.height / 2], cameraAdjustX = _ref5[0], cameraAdjustY = _ref5[1];
        cameraAdjustX -= playerPositionX * width;
        cameraAdjustY -= playerPositionY * height;
        cameraAdjustX -= Math.abs((playerSpriteWidth - width) / 2);
        context = _this.canvas.getContext("2d");
        context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
        context.setTransform(1, 0, 0, 1, cameraAdjustX, cameraAdjustY);
        frame = 0;
        _ref6 = _this.loadedMap.layers;
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          layer = _ref6[_i];
          _ref7 = [0, 0], mapx = _ref7[0], mapy = _ref7[1];
          for (_j = 0, _len1 = layer.length; _j < _len1; _j++) {
            tile = layer[_j];
            if (tile >= 0) {
              _ref8 = _this.getTileSlice(tile, frame), tilex = _ref8[0], tiley = _ref8[1], tileWidth = _ref8[2], tileHeight = _ref8[3];
              _ref9 = [mapx * tileWidth, mapy * tileHeight], blitX = _ref9[0], blitY = _ref9[1];
              context.drawImage(_this.tileset, tilex, tiley, tileWidth, tileHeight, blitX, blitY, tileWidth, tileHeight);
            }
            if (++mapx >= _this.loadedMap.width) {
              mapy += 1;
              mapx = 0;
            }
          }
        }
        _this.drawOverworlds(context);
        return null;
      });
    };

    GamePlay.prototype.startPlayerMovement = function(direction) {
      return null;
    };

    GamePlay.prototype.endPlayerMovement = function() {
      return null;
    };

    GamePlay.prototype.changePlayerMovement = function(direction) {
      return null;
    };

    GamePlay.prototype.drawOverworlds = function(context) {
      var ow, _i, _len, _ref, _results;
      _ref = this.getOverworlds(true);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ow = _ref[_i];
        _results.push(ow.render(context, this.constructor.tileWidth, this.constructor.tileHeight));
      }
      return _results;
    };

    GamePlay.prototype.getOverworlds = function(includeHero) {
      var r;
      return r = includeHero ? [this.heroEntity] : [];
    };

    GamePlay.prototype.getTileSlice = function(tileNumber) {
      return [tileNumber * this.constructor.tileWidth, 0, this.constructor.tileWidth, this.constructor.tileHeight];
    };

    GamePlay.prototype.pause = function(halt) {
      if (halt == null) {
        halt = false;
      }
      this.overworldResponse.disable();
      if (halt) {
        if (requestAnimationFrame !== null) {
          cancelRequestAnimFrame(this.handle);
        } else {
          clearTimeout(this.handle);
        }
      }
      return this.running = false;
    };

    GamePlay.prototype.requestFrame = function(cb) {
      if (requestAnimationFrame !== null) {
        return this.handle = requestAnimFrame(cb);
      } else {
        return this.handle = setTimeout(cb, 1000 / 64);
      }
    };

    return GamePlay;

  })();

}).call(this);
