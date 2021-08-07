export const appendFutBinPrice = (
  resourceId,
  buyNowPrice,
  platform,
  response,
  auctionElement,
  rootElement
) => {
  const futBinPrices = JSON.parse(response)
  let futbinLessPrice = futBinPrices[resourceId].prices[platform].LCPrice
  auctionElement.prepend(`
      <div class="auctionValue futbinprice">
        <span class="label">FUT Bin</span>
        <span class="currency-coins value">${futbinLessPrice || '---'}</span>
      </div>`)
  if (futbinLessPrice) {
    futbinLessPrice = futbinLessPrice.toString().replace(/[,.]/g, '')
    if (buyNowPrice) {
      futbinLessPrice > buyNowPrice && rootElement.addClass('futbinLessPrice')
    }
  }
}
