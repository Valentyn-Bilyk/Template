let InputC = {
  init() {
    this.touchDevice =
      navigator.maxTouchPoints || "ontouchstart" in document.documentElement;

    this.mouseOrTouchActive = false;

    if (this.touchDevice) {
      window.addEventListener("touchstart", this.mouseOrTouchDown, false);
      window.addEventListener("touchend", this.mouseOrTouchUp, false);
      window.addEventListener("touchcancel", this.mouseOrTouchUp, false);
      window.addEventListener("touchmove", this.mouseOrTouchMove, false);
    } else {
      window.addEventListener("mousemove", this.mouseOrTouchMove);
      window.addEventListener("mousedown", this.mouseOrTouchDown);
      window.addEventListener("mouseup", this.mouseOrTouchUp);
    }
  },
  getCurrentPointer(event) {
    let pointer = new THREE.Vector3();

    var ev_x = InputC.touchDevice ? event.touches[0].pageX : event.pageX;
    var ev_y = InputC.touchDevice ? event.touches[0].pageY : event.pageY;
  
    pointer.x = (ev_x / window.innerWidth) * 2 - 1;
    pointer.y = -(ev_y / window.innerHeight) * 2 + 1;
    pointer.z = 0.5;

    return pointer;
  },
  mouseOrTouchDown(event) {
    if (!GameC.GameIsStarted && GameC.GameIsReadyToStart) {
      GameC.startGame();

      return;
    }

    InputC.mouseOrTouchActive = true;
  },
  mouseOrTouchUp(event) {
    if (OneTapPlayableMode) {
      GameC.finishGame();
      OpenGameStorePage();
    }

    if (!GameC.GameIsStarted) return;

    InputC.mouseOrTouchActive = false;
  },
  mouseOrTouchMove(event) {
    if (!GameC.GameIsStarted) return;

    if (InputC.mouseOrTouchActive) {
      // do smth
    }
  },
};
