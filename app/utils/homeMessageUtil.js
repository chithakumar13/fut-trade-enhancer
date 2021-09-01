export const formMessage = (title, body, bodyImage, screen = "webfuthub") => {
  return {
    displayTime: 60,
    doNotDisplay: "0",
    priority: 1,
    promotions: [],
    renders: [
      {
        attributes: {
          alignment: "",
          colour: "6542329",
          countdownTime: "",
          highlightColour: "",
          renderType: "",
          size: "",
          style: "",
        },
        name: "titleText",
        type: "TEXT",
        value: title,
      },
      {
        attributes: {
          alignment: "",
          colour: "6542329",
          countdownTime: "",
          highlightColour: "",
          renderType: "",
          size: "",
          style: "",
        },
        name: "bodyText",
        type: "TEXT",
        value: body,
      },
      {
        attributes: {
          alignment: "",
          colour: "6542329",
          countdownTime: "",
          highlightColour: "",
          renderType: "",
          size: "",
          style: "",
        },
        name: "bodyImage",
        type: "IMAGE",
        value: bodyImage,
      },
    ],
    screen,
    tmtLink: "gotosbc",
    subtype: "FIFA_BANNER_MESSAGE",
    trackurls: {},
  };
};
