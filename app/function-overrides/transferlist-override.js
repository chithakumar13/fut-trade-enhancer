import { fetchPricesFromFutBin } from "../services/futbin";
import { getUserPlatform } from "../services/user";
import { appendFutBinPrice } from "./common-override/appendFutBinPrice";

export const transferListOverride = () => {
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
          } = e.getData();
          const retryCount = 5;
          const auctionElement = rootElement.find(".auction");
          if (auctionElement.attr("style")) {
            auctionElement.removeAttr("style");
            auctionElement.addClass("hideauction");
          }
          const bidPrice = currentBid || startingBid;
          if (auctionElement && type === "player") {
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
