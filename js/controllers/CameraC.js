let degrees_to_radians = function(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

let CameraC = {
  camera: null,
  cameraContainer: null,

  init: function () {
    let screenSize = API_GetScreenSize();

    this.camera = new THREE.PerspectiveCamera(
      60,
      screenSize.width / screenSize.height,
      0.1,
      1000
    );

    this.cameraContainer = new THREE.Object3D();
    this.cameraContainer.add(this.camera);

    this.camera.position.set(0, 10.5, 6);
    this.camera.rotation.x = -Math.PI / 3;

    ThreeC.addToScene(this.cameraContainer);
  },
  getCamera: function () {
    return this.camera;
  },
  // move: function (speed) {
  //   const cp = this.cameraContainer.position;
  //   this.cameraContainer.position.set(cp.x, cp.y, cp.z + speed);
  // },
  // downCameraTween: function () {
  //   let endPos = this.cameraContainer.position.clone();

  //   endPos.y -= 5;

  //   new TWEEN.Tween(this.cameraContainer.position)
  //     .to(endPos, 500)
  //     .delay(100)
  //     .easing(TWEEN.Easing.Quadratic.In)
  //     .start();
  // },
};
