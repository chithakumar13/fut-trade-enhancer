import { setValue } from "../../services/repository";

export const xmlRequestOverride = () => {
  let defaultRequestOpen = window.XMLHttpRequest.prototype.open;

  window.XMLHttpRequest.prototype.open = function (method, url, async) {
    this.addEventListener(
      "readystatechange",
      function () {
        if (
          this.readyState === 4 &&
          this.responseURL.includes("/ut/game/fifa21/usermassinfo")
        ) {
          let parsedRespose = JSON.parse(this.responseText);
          if (parsedRespose)
            setValue("unassigned", parsedRespose.userInfo.unassignedPileSize);
        }
      },
      false
    );
    defaultRequestOpen.call(this, method, url, async);
  };
};
