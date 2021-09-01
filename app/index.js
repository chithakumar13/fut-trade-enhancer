import { initOverrides } from "./function-overrides";
import { setValue } from "./services/repository";

const initScript = function () {
  let isAllLoaded = false;
  if (services.Localization) {
    setValue("EnhancerSettings", {});
    isAllLoaded = true;
  }

  if (isAllLoaded) {
    initOverrides();
  } else {
    setTimeout(initScript, 1000);
  }
};

initScript();
