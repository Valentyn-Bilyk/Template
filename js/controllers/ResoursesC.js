let ResourcesC = {
  gltfLoaderInstance: undefined,
  // prefabs, mats lists, etc.

  init: function () {
    gltfLoaderInstance = new THREE.GLTFLoader();
  },
  setShadowsStateForChildren: function (model, castShadows, receiveShadows) {
    model.traverse(function (object) {
      if (object.isMesh) {
        object.receiveShadow = receiveShadows;
        object.castShadow = castShadows;
      }
    });
  },
  loadResources: function (cb) {
    // gltfLoaderInstance.load(
    //   ConvertToBase64WhenRelease("./models/model.glb"),
    //   function (gltf) {
    //     ResourcesC.prefab = gltf.scene.children.find(
    //       (child) => child.name == "child"
    //     );
    //
    //    cb();
    //   },
    //   undefined,
    //   function (error) {
    //     console.error(error);
    //   }
    // );

    cb();
  },
};
