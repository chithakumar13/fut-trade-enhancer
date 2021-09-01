export const showPopUp = (options, title, message, selectCallBack) => {
  const messagePopUp = new EADialogViewController({
    dialogOptions: options,
    message,
    title,
  });
  messagePopUp.init();
  messagePopUp.onExit.observe(this, function (e, t) {
    e.unobserve(this), selectCallBack.call(this, t);
  });
  gPopupClickShield.setActivePopup(messagePopUp);
};

export const popupOverride = () => {
  utils.PopupManager.getLocalizedDialogOption =
    function getLocalizedDialogOption(e) {
      var t = "";
      switch (e) {
        case enums.UIDialogOptions.RETRY:
          t = "easfcdown.retry";
          break;
        case enums.UIDialogOptions.OK:
          t = "common.dialog.ok";
          break;
        case enums.UIDialogOptions.CANCEL:
          t = "common.dialog.cancel";
          break;
        case enums.UIDialogOptions.YES:
          t = "popup.yes";
          break;
        case enums.UIDialogOptions.NO:
          t = "popup.no";
          break;
        case enums.UIDialogOptions.SIGN_OUT:
          t = "more.signout.button";
          break;
        case enums.UIDialogOptions.TAKE_ME:
          t = "popup.takeMeThere";
          break;
        case enums.UIDialogOptions.ENABLE:
          t = "common.dialog.enable";
          break;
        case enums.UIDialogOptions.DISABLE:
          t = "common.dialog.disable";
          break;
        case atob("UGF5cGFs"):
        case atob("WW91dHViZSBTdWJzY3JpcHRpb24="):
        case atob("UGF0cmVvbg=="):
          return e;
      }
      return services.Localization.localize(t);
    };
};
