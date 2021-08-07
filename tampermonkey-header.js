module.exports = {
  headers: {
    name: "FUT Trade Enhancer",
    namespace: "http://tampermonkey.net/",
    version: "1.0.0",
    description: "FUT Trade Enhancer",
    author: "CK Algos",
    match: [
      "https://www.ea.com/*/fifa/ultimate-team/web-app/*",
      "https://www.ea.com/fifa/ultimate-team/web-app/*",
    ],
    grant: ["GM_xmlhttpRequest", "GM_download"],
    connect: ["ea.com", "ea2.com", "futbin.com"],
    require: [
      "https://unpkg.com/@feathersjs/client@4.5.11/dist/feathers.js",
      "https://unpkg.com/socket.io-client@2.4.0/dist/socket.io.js",
    ],
  },
};
