chrome.runtime.onInstalled.addListener(function () {
  console.log("background initiated");
});

chrome.webNavigation.onCompleted.addListener((details) => {
  // Check if the page matches your criteria
  const twitterUrlPattern = /^https:\/\/(?:.*\.)?twitter\.com\/.*/;
  if (twitterUrlPattern.test(details.url)) {
    // Send a message to the popup to trigger the scanFunction
    chrome.runtime.sendMessage({ type: "pageLoaded" });
    console.log("background message sent");
  }
});
