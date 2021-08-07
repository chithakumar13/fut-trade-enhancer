import { clubSearchOverride } from './clubsearch-override'
import { transferHubOverride } from './transferhub-override'
import { transferResultOverride } from './transferresult-override'
import { transferSearchOverride } from './transfersearch-override'
import { unassignedOverride } from './unassigned-override'
import { playerViewPanelOverride } from './playerviewpanel-override'
import { overrideStyle } from './cssoverrides'
import { sbcViewOverride } from './sbcview-override'
import { transferListOverride } from './transferlist-override'

export const initOverrides = () => {
  unassignedOverride()
  clubSearchOverride()
  transferHubOverride()
  transferResultOverride()
  transferSearchOverride()
  playerViewPanelOverride()
  sbcViewOverride()
  transferListOverride()
  overrideStyle()
}
