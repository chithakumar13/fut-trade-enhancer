import { Formations } from "../../formations.json";
import {
  idBuySBCPlayers,
  idFillSBC,
  idSBCBuyFutBinPercent,
  idSBCPlayersToBuy
} from "../app.constants";
import { getPlayersForSbc } from "../services/club";
import { getSbcPlayersInfoFromFUTBin } from "../services/futbin";
import { getValue, setValue } from "../services/repository";
import { getUserPlatform } from "../services/user";
import {
  getRandNum,
  getRandWaitTime,
  hideLoader,
  showLoader,
  wait
} from "../utils/commonUtil";
import { addFutbinCachePrice } from "../utils/futbinUtil";
import { sendPinEvents, sendUINotification } from "../utils/notificationUtil";
import { getSellBidPrice, roundOffPrice } from "../utils/priceUtil";
import { generateButton } from "../utils/uiUtils/generateButton";
import { showPopUp } from "./popup-override";

export const sbcViewOverride = () => {
  const squladDetailPanelView = UTSBCSquadDetailPanelView.prototype.render;

  UTSBCSquadDetailPanelView.prototype.render = function (...params) {
    squladDetailPanelView.call(this, ...params);
    const sbcId = params.length ? params[0].id : "";
    setValue("squadId", sbcId);
    setTimeout(() => {
      if (!$(".futBinFill").length) {
        $(".challenge-content").append(
          $(
            `<div class="futBinFill" >
              <input id="squadId" type="text" class="ut-text-input-control futBinId" placeholder="FutBin Id" />
              ${generateButton(
                idFillSBC,
                "Auto Fill",
                async () => {
                  await fillSquad(getValue("squadId"));
                },
                "call-to-action"
              )}
            </div>
            ${generateButton(
              idBuySBCPlayers,
              "Buy Missing Players",
              () => {
                buyPlayersPopUp();
              },
              "call-to-action"
            )}
          `
          )
        );
      }
      if (getValue(sbcId)) {
        appendSquadTotal(getValue(sbcId).value);
      }
    });
  };
};

const buyPlayersPopUp = () => {
  const { _squad } = getAppMain()
    .getRootViewController()
    .getPresentedViewController()
    .getCurrentViewController()
    .getCurrentController()._leftController;

  const sbcPlayers = _squad.getPlayers();
  const conceptPlayers = sbcPlayers.filter(({ _item }) => _item.concept);

  if (!conceptPlayers.length) {
    sendUINotification(
      "No concept players found !!!",
      UINotificationType.NEGATIVE
    );
    return;
  }

  const playerNames = conceptPlayers.map(({ _item }) => _item._staticData.name);

  let filterMessage = `Bot will try to buy the following players <br /> <br />
  <select  multiple="multiple" class="sbc-players-list" id="${idSBCPlayersToBuy}"
      style="overflow-y : scroll">
      ${playerNames.map(
        (value) => `<option value='${value}'>${value}</option>`
      )}
   </select>
   <br />
   <br />
   FUTBIN Buy Percent
   <input placeholder="100" id=${idSBCBuyFutBinPercent} type="number" class="ut-text-input-control fut-bin-buy" placeholder="FUTBIN Sale Percent" />
   <br /> <br />
   `;

  showPopUp(
    [
      { labelEnum: enums.UIDialogOptions.OK },
      { labelEnum: enums.UIDialogOptions.CANCEL },
    ],
    "Buy Missing Players",
    filterMessage,
    (text) => {
      const futBinPercent =
        parseInt($(`#${idSBCBuyFutBinPercent}`).val()) || 100;
      text === 2 &&
        buyMissingPlayers(
          conceptPlayers.map(({ _item }) => _item),
          futBinPercent
        );
    }
  );
};

const buyMissingPlayers = async (conceptPlayers, futBinPercent) => {
  showLoader();
  sendUINotification("Trying the buy the message players");
  await addFutbinCachePrice(conceptPlayers);
  for (const player of conceptPlayers) {
    const existingValue = getValue(player.definitionId);
    if (existingValue && existingValue.price) {
      let parsedPrice = parseInt(existingValue.price.replace(/[,.]/g, ""));
      let calculatedPrice = roundOffPrice(
        (parsedPrice * futBinPercent) / 100,
        200
      );
      await buyPlayer(player, calculatedPrice);
      await wait(getRandWaitTime("3-5"));
    } else {
      sendUINotification(
        `Error fetching futbin Price for ${player._staticData.name}`,
        UINotificationType.NEGATIVE
      );
    }
  }
  sendUINotification("Operation completed");
  hideLoader();
};

