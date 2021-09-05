export const overrideStyle = () => {
  const style = document.createElement("style");
  style.innerText = `
    .player-stats-data-component ul { 
      display: grid;   
      grid-template-columns: 1fr 1fr 1fr; 
      grid-template-rows: 1fr; 
      width: 78px; 
    }
    .SearchResults.ui-layout-left>.paginated-item-list>ul{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(25,1fr);
    }
    .SearchResults.ui-layout-left .player .ut-item-player-status--loan,
    .phone .SearchResults .player .ut-item-player-status--loan{
      display: block;
      background: #4d42f5;
    }
    .ut-split-view {
      padding: 0;
    }
    .ui-layout-left .listFUTItem .auction{
      top: 3% !important;      
      width: 37% !important;
      right: .5rem;
    }
    .auction.show {
      display: block !important;
    }
    .auction.show .auctionValue,
    .auction.show .auction-state{
      display: none !important;
    }
    .auction.show .futbinprice{
      display: block !important;
    }
    .SearchResults.ui-layout-left .listFUTItem.futbinLessPrice .rowContent,
    .phone .SearchResults .listFUTItem.futbinLessPrice .rowContent{
      background-color: blue;
      animation: 4s infinite glow;
    }
    .SearchResults.ui-layout-left .listFUTItem.expired .rowContent, 
    .phone .SearchResults .listFUTItem.expired .rowContent,
    .SearchResults.ui-layout-left .listFUTItem.highest-bid .rowContent, 
    .phone .SearchResults .listFUTItem.highest-bid .rowContent,
    .SearchResults.ui-layout-left .listFUTItem.outbid .rowContent, 
    .phone .SearchResults .listFUTItem.outbid .rowContent,
    .SearchResults.ui-layout-left .listFUTItem.won .rowContent
    .phone .SearchResults .listFUTItem.won .rowContent{
      background-color: #0d0f26;
      animation: none !important;
    }
    @keyframes glow {
      33% {
        background-color: red;
      }
      66% {
        background-color: blue;
      }
      100% {
        background-color: purple;
      }
    }
    @media (min-width: 1281px) {
      .ut-split-view .ut-content {
        max-width: 100%;
        max-height: 100%;
      }
    }
    @media (min-width: 1600px) {
      .SearchResults.ui-layout-left>.paginated-item-list>ul {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: repeat(17,1fr);
      }
    }
    .downloadClub {
      background-color: #7e42f5;
      border-color: transparent;
      color: #29ffc9;
      margin-right: 10px
    }
    .ut-list-header-action {
      display: flex
    }
    .SearchResults.ui-layout-left .listFUTItem .show-duplicate,
    .phone .SearchResults .listFUTItem .show-duplicate {
      right: auto !important;
      left: 15px!important;
      display: block;
    }
    .ui-layout-right .futbinprice{
      display:none;
    }
    .futBinFill { 
      display: flex; 
      justify-content: space-evenly;
    }
    .futBinId {
      flex-basis: 50%;
    }
    .phone .listFUTItem .auction>.auction-state, 
    .phone .listFUTItem .auction>.auctionStartPrice, 
    .phone .listFUTItem .auction>.auctionValue {
      flex: 1 1 28%;
      overflow: hidden;
    }
    html[dir=ltr]
    .phone .listFUTItem .auction {
      right: 0px;
    }
    html[dir=ltr] 
    .listFUTItem .auction.show {
      left: auto
    }
    .phone .auction.show {
      right: 2rem !important;
    }
    .enhancer-option-header {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .enhancer-toggle {
      width: 49% !important;
    }
    .phone .enhancer-toggle {
      width: 100% !important;
    }
    .enhancer-toggle .ut-toggle-cell-view {
      justify-content: center;
    }
    .hide {
      display: none;
    }
    .hideauction .auctionValue,
    .hideauction .auction-state {
      display: none;
    } 
    .hideauction .futbinprice,
    .auction.hideauction,
    .show {
      display: unset !important
    }
    .relistFut {
      margin-right: 10px;
      display: none;
    }
    .button--loading .button__text {
      visibility: hidden;
      opacity: 0;
    }
    .button-spinner {
      position: relative;
    }
    .button--loading::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border: 4px solid transparent;
      border-top-color: #29ffc9;
      border-radius: 50%;
      animation: button-loading-spinner 1s ease infinite;
    }
    
    @keyframes button-loading-spinner {
      from {
        transform: rotate(0turn);
      }
    
      to {
        transform: rotate(1turn);
      }
    }    
    `;
  document.head.appendChild(style);
};
