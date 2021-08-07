import { initOverrides } from "./function-overrides";

window.initScript = function () {
  if (services.Localization) {
    window.hasLoadedAll = true;
  }

  if (window.hasLoadedAll) {
    initOverrides();
  } else {
    window.setTimeout(initScript, 1000);
  }
};

initScript();
