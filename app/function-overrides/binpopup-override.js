import { getValue } from "../services/repository";

export const binPopUpOverride = () => {
  const popupConfirm = utils.PopupManager.showConfirmation;
  utils.PopupManager.showConfirmation = function (e, t, i, o) {
    const autoConfirm = getValue("EnhancerSettings")["idHideBinPop"];
    if (
      e.title === utils.PopupManager.Confirmations.CONFIRM_BUY_NOW.title &&
      autoConfirm
    ) {
      i();
      return;
    }

    popupConfirm.call(this, e, t, i, o);
  };
};
