class PhysicsObjPair {
  constructor (threeObj, physicsObj) {
    this.threeObj = threeObj;
    this.physicsObj = physicsObj;
    this.destroyed = false;
  }

  update() {
    if(this.threeObj && this.physicsObj) {
      this.threeObj.position.copy(this.physicsObj.position);
      this.threeObj.quaternion.copy(this.physicsObj.quaternion);
    }
  }
}

const COL_CARS = 1
const COL_ROADTRIGGERS = 2

let PhysicsC = {
  physicsWorld: undefined,
  pairsObjs: [],
  init: function () {
    this.physicsWorld = new World({
      gravity: new Vec3(0, 0, 0), // m/s²
    });
  },
  createPhysicsBodyForThreeObj: function(threeObj, trigger, mass, col_group, col_mask) {
    let oldQuaternion = threeObj.quaternion.clone();

    let nullQuaternion = new THREE.Quaternion();
    threeObj.quaternion.copy(nullQuaternion);

    let bbox = new THREE.Box3().setFromObject(threeObj);

    let size = new THREE.Vector3();
    bbox.getSize(size);

    threeObj.quaternion.copy(oldQuaternion);

    const physicsBody = new Body({
      isTrigger: trigger,
      mass: mass,
      shape: new Box(new Vec3(size.x / 2, size.y / 2, size.z/2)),
      collisionFilterGroup: col_group, 
      collisionFilterMask: col_mask
    });
    physicsBody.position.set(
      threeObj.position.x,
      threeObj.position.y,
      threeObj.position.z,
    ); // m

    physicsBody.quaternion.setFromEuler(
      threeObj.rotation.x,
      threeObj.rotation.y,
      threeObj.rotation.z,
    );

    this.physicsWorld.addBody(physicsBody);

    return physicsBody;
  },
  // createCarPhysicsBody: function(threeObj) {
  //   let physicsBody = this.createPhysicsBodyForThreeObj(threeObj, false, 1000, COL_CARS, COL_CARS | COL_ROADTRIGGERS | COL_BARRIERS | COL_BULLDOZER | COL_CHARACTER);

  //   let pair = new PhysicsObjPair(threeObj, physicsBody);

  //   this.pairsObjs.push(pair);

  //   return physicsBody;
  // },
  // removeCarBody(body) {
  //   let pair = this.pairsObjs.find(el => el.physicsObj == body);

  //   if(pair) pair.destroyed = true;

  //   this.physicsWorld.removeBody(body);
  // },
  update: function (delta) {
    if (this.physicsWorld) 
    {
      try { // for exceptions (mintegral)
        this.physicsWorld.fixedStep();
      } catch (e) {
      }

      for(let i = 0; i < this.pairsObjs.length; i++) {
        if(this.pairsObjs[i].destroyed) continue;

        this.pairsObjs[i].update();
      }
    }
  },
};
