export const addBtnListner = (selector, callback) => {
  jQuery(document).on(
    {
      mouseenter: function () {
        jQuery(selector).addClass("hover");
      },
      mouseleave: function () {
        jQuery(selector).removeClass("hover");
      },
      click: callback,
      touchend: callback,
    },
    selector
  );
};

export const downloadCsv = (csvContent, fileName) => {
  const encodedUri =
    "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
};

export const wait = async (seconds = 1) => {
  const rndFactor = Math.floor(Math.random());
  await new Promise((resolve) =>
    setTimeout(resolve, (rndFactor + seconds) * 1000)
  );
};

export const showLoader = () => {
  jQuery(".ut-click-shield").addClass("showing");
  jQuery(".loaderIcon ").css("display", "block");
};

export const hideLoader = () => {
  jQuery(".ut-click-shield").removeClass("showing");
  jQuery(".loaderIcon ").css("display", "none");
};

export const networkCallWithRetry = (execution, delay, retries) =>
  new Promise((resolve, reject) => {
    return execution()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(
              networkCallWithRetry.bind(null, execution, delay, retries - 1)
            )
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });

export const generateId = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
