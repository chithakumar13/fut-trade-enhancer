import { generateToggleInput } from "../utils/uiUtils/generateToggleInput";
import { idFutBinPrice, idBidBargain, idHideBinPop } from "../app.constants";

export const initSearchOptionView = () => {
  const updateInterface = function () {
    let isSearchViewLoaded = false;
    if (
      services.Localization &&
      jQuery("h1.title").html() ===
        services.Localization.localize("navbar.label.search")
    ) {
      isSearchViewLoaded = true;
    }

    if (isSearchViewLoaded && jQuery(".search-prices").length) {
      if (jQuery(".search-prices").first().length) {
        {
          if (!jQuery("#ab_page_number").length) {
            jQuery(".search-prices").first().append(`<div> 
                            <div class="enhancer-option-header"> 
                                   <h1>Enhancer Options:</h1>
                            </div>
                            ${generateToggleInput(
                              "Show FutBin Price",
                              { idFutBinPrice },
                              "Shows Futbin Price and marks Bargains",
                              true,
                              "enhancer-toggle"
                            )}
                            ${generateToggleInput(
                              "Mark Bid Bargains",
                              { idBidBargain },
                              "Highlights Bargains based on current bid",
                              false,
                              "enhancer-toggle"
                            )}
                            ${generateToggleInput(
                              "Hide Bin Popup",
                              { idHideBinPop },
                              "Automatically confirms the Bin popup",
                              false,
                              "enhancer-toggle"
                            )}
                    </div>`);
          }
        }
      }
    } else {
      setTimeout(updateInterface, 1000);
    }
  };

  updateInterface();
};
