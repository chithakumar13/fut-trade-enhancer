const app = feathers();
const analyticsEndPoint = "https://futhelpers.com";
const apiEndPoint = "api/v1/";
const socket = io(analyticsEndPoint);

app.configure(feathers.socketio(socket));
app.configure(feathers.authentication());

export const trackMarketPrices = (playerPrices) => {
  app.service(apiEndPoint + "auctions").create(playerPrices);
};

export const trackPlayers = (players) => {
  app.service(apiEndPoint + "players").create(players);
};