const buyPlayer = (player, buyPrice) => {
  let numberOfAttempts = 3;
  let buySuccess = false;
  const searchCriteria = new UTSearchCriteriaDTO();
  const searchModel = new UTBucketedItemSearchViewModel();
  return new Promise(async (resolve) => {
    while (numberOfAttempts-- > 0) {
      sendPinEvents("Transfer Market Search");
      searchCriteria.type = SearchType.PLAYER;
      searchCriteria.defId = [player.definitionId];
      searchCriteria.category = SearchCategory.ANY;
      searchCriteria.minBid = roundOffPrice(
        getRandNum(0, getSellBidPrice(Math.min(buyPrice, 250)))
      );
      searchCriteria.maxBuy = buyPrice;

      searchModel.searchFeature = enums.ItemSearchFeature.MARKET;
      searchModel.defaultSearchCriteria.type = searchCriteria.type;
      searchModel.defaultSearchCriteria.category = searchCriteria.category;
      searchModel.updateSearchCriteria(searchCriteria);

      services.Item.clearTransferMarketCache();
      services.Item.searchTransferMarket(searchModel.searchCriteria, 1).observe(
        this,
        async function (sender, response) {
          if (response.success) {
            sendPinEvents("Transfer Market Results - List View");
            if (!response.data.items.length) {
              sendUINotification(
                `No card found for ${player._staticData.name}`,
                UINotificationType.NEGATIVE
              );
              return;
            }
            let currPlayer =
              response.data.items[response.data.items.length - 1];

            sendPinEvents("Item - Detail View");
            services.Item.bid(
              currPlayer,
              currPlayer._auction.buyNowPrice
            ).observe(this, async function (sender, data) {
              if (data.success) {
                sendUINotification(
                  `Buy success for ${player._staticData.name}`
                );
                numberOfAttempts = 0;
                buySuccess = true;
                services.Item.move(currPlayer, ItemPile.CLUB);
              } else {
                let status = (data.error?.code || data.status) + "";
                sendUINotification(
                  `Buy failed for ${player._staticData.name} -- reattempting ${
                    status == 461 ? "(Others won)" : ""
                  }`,
                  UINotificationType.NEGATIVE
                );
              }
            });
          } else {
            sendUINotification(
              `Search failed for ${player._staticData.name}`,
              UINotificationType.NEGATIVE
            );
          }
        }
      );
      await wait(getRandWaitTime("3-5"));
    }
    if (!buySuccess) {
      sendUINotification(
        `Buy failed for ${player._staticData.name}`,
        UINotificationType.NEGATIVE
      );
    }
    resolve();
  });
};

const getFormationType = (id) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://futbin.org/futbin/api/getSquadByID?squadId=${id}&platform=${getUserPlatform().toUpperCase()}`,
        onload: (res) => {
          if (res.status === 200) {
            resolve(JSON.parse(res.response).squad_data.Formation);
          } else {
            reject(res);
          }
        },
      });
    });
}

const fillSquad = async (sbcId) => {
  const squadId = $("#squadId").val();
  if (!squadId) {
    sendUINotification("Squad Id is missing !!!", UINotificationType.NEGATIVE);
    return;
  }

  showLoader();

  const playerPositionIds = await getSbcPlayersInfoFromFUTBin(squadId);
  const squadPlayers = await getPlayersForSbc(playerPositionIds);
  let squadTotal = 0;

  const { _squad, _challenge } = getAppMain()
    .getRootViewController()
    .getPresentedViewController()
    .getCurrentViewController()
    .getCurrentController()._leftController;

  const sbcSlots = _squad.getSBCSlots();

  const positionIndexes = sbcSlots.reduce((acc, curr) => {
    if (!curr.position) return acc;

    if (!acc[curr.position.typeName]) {
      acc[curr.position.typeName] = [];
    }
    acc[curr.position.typeName].push(curr.index);
    return acc;
  }, {});

  const playersToAdd = [];
  const formationName = await getFormationType(squadId)
  const adjustPlayerPostion = (playerId, playerPosition, futbinPositionId) => {
    if (positionIndexes[playerPosition]) {
      if (positionIndexes[playerPosition].length) {
        const positions = positionIndexes[playerPosition];
        const FutPosition = Formations[formationName][futbinPositionId]
        playersToAdd[FutPosition.fut] = squadPlayers[playerId];
        positions.splice(0, 1);
      }
      if (!positionIndexes[playerPosition].length) {
        delete positionIndexes[playerPosition];
      }
      delete playerPositionIds[playerId];
    }
  };

  for (const playerId in playerPositionIds) {
    const playerPosition = playerPositionIds[playerId];
    squadTotal += parseInt(playerPosition.price, 10) || 0;
    adjustPlayerPostion(playerId, playerPosition.position, parseInt(playerPositionIds[playerId].cardid, 10));
  }

  for (const playerId in playerPositionIds) {
    const playerPosition = Object.keys(positionIndexes)[0];
    adjustPlayerPostion(playerId, playerPosition);
  }

  _squad.setPlayers(playersToAdd, true);

  services.SBC.saveChallenge(_challenge);

  hideLoader();

  setValue(sbcId, {
    expiryTimeStamp: new Date(Date.now() + 15 * 60 * 1000),
    value: squadTotal.toLocaleString(),
  });
  appendSquadTotal(squadTotal.toLocaleString());
};

const appendSquadTotal = (total) => {
  if ($(".squadTotal").length) {
    $(".squadTotal").text(total);
  } else {
    $(
      `<div class="rating">
        <span class="ut-squad-summary-label">FUTBIN Squad Price</span>
        <div>
          <span class="ratingValue squadTotal currency-coins">${total}</span>
        </div>
      </div>
      `
    ).insertAfter($(".chemistry"));
  }
};
