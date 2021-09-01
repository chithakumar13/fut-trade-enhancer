import { wait } from "../utils/commonUtil";

export const getConceptPlayers = function (playerId) {
  return new Promise((resolve, reject) => {
    const searchCriteria = new viewmodels.BucketedItemSearch().searchCriteria;
    if (playerId) {
      searchCriteria.defId = [playerId];
    }
    const gatheredPlayers = [];

    const getAllConceptPlayers = () => {
      searchConceptPlayers(searchCriteria).observe(
        this,
        async function (sender, response) {
          gatheredPlayers.push(...response.data.items);
          if (response.status !== 400 && !response.data.endOfList) {
            searchCriteria.offset += searchCriteria.count;
            await wait(1);
            getAllConceptPlayers();
          } else {
            resolve(gatheredPlayers);
          }
        }
      );
    };
    getAllConceptPlayers();
  });
};

const searchConceptPlayers = (searchCriteria) => {
  return services.Item.searchConceptItems(searchCriteria);
};
