import { addBtnListner } from '../utils/commonUtil'
import { sendUINotification } from '../utils/notificationUtil'

export const playerViewPanelOverride = () => {
  const panelViewFunc =
    controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData

  controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData =
    function _getPanelViewInstanceFromData (e, t) {
      panelViewFunc.call(this, e, t)
      setTimeout(() => {
        if (jQuery('.more').length) {
          if (!jQuery('#btnSbcApplicable').length) {
            jQuery(
              `<button
            id="btnSbcApplicable">
            <span class="btn-text">Find Sbcs</span><span class="btn-subtext"></span>
            </button>`
            ).insertAfter(jQuery('.more'))
          }
        }
      })
    }

  addBtnListner('#btnSbcApplicable', () => {
    sendUINotification(
      'Not implemented yet !!!',
      enums.UINotificationType.NEGATIVE
    )
  })
}
