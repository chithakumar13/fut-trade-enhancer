let unassignedCount = null

const updateUnAssignedFromUser = function () {
  const { authDelegate, requestDelegate } = services.User.userDao
  const userRequestDelegate = new UTHttpRequest(authDelegate)
  userRequestDelegate.setPath('/ut/game/' + GAME_NAME + '/usermassinfo')
  userRequestDelegate.observe(this, function (e, unassignedResponse) {
    const count = unassignedResponse.response?.userInfo?.unassignedPileSize
    if (count) {
      unassignedCount = count
      this.getView().renderUnassignedTile(count)
    }
  })
  requestDelegate.send(userRequestDelegate)
}

export const unassignedOverride = () => {
  const setUnassignedItems =
    UTItemDomainRepository.prototype.setUnassignedItems

  UTItemDomainRepository.prototype.setUnassignedItems = function (...params) {
    setUnassignedItems.call(this, ...params)
  }

  UTHomeHubViewController.prototype._onUnassignedItemsRequested = function (
    observer,
    response
  ) {
    observer.unobserve(this)
    if (response.success) {
      this.getView().renderUnassignedTile(
        unassignedCount || response.data.items.length
      )
      if (!unassignedCount && unassignedCount !== 0) {
        updateUnAssignedFromUser.call(this)
      }
    } else {
      NetworkErrorManager.checkCriticalStatus(t.status) &&
        NetworkErrorManager.handleStatus(t.status)
    }
  }
}
