const GameStoreLinkAndroid = "https://play.google.com/store/apps/details?id=com.mustardgames.police.bike.stunt.mega.ramp.impossibletracks";
const GameStoreLinkIOS = "https://play.google.com/store/apps/details?id=com.mustardgames.police.bike.stunt.mega.ramp.impossibletracks";

let IsAndroid = /android/i.test(navigator.userAgent || navigator.vendor)
  ? true
  : false;

const OneTapPlayableMode = false;

let ValidScreenSize;
let ValidScreenSizeIsSet = false;

let AdApiTypes = {
  None: 0,
  MRAID: 1,
  DAPI: 2,
  Mobvista: 3,
};

let AdNetworkTypes = {
  none: 0,
  ironsource: 1,
  applovin: 2,
  mintegral: 3,
  unity: 4,
  facebook: 5,
  googleads: 6,
  tiktok: 7,
};

let EnabledAdApi = ReplaceAdApiWhenRelease(AdApiTypes.None);
let AdNetwork = ReplaceAdNetworkWhenRelease(AdNetworkTypes.None);

let IsAudioEnabled = true;
let PortraitOrientation;

function ReplaceAdApiWhenRelease(api) {
  return api;
}

function ReplaceAdNetworkWhenRelease(network) {
  return network;
}

function ConvertToBase64WhenRelease(str) {
  return str;
}

window.gameStart = function () {
  API_StartGame();
};

window.gameClose = function () {
  if (SoundManager) SoundManager.setAudioState(false);
};

window.addEventListener("resize", API_ResizeCallback);

window.onload = function () {
  API_SetScreensSize(() => {
    switch (EnabledAdApi) {
      case AdApiTypes.None:
        API_StartGame();
        break;
      case AdApiTypes.MRAID:
        if (mraid.getState() === "loading") {
          mraid.addEventListener("ready", MRAID_onReadyCallback);
        } else {
          MRAID_onReadyCallback();
        }
        break;
      case AdApiTypes.DAPI:
        if (dapi.isReady()) {
          DAPI_onReadyCallback();
        } else {
          dapi.addEventListener("ready", DAPI_onReadyCallback);
        }
        break;
    }
  
    GameC.init();
    GameC.update();
  });
};

function DAPI_onReadyCallback() {
  dapi.removeEventListener("ready", DAPI_onReadyCallback);

  IsAudioEnabled = !!dapi.getAudioVolume();

  if (dapi.isViewable()) {
    API_StartGame();

    IronsourceForceScreenUpdate();
  }

  dapi.addEventListener("viewableChange", DAPI_viewableChangeCallback);
  dapi.addEventListener("audioVolumeChange", DAPI_audioVolumeChangeCallback);
}

function MRAID_onReadyCallback() {
  mraid.addEventListener("viewableChange", MRAID_viewableChangeCallback);

  if (mraid.isViewable()) {
    API_StartGame();
  }
}

function MRAID_viewableChangeCallback(viewable) {
  if (viewable) {
    API_StartGame();

    SoundManager.setAudioState(true);
  } else {
    SoundManager.setAudioState(false);
  }
}

function DAPI_viewableChangeCallback(e) {
  if (e.isViewable) {
    API_StartGame();

    IronsourceForceScreenUpdate();

    SoundManager.setAudioState(true);
  } else {
    SoundManager.setAudioState(false);
  }
}

function DAPI_audioVolumeChangeCallback(volume) {
  IsAudioEnabled = !!volume;

  SoundManager.setAudioState(IsAudioEnabled);
}

function API_StartGame() {
  if (GameC.GameIsReadyToStart) return;

  let screenSize = API_GetScreenSize();

  PortraitOrientation = screenSize.height > screenSize.width;

  GameC.GameIsReadyToStart = true;
}


function _getScreenSize() {
  let screenSize = {};

  if (EnabledAdApi == AdApiTypes.MRAID) {
    if (window.mraid && window.mraid.getMaxSize) {
      screenSize = window.mraid.getMaxSize();
    }
  } else if (EnabledAdApi == AdApiTypes.DAPI) {
    if (window.dapi && window.dapi.getScreenSize) {
      screenSize = window.dapi.getScreenSize();
    }
  }

  screenSize.width = screenSize.width || window.innerWidth;
  screenSize.height = screenSize.height || window.innerHeight;

  return screenSize;
}

function API_SetScreensSize(cb) {
  let interval = setInterval(() => {
    let screenSize = _getScreenSize();

    if(screenSize.width === 0 || screenSize.height === 0) {
      console.log("API_SetScreensSize, skip interval");
    } else {
      console.log("API_SetScreensSize, success interval");
  
      ValidScreenSize = {
        width: screenSize.width,
        height: screenSize.height
      };

      ValidScreenSizeIsSet = true;

      clearInterval(interval);
  
      cb();
    }
  }, 50);
}

function API_GetScreenSize() {
  console.log("API_GetScreenSize: " + ValidScreenSize.width + " x " + ValidScreenSize.height);

  return ValidScreenSize;
}

function API_GameIsReady() {
  if (EnabledAdApi == AdApiTypes.Mobvista) {
    window.gameReady && window.gameReady();
  }
}

function API_GameIsEnded() {
  if (EnabledAdApi == AdApiTypes.Mobvista) {
    window.gameEnd && window.gameEnd();
  }
}

function API_ResizeCallback() {
  if(!ValidScreenSizeIsSet) return;

  setTimeout(function () {
      console.log("API_ResizeCallback");
      try {
        let screenSize = _getScreenSize();

        let NewOrientationIsPortrait = screenSize.height > screenSize.width;

        if (PortraitOrientation != NewOrientationIsPortrait) {
            ValidScreenSize = screenSize;

            PortraitOrientation = NewOrientationIsPortrait;

            CameraC.getCamera().aspect = (screenSize.width / screenSize.height);
            CameraC.setCamera(PortraitOrientation);
            CameraC.getCamera().updateProjectionMatrix();

            ThreeC.setNewResolution(screenSize.width, screenSize.height);
        }
        } catch (e) {
          console.log(e);
        }
  }, 50);
}

function IronsourceForceScreenUpdate() {
  setTimeout(function () {
    let screenSize = API_GetScreenSize();

    CameraC.getCamera().aspect = (screenSize.width / screenSize.height);
    CameraC.setCamera(screenSize.height > screenSize.width);
    CameraC.getCamera().updateProjectionMatrix();

    ThreeC.setNewResolution(screenSize.width, screenSize.height);
  }, 200);
}

function OpenGameStorePage() {
  GameC.finishGame();
  
  switch(EnabledAdApi) {
    case AdApiTypes.MRAID:
      mraid.open(IsAndroid ? GameStoreLinkAndroid : GameStoreLinkIOS);
      break;
    case AdApiTypes.DAPI:
      dapi.openStoreUrl();
    break;
    case AdApiTypes.Mobvista:
      window.install && window.install();
    break;
    default:
      if(AdNetwork == AdNetworkTypes.facebook) {
        window.FbPlayableAd.onCTAClick();
      } else if(AdNetwork == AdNetworkTypes.googleads) {
        window.ExitApi.exit();
      } else if (AdNetwork == AdNetworkTypes.tiktok) {
        window.openAppStore();
      } else {
        document.location.href = IsAndroid
        ? GameStoreLinkAndroid
        : GameStoreLinkIOS;
      }
      break;
  }
}