import { getValue } from "../services/repository";
import { getUserPlatform } from "../services/user";
import { fetchPricesFromFutBin } from "../services/futbin";
import { appendFutBinPrice } from "./common-override/appendFutBinPrice";
import { trackMarketPrices, trackPlayers } from "../services/analytics";

const appendDuplicateTag = (resourceId, rootElement) => {
  const squadMemberIds = getValue("SquadMemberIds");
  if (squadMemberIds && squadMemberIds.has(resourceId)) {
    rootElement.find(".rowContent").append(
      `<div class="show-duplicate active-tag">
            <div class="label-container">
              <span class="fut_icon icon_squad">
              </span>
              <span class="label">
              </span>
            </div>
        </div>`
    );
  }
};

export const transferResultOverride = () => {
  UTPaginatedItemListView.prototype._renderItems = function (o) {
    const n = this;
    const platform = getUserPlatform();
    const auctionPrices = [];
    const players = [];
    void 0 === o && (o = 0),
      this.listRows.forEach(function (e) {
        let t;
        const i =
          o === ((t = e.getData()) === null || void 0 === t ? void 0 : t.id);
        e.render(i);
        const rootElement = jQuery(e.getRootElement());
        const {
          id: marketId,
          resourceId,
          _auction: { buyNowPrice, tradeId: auctionId, expires: expiresOn },
          _metaData: { id: assetId, skillMoves, weakFoot },
          _attributes,
          _staticData: { firstName, knownAs, lastName, name },
          nationId,
          leagueId,
          type,
        } = e.getData();
        const retryCount = 5;
        const auctionElement = rootElement.find(".auction");
        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + expiresOn);
        const trackPayLoad = {
          resourceId,
          price: buyNowPrice,
          expiresOn: expireDate,
          marketId,
          platform,
          type,
          auctionId,
          assetId,
          year: 21,
        };
        const playerPayLoad = {
          _id: resourceId,
          nationId,
          leagueId,
          staticData: { firstName, knownAs, lastName, name },
          skillMoves,
          weakFoot,
          assetId,
          attributes: _attributes,
          year: 21,
        };
        rootElement
          .find(".ut-item-player-status--loan")
          .text(e.getData().contract);
        if (
          auctionElement &&
          type === "player" &&
          !auctionElement.attr("style")
        ) {
          auctionPrices.push(trackPayLoad);
          players.push(playerPayLoad);
          appendDuplicateTag(resourceId, rootElement);
          fetchPricesFromFutBin(resourceId, retryCount).then((res) => {
            if (res.status === 200) {
              appendFutBinPrice(
                resourceId,
                buyNowPrice,
                platform,
                res.responseText,
                auctionElement,
                rootElement
              );
            }
          });
        }
        n.__itemList.appendChild(e.getRootElement());
      }),
      this.noResultsView &&
        this.listRows.length > 0 &&
        (this.noResultsView.dealloc(), (this.noResultsView = null));

    if (auctionPrices.length) {
      trackMarketPrices(auctionPrices);
      trackPlayers(players);
    }
  };
};
