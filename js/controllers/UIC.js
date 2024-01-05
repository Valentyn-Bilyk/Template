let Helper = {
  elByID(id) {
    return document.getElementById(id);
  },
  vis(el, vis) {
    el.style.display = vis ? "block" : "none";
  },
  log(...args) {
    console.log(...args);
  },
};

let UIC = {
  PlayerBrainCountLabel: null,
  ScreenUI: Helper.elByID("screen_ui"),
  WinUI: Helper.elByID("win_ui"),
  PlayNowButton: Helper.elByID("win_ui_download_button"),
  TutorialSteps: [],
  init() {
    this.PlayNowButton.addEventListener("click", function () {
      OpenGameStorePage();
    });

    for (let i = 0; i < 1; i++) {
      let _step_root = Helper.elByID("tutorial_block_" + (i + 1));

      Helper.vis(_step_root, false);

      this.TutorialSteps.push(_step_root);
    }
  },
  updateDebugLabel: function(text) {
    let label = Helper.elByID("debug_label");
    label.innerHTML = text;
  },
  showTutorialStep: function (id) {
    this.hideTutorial();

    Helper.vis(this.TutorialSteps[id], true);

    let tutorial_hand =
      this.TutorialSteps[id].getElementsByClassName("tutorial_hand")[0];

    new TWEEN.Tween({ scale: 1 })
      .to({ scale: 1.2 }, 300)
      .onUpdate(function (obj) {
        tutorial_hand.style["transform"] = "scale(" + obj.scale + ")";
      })
      .yoyo(true)
      .repeat(Infinity)
      .start();
  },
  hideTutorial: function () {
    for (let i = 0; i < this.TutorialSteps.length; i++) {
      Helper.vis(this.TutorialSteps[i], false);
    }
  },
  toXYCoords: function (pos) {
    var pos_cloned = pos.clone();
    var vector = pos_cloned.project(CameraC.getCamera());

    vector.x = ((vector.x + 1) / 2) * window.innerWidth;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight;

    return vector;
  },
  showWinUI() {
    Helper.vis(this.WinUI, true);

    let _ws_portrait = Helper.elByID("win_ui_bg_portrait");
    let _ws_landscape = Helper.elByID("win_ui_bg_landscape");
    let _ws_icon = Helper.elByID("win_ui_icon");
    let _ws_button = this.PlayNowButton;

    Helper.vis(!PortraitOrientation ? _ws_portrait : _ws_landscape, false);

    new TWEEN.Tween({ scale: 0 })
      .to({ scale: 1 }, 900)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(function (obj) {
        _ws_icon.style.transform = "scale(" + obj.scale + ")";
      })
      .start();

    new TWEEN.Tween({ scale: 0.9 })
      .to({ scale: 1.1 }, 300)
      .onUpdate(function (obj) {
        _ws_button.style.transform = "scale(" + obj.scale + ")";
      })
      .repeat(1000)
      .yoyo(true)
      .start();
  },
};

let SoundManager = {
  volume: 1,
  initialized: false,
  backgroundMusic: null,
  init: function () {
    if (this.initialized) return;

    this.initialized = true;
    this.volume = 1;
  },
  playBackground: function(url) {
    this.backgroundMusic = this.playSound(url, true);
  },
  playSound: function (url, loop = false) {
    let sound = new Howl({
      src: [url],
      volume: this.volume,
      onplayerror: function () {
        sound.once("unlock", function () {
          sound.play();
        });
      },
    });

    sound.loop = loop;
    sound.play();

    return sound;
  },
  setAudioState: function (state) {
    this.volume = state ? 1 : 0;

    if (this.backgroundMusic) this.backgroundMusic.volume(this.volume);
  },
};