import { MAX_CLUB_SEARCH, MAX_MARKET_SEARCH } from '../app.constants'

export const transferSearchOverride = () => {
  const transferSearch = services.Item.searchTransferMarket

  services.Item.searchTransferMarket = function (...params) {
    getAppMain().getConfigRepository().configs.itemsPerPage = {
      club: MAX_CLUB_SEARCH,
      transferMarket: MAX_MARKET_SEARCH
    }
    return transferSearch.call(this, ...params)
  }
}
