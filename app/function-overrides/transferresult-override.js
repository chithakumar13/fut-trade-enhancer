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

const formRequestPayLoad = (e, platform) => {
  const {
    id,
    resourceId,
    _auction: { buyNowPrice, tradeId: auctionId, expires: expiresOn },
    _metaData: { id: assetId, skillMoves, weakFoot } = {},
    _attributes,
    _staticData: { firstName, knownAs, lastName, name } = {},
    nationId,
    leagueId,
    rareflag,
  } = e.getData();

  const expireDate = new Date();
  expireDate.setSeconds(expireDate.getSeconds() + expiresOn);
  const trackPayLoad = {
    resourceId,
    price: buyNowPrice,
    expiresOn: expireDate,
    id: id + "",
    assetId: assetId + "_" + platform + "_" + rareflag,
    auctionId,
    year: 21,
    updatedOn: new Date(),
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
    rareflag,
  };

  return { trackPayLoad, playerPayLoad };
};

export const transferResultOverride = () => {
  UTPaginatedItemListView.prototype._renderItems = function (o) {
    const n = this;
    const platform = getUserPlatform();
    const auctionPrices = [];
    const players = [];
    const enhancerSetting = getValue("EnhancerSettings");
    void 0 === o && (o = 0),
      this.listRows.forEach(function (e) {
        let t;
        const i =
          o === ((t = e.getData()) === null || void 0 === t ? void 0 : t.id);
        e.render(i);
        const rootElement = jQuery(e.getRootElement());
        const {
          type,
          contract,
          resourceId,
          _auction: { buyNowPrice, currentBid, startingBid },
          untradeable,
        } = e.getData();
        const retryCount = 5;
        const auctionElement = rootElement.find(".auction");
        let addFutBinPrice = enhancerSetting["idFutBinPrice"];
        if (auctionElement.attr("style")) {
          auctionElement.removeAttr("style");
          auctionElement.addClass("hideauction");
          addFutBinPrice = !untradeable;
        }
        if (auctionElement && type === "player") {
          rootElement.find(".ut-item-player-status--loan").text(contract);
          const { trackPayLoad, playerPayLoad } = formRequestPayLoad(
            e,
            platform
          );
          const bidPrice = enhancerSetting["idBidBargain"]
            ? currentBid || startingBid
            : null;
          if (trackPayLoad.price) auctionPrices.push(trackPayLoad);
          players.push(playerPayLoad);
          appendDuplicateTag(resourceId, rootElement);
          addFutBinPrice &&
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
