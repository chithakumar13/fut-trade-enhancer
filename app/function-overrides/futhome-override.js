import { MessageTileView } from "../view/MessageTileView";
import { imageLogos } from "../image.constants";
import { formMessage } from "../utils/homeMessageUtil";
import { showPopUp } from "./popup-override";

const getScriptMessages = () => {
  const persona = services.User.getUser().getSelectedPersona();
  const messages = [];

  const message1 = formMessage(
    atob("VGhhbmtzIGZvciBpbnN0YWxsaW5nIHRoZSBzY3JpcHQ="),
    atob(
      "VGhpcyBpcyBhIGZyZWUgdG8gdXNlIHNjcmlwdCAhISEsIGdldCB5b3VyIG1vbmV5IGJhY2sgaWYgc29tZW9uZSBzb2xkIGl0IHRvIHlvdQ=="
    ),
    atob("aW1hZ2VzL3RpbGVGRVREZWZhdWx0LnBuZw=="),
    atob("d2VsY29tZWh1Yg==")
  );

  const message2 = formMessage(
    atob("RW5qb3lpbmcgdGhlIHNjcmlwdCwgY2xpY2sgdG8gZG9uYXRl"),
    atob(
      "Q29uc2lkZXIgYSBkb25hdGlvbiB0byBzdXBwb3J0IGZ1dHVyZSBlbmhhbmNlbWVudHM="
    ),
    imageLogos,
    atob("c3VwcG9ydGh1Yg==")
  );
  messages.push(new UTArubaMessageEntity(message1, persona));
  messages.push(new UTArubaMessageEntity(message2, persona));
  return messages;
};

const clickOption = () => {
  showPopUp(
    [
      atob("UGF5cGFs"),
      atob("WW91dHViZSBTdWJzY3JpcHRpb24="),
      atob("UGF0cmVvbg=="),
    ],
    atob("RG9uYXRpb24gb3B0aW9u"),
    atob(
      "QmVsb3cgYXJlIHRoZSBsaXN0IG9mIHdheXMgdG8gY29udHJpYnV0ZSB0byB0aGUgcHJvamVjdCwgY2xpY2sgb24gYW55IG9mIHRoZSBiZWxvdyBvcHRpb25zIHRvIHNob3cgeW91ciBzdXBwb3J0"
    ),
    (t) => {
      if (t === atob("UGF5cGFs")) {
        window.open(
          atob("aHR0cHM6Ly93d3cucGF5cGFsLmNvbS9wYXlwYWxtZS9ja2FsZ29z"),
          atob("X2JsYW5r")
        );
      } else if (t === atob("WW91dHViZSBTdWJzY3JpcHRpb24=")) {
        window.open(
          atob(
            "aHR0cHM6Ly93d3cueW91dHViZS5jb20vY2hhbm5lbC9VQzVlTGtqbUxVMlRjRTRvaUpNOVBzeUE/c3ViX2NvbmZpcm1hdGlvbj0x"
          ),
          atob("X2JsYW5r")
        );
      } else if (t === atob("UGF0cmVvbg==")) {
        window.open(
          atob("aHR0cHM6Ly93d3cucGF0cmVvbi5jb20vaV9tX2NrMTM="),
          atob("X2JsYW5r")
        );
      }
    }
  );
};

