import { setValue } from "../services/repository";
import { getSquadPlayerIds } from "../services/club";
import { initSearchOptionView } from "../view/SearchOptionsView";

export const transferHubOverride = () => {
  const transferTile =
    UTTransfersHubViewController.prototype._requestTransferTargetData;

  UTTransfersHubViewController.prototype._requestTransferTargetData =
    function () {
      transferTile.call(this);
      getSquadPlayerIds().then((memberIds) => {
        setValue("SquadMemberIds", memberIds);
      });
    };

  initSearchOptionView();
};
