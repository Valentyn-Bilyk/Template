let ThreeC = {
  init() {
    this.animationMixersList = [];

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    //this.scene.fog = new THREE.FogExp2(0x81d2ff, 0.01);

    let renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(API_GetScreenSize().width, API_GetScreenSize().height);

    this.renderer = renderer;

    document.body.appendChild(renderer.domElement);
  },

  setNewResolution(x, y) {
    this.renderer.setSize(x, y);
    this.outlinePass.resolution = new THREE.Vector2(x, y);
  },

  setupLights() {
    let light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(4, 10, 8); //default; light shining from top

    let d = 10;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    ThreeC.addToScene(light);

    const ambLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
    ThreeC.addToScene(ambLight);
    ThreeC.addToScene(light.target);

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 200;

    this.light = light;
  },

  // translateLight(value) {
  //   if (!this.light) return;

  //   this.light.translateZ(value);

  //   this.light.target.translateZ(value);
  // }

  addToScene(obj) {
    this.scene.add(obj);
  },

  removeFromScene(obj) {
    obj.removeFromParent();
  },

  render(delta) {
    this.renderer.render(this.scene, CameraC.getCamera());

    let AnimMixersList = ThreeC.getAnimationMixersList();

    for (let i = 0; i < AnimMixersList.length; i++) {
      if (AnimMixersList[i]) AnimMixersList[i].update(delta);
    }
  },

  addAnimMixer(animMixer) {
    this.animationMixersList.push(animMixer);
  },

  getAnimationMixersList() {
    return this.animationMixersList;
  },
};
