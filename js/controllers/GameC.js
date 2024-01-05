let GameC = {
  GameTimer: 0,
  GameIsLoaded: false,
  GameIsReadyToStart: false,
  GameIsStarted: false,
  GameIsFinished: false,
  // called on window.onload
  init: function () {
    ThreeC.init();
    ThreeC.setupLights();

    InputC.init();
    CameraC.init();

    SoundManager.init();
    UIC.init();

    // PhysicsC.init();

    ResourcesC.init();
    ResourcesC.loadResources(() => {
      GameC.GameIsLoaded = true;

      Helper.log("Resources is loaded");

      UIC.showTutorialStep(0);

      API_GameIsReady();
    });
  },
  // called after first tap/mouse click
  startGame: function () {
    if (!GameC.GameIsLoaded) return;

    Helper.log("GameC.startGame()");

    UIC.hideTutorial();

    UIC.showWinUI();

    GameC.GameIsStarted = true;
  },
  finishGame: function () {
    if (GameC.GameIsFinished) return;

    Helper.log("GameC.finishGame()");

    UIC.showWinUI();

    GameC.GameIsFinished = true;

    API_GameIsEnded();
  },
  update: function () {
    const delta = ThreeC.clock.getDelta();

    ThreeC.render(delta);
    GameC.GlobalTimer += delta;
    requestAnimationFrame(GameC.update);

    TWEEN.update();

    if (!GameC.GameIsStarted || GameC.GameIsFinished) return;

    // update all necessary controllers
    // PhysicsC.update();
  },
};
