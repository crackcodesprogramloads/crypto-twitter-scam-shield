import { scanFunction } from "./content-script.js";

function isTwitterUrl(url) {
  return /^https:\/\/(?:.*\.)?twitter\.com\/.*/.test(url);
}

async function fetchFollowingData(username, sendResponse) {
  const { uniqueID } = await chrome.storage.local.get(["uniqueID"]);

  const lambdaFunctionUrl = `https://arint0k8s4.execute-api.ap-southeast-2.amazonaws.com`;

  const screenname = username;

  const urlWithParams = `${lambdaFunctionUrl}?screenname=${encodeURIComponent(
    screenname
  )}`;

  try {
    const response = await fetch(urlWithParams, {
      headers: {
        uniqueID,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        sendResponse({
          error:
            "You have exceeded the rate limit. Please try again in 5 minutes.",
        });
        return;
      }
      sendResponse({
        error: "Something went wrong with the server request.",
      });
      return;
    }

    const followingList = await response.json();

    chrome.storage.local.set({ followingList }, () => {
      chrome.storage.local.set(
        { isCheckingUsernames: followingList.length > 0 },
        () => {
          sendResponse({ followingList });
        }
      );
    });
  } catch (error) {
    console.log("Error in fetchFollowingData function:", error.message);
    sendResponse({ error });
  }
}

function executeScript({ tabId, tabs }) {
  chrome.storage.local.get(
    ["isCheckingUsernames", "followingList"],
    async ({ isCheckingUsernames, followingList }) => {
      if (followingList?.length) {
        if (tabId) {
          await chrome.scripting.executeScript({
            target: { tabId },
            args: [isCheckingUsernames, followingList],
            func: scanFunction,
          });
        } else if (tabs?.length) {
          tabs.forEach((tab) => {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              args: [isCheckingUsernames, followingList],
              func: scanFunction,
            });
          });
        }
      }
    }
  );
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const uuid = self.crypto.randomUUID();
    chrome.storage.local.set({ uniqueID: uuid });
  }
});

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    executeScript({ tabId: details.tabId });
  },
  { url: [{ urlMatches: "https?://(www\\.)?twitter\\.com/.*" }] }
);

chrome.tabs.onActivated.addListener(async function ({ tabId }) {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url && isTwitterUrl(tab.url)) {
    executeScript({ tabId });
  }
});

chrome.storage.onChanged.addListener(async function ({ isCheckingUsernames }) {
  if (isCheckingUsernames) {
    const tabs = await chrome.tabs.query({
      url: "https://twitter.com/*",
    });
    if (!tabs?.length) return;
    executeScript({ tabs });
  }
});

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  switch (request.event) {
    case "START_FETCH_FOLLOWING_LIST": {
      fetchFollowingData(request.data.username, sendResponse);

      break;
    }

    default:
      break;
  }

  return true;
});
