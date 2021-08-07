import { addBtnListner, hideLoader, showLoader } from '../utils/commonUtil'
import { getSbcPlayersInfoFromFUTBin } from '../services/futbin'
import { sendUINotification } from '../utils/notificationUtil'
import { getPlayersForSbc } from '../services/club'

export const sbcViewOverride = () => {
  const squladDetailPanelView = UTSBCSquadDetailPanelView.prototype.render

  UTSBCSquadDetailPanelView.prototype.render = function (...params) {
    squladDetailPanelView.call(this, ...params)
    setTimeout(() => {
      if (!jQuery('.futBinFill').length) {
        jQuery('.challenge-content').append(
          jQuery(
            `<div class="futBinFill" >
              <input id="squadId" type="text" class="ut-text-input-control futBinId" placeholder="FutBin Id">
                <button id="squadFillFutBin" class="btn-standard call-to-action">
                    Auto Fill
                </button>
            </div>
          `
          )
        )
      }
    })
  }

  addBtnListner('#squadFillFutBin', async () => {
    const squadId = jQuery('#squadId').val()
    if (!squadId) {
      sendUINotification(
        'Squad Id is missing !!!',
        enums.UINotificationType.NEGATIVE
      )
      return
    }

    showLoader()

    const playerPositionIds = await getSbcPlayersInfoFromFUTBin(squadId)
    const squadPlayers = await getPlayersForSbc(playerPositionIds)

    const { _squad, _challenge } = getAppMain()
      .getRootViewController()
      .getPresentedViewController()
      .getCurrentViewController()
      .getCurrentController()._leftController

    const sbcSlots = _squad.getSBCSlots()

    const positionIndexes = sbcSlots.reduce((acc, curr) => {
      if (!curr.position) return acc

      if (!acc[curr.position.typeName]) {
        acc[curr.position.typeName] = []
      }
      acc[curr.position.typeName].push(curr.index)
      return acc
    }, {})

    const playersToAdd = []

    const adjustPlayerPostion = (playerId, playerPosition) => {
      if (positionIndexes[playerPosition]) {
        if (positionIndexes[playerPosition].length) {
          const positions = positionIndexes[playerPosition]
          playersToAdd[parseInt(positions[0], 10)] = squadPlayers[playerId]
          positions.splice(0, 1)
        }
        if (!positionIndexes[playerPosition].length) {
          delete positionIndexes[playerPosition]
        }
        delete playerPositionIds[playerId]
      }
    }

    for (const playerId in playerPositionIds) {
      const playerPosition = playerPositionIds[playerId]
      adjustPlayerPostion(playerId, playerPosition)
    }

    for (const playerId in playerPositionIds) {
      const playerPosition = Object.keys(positionIndexes)[0]
      adjustPlayerPostion(playerId, playerPosition)
    }

    _squad.setPlayers(playersToAdd, true)

    services.SBC.saveChallenge(_challenge)

    hideLoader()
  })
}
