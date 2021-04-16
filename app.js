const bkg = chrome.extension.getBackgroundPage();

const blockRequest = (details) => {
  console.log("[senblock] blocked: ", details.url);
  return {
    cancel: true,
  };
};

const isValidPattern = (urlPattern) => {
  const validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
  return !!urlPattern.match(validPattern);
};

function load(callback) {
  const blockedUrls = ["https://search.spotxchange.com/*"];
  callback(blockedUrls);
}

function loadFilters(urls) {
  console.log("[senblock] loading filters...");
  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }

  const validPatterns = patterns.filter(isValidPattern);

  if (patterns.length) {
    try {
      chrome.webRequest.onBeforeRequest.addListener(
        blockRequest,
        {
          urls: validPatterns,
        },
        ["blocking"]
      );
    } catch (e) {
      console.error("[senblock] errors: ", e);
    }
  }
}

load(function (p) {
  patterns = p;
  bkg.console.log("[senblock] running...");
  bkg.console.log(p);

  loadFilters();
});
