import { getValue } from "../services/repository";
import {
  idFutBinPrice,
  idBidBargain,
  idHideBinPop,
  idSaveSettingsBtn,
  idFutBinPercent,
  idBarginThreshold,
  idMinRating,
  idFutBinDuration,
  idOnlyBargain,
  idTransferFullPop,
  idShowSquadPrice,
  idHideSearchMinBin,
  idHideViewFUTBIN
} from "../app.constants";
import { generateToggleInput } from "../utils/uiUtils/generateToggleInput";
import { insertSettings } from "../utils/dbUtil";
import { generateButton } from "../utils/uiUtils/generateButton";
import { sendUINotification } from "../utils/notificationUtil";
import { generateTextInput } from "../utils/uiUtils/generateTextInput";
import { hideLoader, showLoader } from "../utils/commonUtil";
import { savePlayersWithInRatingRange } from "../utils/ratingFilterUtil";

export const EnhancerSettingsView = function (t) {
  UTView.call(this);
};

JSUtils.inherits(EnhancerSettingsView, UTView);

EnhancerSettingsView.prototype._generate = function _generate() {
  if (!this._generated) {
    let container = document.createElement("div");
    container.classList.add("ut-market-search-filters-view");
    container.classList.add("floating");
    container.style["overflow-y"] = "scroll";
    container.style["display"] = "flex";
    container.style["align-items"] = "center";
    let wrapper = document.createElement("div");
    wrapper.style["height"] = "100%";
    const enhancerSetting = getValue("EnhancerSettings") || {};
    let currentRating = enhancerSetting["idMinRating"];
    wrapper.appendChild(
      $(` <div class='enhancer-settings-wrapper ut-pinned-list'>
          <div class="enhancer-settings-header"> 
          <h1 class="secondary">Enhancer Settings</h1>
          </div>
          ${generateToggleInput(
            "Show FutBin Price",
            { idFutBinPrice },
            "Shows Futbin Price and marks Bargains in searches",
            "idFutBinPrice" in enhancerSetting
              ? enhancerSetting["idFutBinPrice"]
              : true
          )}
          ${generateToggleInput(
            "Mark Bid Bargains",
            { idBidBargain },
            "Highlights Bargains based on current bid",
            "idBidBargain" in enhancerSetting
              ? enhancerSetting["idBidBargain"]
              : false
          )}
          ${generateTextInput(
            "Bargains Threshold Percent",
            95,
            { idBarginThreshold },
            "Highlight items if price below or equal to this percent of FUTBIN price",
            enhancerSetting["idBarginThreshold"]
          )}         
          ${generateTextInput(
            "FUTBIN Sale Percent",
            "95-100",
            { idFutBinPercent },
            "Sale Price percent for Relist FUTBIN",
            enhancerSetting["idFutBinPercent"],
            "text",
            "settings-field",
            "\\d+-\\d+$"
          )}
          ${generateTextInput(
            "Rating",
            "",
            { idMinRating },
            "Will only show players with rating as this value in searches",
            enhancerSetting["idMinRating"],
            "text"
          )}
          ${generateTextInput(
            "FUTBIN List Duration",
            "1H",
            { idFutBinDuration },
            "List Duration when listing using Re-list FUTBIN",
            enhancerSetting["idFutBinDuration"],
            "text"
          )}
          ${generateToggleInput(
            "Hide Bin Popup",
            { idHideBinPop },
            "Automatically confirms the Bin popup",
            "idHideBinPop" in enhancerSetting
              ? enhancerSetting["idHideBinPop"]
              : false
          )}
          ${generateToggleInput(
            "Hide Transfer full Popup",
            { idTransferFullPop },
            "Hides transfer full list popup",
            "idTransferFullPop" in enhancerSetting
              ? enhancerSetting["idTransferFullPop"]
              : false
          )}
          ${generateToggleInput(
            "Show only Bargains",
            { idOnlyBargain },
            "Show only cards lesser than FUTBIN in searches",
            "idOnlyBargain" in enhancerSetting
              ? enhancerSetting["idOnlyBargain"]
              : false
          )}
          ${generateToggleInput(
            "Show Squad Price",
            { idShowSquadPrice },
            "Show FUTBIN Price on Squad/SBC",
            "idShowSquadPrice" in enhancerSetting
              ? enhancerSetting["idShowSquadPrice"]
              : false
          )}
          ${generateToggleInput(
            "Hide Calculate Min Bin Button",
            { idHideSearchMinBin },
            "Hide the Calculate Min Bin Button on Player side Panel",
            "idHideSearchMinBin" in enhancerSetting
              ? enhancerSetting["idHideSearchMinBin"]
              : false
          )}
          ${generateToggleInput(
            "Hide View on FUTBIN Button",
            { idHideViewFUTBIN },
            "Hide the View on FUTBIN Button on Player side Panel",
            "idHideViewFUTBIN" in enhancerSetting
              ? enhancerSetting["idHideViewFUTBIN"]
              : false
          )}
          <div class="enhancer-save-btn">
            ${generateButton(
              idSaveSettingsBtn,
              "Save",
              async () => {
                showLoader();
                await insertSettings(
                  "enhancerSettings",
                  JSON.stringify(enhancerSetting)
                );
                if (currentRating !== enhancerSetting["idMinRating"]) {
                  await savePlayersWithInRatingRange(
                    enhancerSetting["idMinRating"]
                  );
                  currentRating = enhancerSetting["idMinRating"];
                }
                hideLoader();
                sendUINotification("Saved settings successfully");
              },
              "call-to-action flex-half"
            )}
          </div>
          </div>`)[0]
    );
    container.appendChild(wrapper);
    this.__root = container;
    this._generated = !0;
  }
};
