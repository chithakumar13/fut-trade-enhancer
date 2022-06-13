import {
  createElementFromHTML,
  getRandWaitTime,
  wait,
} from "../utils/commonUtil";
import { idListFutBin, idSearchMinBin, idViewFutBin } from "../app.constants";
import { getValue, setValue } from "../services/repository";
import { listForPrice } from "../utils/sellUtil";
import { fetchPricesFromFutBin, getFutbinPlayerUrl } from "../services/futbin";
import { getUserPlatform } from "../services/user";
import { generateButton } from "../utils/uiUtils/generateButton";
import { sendUINotification } from "../utils/notificationUtil";
import { calculatePlayerMinBin } from "../services/minBinCalc";

export const playerViewPanelOverride = () => {
  const calcTaxPrice = (buyPrice) => {
    const priceAfterTax = (buyPrice * 0.95).toLocaleString();
    $("#saleAfterTax").html(`Price: ${priceAfterTax}`);
  };

  const panelViewFunc =
    controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData;

  const buyPriceChanged = UTQuickListPanelView.prototype.onBuyPriceChanged;

  const quickPanelRenderView =
    UTQuickListPanelViewController.prototype.renderView;

  UTQuickListPanelView.prototype.onBuyPriceChanged = function (e, t, i) {
    buyPriceChanged.call(this, e, t, i);
    calcTaxPrice(this._buyNowNumericStepper.getValue());
  };

  UTQuickListPanelView.prototype.initFutBinEvent = function (e) {
    if (e.type !== "player") {
      $(this._futbinListFor).css("display", "none");
      return;
    }
    $(this._futbinListFor).css("display", "");
    setValue("selectedPlayer", e);
  };

  UTQuickListPanelView.prototype._generate = function _generate() {
    if (!this._generated) {
      let e = document.createElement("div");
      e.classList.add("ut-quick-list-panel-view");
      let t = document.createElement("div");
      t.classList.add("ut-button-group");
      this._btnToggle = new UTGroupButtonControl();
      this._btnToggle.getRootElement().classList.add("accordian");
      t.appendChild(this._btnToggle.getRootElement());
      this._futbinListFor = createElementFromHTML(
        generateButton(
          idListFutBin,
          "List for FUTBIN",
          () => {
            const selectedPlayer = getValue("selectedPlayer");
            selectedPlayer && listForFUTBIN(selectedPlayer);
          },
          "accordian"
        )
      );
      t.appendChild(this._futbinListFor);
      e.appendChild(t);
      this.__panelActions = document.createElement("div");
      this.__panelActions.classList.add("panelActions");
      this.__boughtPrice = document.createElement("div");
      this.__boughtPrice.classList.add("boughtPrice");
      this.__boughtPrice.classList.add("panelActionRow");
      this.__boughtPriceLabel = document.createElement("span");
      this.__boughtPriceLabel.classList.add("boughtPriceLabel");
      this.__boughtPrice.appendChild(this.__boughtPriceLabel);
      this.__boughtPriceValue = document.createElement("span");
      this.__boughtPriceValue.classList.add("currency-coins");
      this.__boughtPriceValue.classList.add("boughtPriceValue");
      this.__boughtPrice.appendChild(this.__boughtPriceValue);
      this.__panelActions.appendChild(this.__boughtPrice);
      let i = document.createElement("div");
      i.classList.add("panelActionRow");
      var o = document.createElement("div");
      o.classList.add("buttonInfoLabel");
      this.__minPriceLabel = document.createElement("span");
      this.__minPriceLabel.classList.add("spinnerLabel");
      o.appendChild(this.__minPriceLabel);
      this.__minPrice = document.createElement("span");
      this.__minPrice.classList.add("currency-coins");
      this.__minPrice.classList.add("bandingLabel");
      o.appendChild(this.__minPrice);
      i.appendChild(o);
      this._bidNumericStepper = new UTNumericInputSpinnerControl();
      i.appendChild(this._bidNumericStepper.getRootElement());
      this.__panelActions.appendChild(i);
      var n = document.createElement("div");
      n.classList.add("panelActionRow");
      var r = document.createElement("div");
      r.classList.add("buttonInfoLabel");
      this.__maxPriceLabel = document.createElement("span");
      this.__maxPriceLabel.classList.add("spinnerLabel");
      r.appendChild(this.__maxPriceLabel);
      this.__maxPrice = document.createElement("span");
      this.__maxPrice.classList.add("currency-coins");
      this.__maxPrice.classList.add("bandingLabel");
      r.appendChild(this.__maxPrice);
      n.appendChild(r);
      this._buyNowNumericStepper = new UTNumericInputSpinnerControl();
      n.appendChild(this._buyNowNumericStepper.getRootElement());
      this.__panelActions.appendChild(n);
      let s = document.createElement("div");
      s.classList.add("panelActionRow");
      this.__duration = document.createElement("div");
      this.__duration.classList.add("durationLabel");
      this.__duration.classList.add("buttonInfoLabel");
      s.appendChild(this.__duration);
      this._durationPicker = new UTDropDownControl();
      s.appendChild(this._durationPicker.getRootElement());
      this.__panelActions.appendChild(s);
      this._listButton = new UTStandardButtonControl();
      this._listButton.getRootElement().classList.add("call-to-action");
      this.__panelActions.appendChild(this._listButton.getRootElement());
      e.appendChild(this.__panelActions);
      this.__root = e;
      this._generated = !0;
    }
  };

  UTQuickListPanelViewController.prototype.renderView = function () {
    quickPanelRenderView.call(this);
    let e = this.getView();
    e.initFutBinEvent(this.item);
  };

  controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData =
    function _getPanelViewInstanceFromData(e, t) {
      panelViewFunc.call(this, e, t);
      setTimeout(() => {
        const binControl = $(".ut-numeric-input-spinner-control").last();
        const binInput = binControl.find(".numericInput");
        const panelDisplayStyle = $(".more").css("display");
        if ($(".more").length) {
          if (!$(`#${idViewFutBin}`).length) {
            if (!getValue("EnhancerSettings")["idHideViewFUTBIN"]) {
              $(
                generateButton(
                  idViewFutBin,
                  "View on FUTBIN",
                  async () => {
                    const selectedPlayer = getValue("selectedPlayer");
                    const playerUrl = await getFutbinPlayerUrl(selectedPlayer);
                    if (!playerUrl) {
                      sendUINotification(
                        "Unable to get futbin url",
                        UINotificationType.NEGATIVE
                      );
                    }
                    window.open(playerUrl, "_blank");
                  },
                  "accordian"
                )
              )
                .css("display", panelDisplayStyle)
                .insertAfter($(".more"));
            }
            if (!getValue("EnhancerSettings")["idHideSearchMinBin"]) {
              $(
                generateButton(
                  idSearchMinBin,
                  "Calculate Min BIN",
                  async () => {
                    const btnContxt = $(`#${idSearchMinBin}`);
                    btnContxt.prop("disabled", true);
                    btnContxt.text(`Calculate Min BIN`);
                    const selectedPlayer = getValue("selectedPlayer");
                    sendUINotification("Calculating Min BIN ....");
                    const playerMin = await calculatePlayerMinBin(selectedPlayer);
                    btnContxt.prop("disabled", false);
                    if (!playerMin) {
                      sendUINotification(
                        "Unable to calculate min bin",
                        UINotificationType.NEGATIVE
                      );
                      return;
                    }
                    btnContxt.text(`Average Min BIN - (${playerMin})`);
                  },
                  "accordian"
                )
              )
                .css("display", panelDisplayStyle)
                .insertAfter($(".more"));
            }
          }
          if ($(".panelActions").length && !$("#saleAfterTax").length) {
            $(
              `<div  class="buttonInfoLabel hasPriceBanding">
                  <span class="spinnerLabel">After Tax:</span>
                  <span id="saleAfterTax" class="currency-coins bandingLabel">Price: 10,000</span>
              </div>`
            ).insertAfter(binControl);
          }
        }
        binInput.val() &&
          calcTaxPrice(parseInt(binInput.val().replace(/[,.]/g, "")));
      });
    };

  const listForFUTBIN = (player) => {
    const futBinPercent = getValue("EnhancerSettings")["idFutBinPercent"];
    listPlayerForFutBIN(player, futBinPercent);
  };

  const listPlayerForFutBIN = async (player, futBinPercent) => {
    const existingValue = getValue(player.definitionId);
    if (existingValue) {
      listPlayer(player, existingValue.price, futBinPercent);
      return;
    }

    const platform = getUserPlatform();

    const futBinResponse = await fetchPricesFromFutBin(
      player.definitionId,
      [],
      3
    );
    try {
      if (futBinResponse.status === 200) {
        const futBinPrices = JSON.parse(futBinResponse.responseText);
        if (futBinPrices[player.definitionId]) {
          const futbinLessPrice =
            futBinPrices[player.definitionId] &&
            futBinPrices[player.definitionId].prices[platform].LCPrice;
          const cacheValue = {
            expiryTimeStamp: new Date(Date.now() + 15 * 60 * 1000),
            price: futbinLessPrice,
          };
          setValue(player.definitionId, cacheValue);

          listPlayer(player, futbinLessPrice, futBinPercent);
        }
      }
    } catch (err) {}
  };

  const listPlayer = async (player, price, futBinPercent) => {
    await wait(getRandWaitTime("1-2"));
    await listForPrice(price, player, futBinPercent);
  };
};
