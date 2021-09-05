import { idResetFutBin } from "../app.constants";
import { fetchPricesFromFutBin } from "../services/futbin";
import { getUserPlatform } from "../services/user";
import {
  createElementFromHTML,
  getRandWaitTime,
  wait,
} from "../utils/commonUtil";
import { sendUINotification } from "../utils/notificationUtil";
import { getSellBidPrice, roundOffPrice } from "../utils/priceUtil";
import { generateButton } from "../utils/uiUtils/generateButton";
import { appendFutBinPrice } from "./common-override/appendFutBinPrice";

export const transferListOverride = () => {
  const applicableHeader = new Set(["Add Player", "Re-list All"]);
  UTSectionedTableHeaderView.prototype._generate = function _generate() {
    if (!this._generated) {
      var e = document.createElement("header");
      e.classList.add("ut-section-header-view");
      this.__text = document.createElement("h2");
      this.__text.classList.add("title");
      e.appendChild(this.__text);
      this._optionButton = new UTStandardButtonControl();
      this._optionButton.getRootElement().classList.add("section-header-btn");
      this._optionButton.getRootElement().classList.add("mini");
      this._optionButton.getRootElement().classList.add("call-to-action");
      this._optionRelist = createElementFromHTML(
        generateButton(
          idResetFutBin,
          "Re-list FUTBIN",
          () => {},
          "button-spinner section-header-btn mini call-to-action relistFut"
        )
      );
      e.appendChild(this._optionRelist);
      e.appendChild(this._optionButton.getRootElement());
      this.__root = e;
      this._generated = !0;
    }
  };

  UTSectionedTableHeaderView.prototype.setButtonText = function (header) {
    this._optionButton.setText(header);
    if (this._optionRelist) {
      if (!applicableHeader.has(header)) {
        this._optionRelist.classList.add("hide");
        return;
      }
      this._optionRelist.addEventListener("click", () => {
        onrelistFutBin(header);
      });
    }
  };

  UTSectionedTableHeaderView.prototype.showButton = function () {
    this._optionButton.show();
    this._optionRelist &&
      !this._optionRelist.classList.contains("hide") &&
      this._optionRelist.classList.add("show");
  };

  const onrelistFutBin = function (sectionHeader) {
    services.Item.requestTransferItems().observe(
      this,
      async function (t, response) {
        if (sectionHeader === "Re-list All") {
          let unSoldItems = response.data.items.filter(function (item) {
            var t = item.getAuctionData();
            return (
              item.type === "player" &&
              (t.isExpired() || (t.isValid() && t.isInactive()))
            );
          });

          listCardForFutBIN(unSoldItems);
        } else if (sectionHeader === "Add Player") {
          const availableItems = response.data.items.filter(function (item) {
            return item.type === "player" && !item.getAuctionData().isValid();
          });
          listCardForFutBIN(availableItems);
        }
      }
    );
  };

  const listCardForFutBIN = async (players) => {
    const platform = getUserPlatform();
    const futBinPercent = 95;
    if (!players.length) {
      sendUINotification(
        "No players found to be listed",
        enums.UINotificationType.NEGATIVE
      );
      return;
    }
    sendUINotification("Listing the players for FUTBIN price");
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      try {
        const futBinResponse = await fetchPricesFromFutBin(
          player.resourceId,
          3
        );
        if (futBinResponse.status === 200) {
          const futBinPrices = JSON.parse(futBinResponse.responseText);
          let sellPrice = parseInt(
            futBinPrices[player.resourceId].prices[platform].LCPrice.replace(
              /[,.]/g,
              ""
            )
          );
          if (sellPrice) {
            const calculatedPrice = roundOffPrice(
              (sellPrice * futBinPercent) / 100
            );
            services.Item.list(
              player,
              getSellBidPrice(calculatedPrice),
              calculatedPrice,
              3600
            );
            await wait(getRandWaitTime("3-8"));
          }
        }
      } catch (err) {}
    }
    sendUINotification("Listing the players completed");
  };

  UTSectionedItemList.prototype.render = function () {
    const t = this;
    const platform = getUserPlatform();
    this.listRows.length === 0
      ? this.showEmptyMessage()
      : (this.removeEmptyMessage(),
        this.listRows.forEach(function (e) {
          e.render();
          const rootElement = jQuery(e.getRootElement());
          const {
            resourceId,
            _auction: { buyNowPrice, currentBid, startingBid },
            type,
            untradeable,
          } = e.getData();
          const retryCount = 5;
          const auctionElement = rootElement.find(".auction");
          if (auctionElement.attr("style")) {
            auctionElement.removeAttr("style");
            auctionElement.addClass("hideauction");
          }
          const bidPrice = currentBid || startingBid;
          if (auctionElement && type === "player" && !untradeable) {
            fetchPricesFromFutBin(resourceId, retryCount).then((res) => {
              if (res.status === 200) {
                appendFutBinPrice(
                  resourceId,
                  buyNowPrice,
                  bidPrice,
                  platform,
                  res.responseText,
                  auctionElement,
                  rootElement
                );
              }
            });
          }

          t.__list.appendChild(e.getRootElement());
        }));
  };
};