export const futHomeOverride = () => {
  const homeHubInit = UTHomeHubView.prototype.init;

  UTHomeHubView.prototype.init = function () {
    homeHubInit.call(this);
    this._scriptMessageTile.init();
  };

  MessageTileView.prototype._tapDetected = function (e) {
    if (this._isTouchTargetValid(e.target)) {
      var t = this._data[this._tnsCarousel.getCurrentSlide()];
      if (t.screen === "supporthub") {
        clickOption();
        return;
      } else if (t.screen === "welcomehub") {
        window.open(
          atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9pbnZpdGUvQUhxZENXUnc2OQ=="),
          atob("X2JsYW5r")
        );
        return;
      }
      JSUtils.isEmpty(t.goToLink) || this._handleLink(t);
    }
  };

  MessageTileView.prototype._imageLoad = function _imageLoad(e, t, i) {
    if (
      (e.unobserve(this),
      t ||
        i.setLocalResource(
          i.src.startsWith("data:image")
            ? i.src
            : atob("aW1hZ2VzL3RpbGVGRVREZWZhdWx0LnBuZw==")
        ),
      ++this._loadedImages >= this._data.length &&
        (this.removeClass("loading-images"), !this._tnsCarousel.isOn()))
    ) {
      var o = new TNSPropertiesDTO();
      (o.nav = !0),
        (o.controls = !1),
        (o.loop = !0),
        (o.autoplay = !0),
        (o.autoplaySpeed = 4e3),
        (o.container = this._tnsCarousel.getRootElement()),
        this._tnsCarousel.setup(o),
        1 < this._data.length &&
          this._tnsCarousel.afterChange(this._onSlideFadeOut.bind(this));
    }
  };

  UTHomeHubView.prototype.renderHubMessagesTile = function (e) {
    this._hubMessagesTile.setData(e);
    this._scriptMessageTile.setData(getScriptMessages());
  };

  UTHomeHubView.prototype._generate = function generate() {
    if (!this._generated) {
      var e = document.createElement("div"),
        t = document.createElement("div");
      t.classList.add("grid"),
        t.classList.add("layout-hub"),
        (this._scriptMessageTile = new MessageTileView()),
        this._scriptMessageTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._scriptMessageTile.getRootElement()),
        (this._unassignedTile = new UTUnassignedTileView()),
        this._unassignedTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._unassignedTile.getRootElement()),
        (this._futChampionsTile = new UTChampionsTileView()),
        this._futChampionsTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._futChampionsTile.getRootElement()),
        (this._squadBattlesTile = new UTSquadBattlesTileView()),
        this._squadBattlesTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._squadBattlesTile.getRootElement()),
        (this._futRivalsTile = new UTRivalsTileView()),
        this._futRivalsTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._futRivalsTile.getRootElement()),
        (this._playerPicksTile = new UTPlayerPicksTileView()),
        this._playerPicksTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._playerPicksTile.getRootElement()),
        (this._objectivesTile = new UTObjectivesHubTileView()),
        this._objectivesTile.getRootElement().classList.add("col-1-2"),
        this._objectivesTile
          .getRootElement()
          .classList.add("ut-tile-hub-objective"),
        t.appendChild(this._objectivesTile.getRootElement()),
        (this._sbcTile = new UTGraphicalInfoTileView()),
        this._sbcTile.getRootElement().classList.add("col-1-2"),
        this._sbcTile.getRootElement().classList.add("ut-tile-hub-sbc"),
        t.appendChild(this._sbcTile.getRootElement()),
        (this._hubMessagesTile = new UTHubMessagesTileView()),
        this._hubMessagesTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._hubMessagesTile.getRootElement()),
        (this._transferListTile = new UTTransfersTileView()),
        this._transferListTile.getRootElement().classList.add("col-1-2"),
        this._transferListTile
          .getRootElement()
          .classList.add("ut-tile-transfer-list"),
        t.appendChild(this._transferListTile.getRootElement()),
        (this._customizeTile = new UTGraphicalInfoTileView()),
        this._customizeTile.getRootElement().classList.add("col-1-2"),
        this._customizeTile
          .getRootElement()
          .classList.add("ut-tile-hub-customize"),
        t.appendChild(this._customizeTile.getRootElement()),
        (this._activeSquadTile = new UTSquadTileView()),
        this._activeSquadTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._activeSquadTile.getRootElement()),
        (this._weekendLeagueProgress = new UTWeekendLeagueProgressView()),
        this._weekendLeagueProgress.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._weekendLeagueProgress.getRootElement()),
        (this._leaderboardsTile = new UTLeaderboardsTileView()),
        this._leaderboardsTile.getRootElement().classList.add("col-1-1"),
        t.appendChild(this._leaderboardsTile.getRootElement()),
        e.appendChild(t),
        (this.__root = e),
        (this._generated = !0);
    }
  };
};
