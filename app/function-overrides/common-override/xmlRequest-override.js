import { setValue, getValue } from "../../services/repository";

export const xmlRequestOverride = () => {
  let defaultRequestOpen = window.XMLHttpRequest.prototype.open;

  window.XMLHttpRequest.prototype.open = function (method, url, async) {
    this.addEventListener(
      "readystatechange",
      function () {
        if (this.readyState === 4) {
          if (this.responseURL.includes("/ut/game/fifa21/usermassinfo")) {
            let parsedRespose = JSON.parse(this.responseText);
            if (parsedRespose)
              setValue("unassigned", parsedRespose.userInfo.unassignedPileSize);
          } else if (
            this.responseURL.includes(
              "https://gateway.ea.com/proxy/identity/pids/me"
            )
          ) {
            let parsedRespose = JSON.parse(this.responseText);
            if (parsedRespose && parsedRespose.pid && !getValue("useremail"))
              setValue("useremail", parsedRespose.pid.email);
          }
        }
      },
      false
    );
    defaultRequestOpen.call(this, method, url, async);
  };
};
