import { useEffect, useState } from "react";
import FollowingList from "./components/FollowingList";
import { useStorageFollowingList } from "./hooks/useStorageFollowingList";

function App() {
  const [listIsOpen, setListIsOpen] = useState(false);
  const [donateIsOpen, setDonateIsOpen] = useState(false);
  const [isCheckingUsernames, setIsCheckingUsernames] = useState(false);
  const { followingList, getFollowingList } = useStorageFollowingList();

  const getDataFromStorage = () => {
    chrome.storage.local.get(["isCheckingUsernames"], (result) => {
      if (result) {
        setIsCheckingUsernames(result.isCheckingUsernames);
      } else {
        console.log("No data found in Chrome storage");
      }
    });
  };

  useEffect(() => {
    getDataFromStorage();
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "pageLoaded") {
      const [tab] = await chrome.tabs.query({ active: true });

      chrome.scripting.executeScript<[boolean, string[]], void>({
        target: { tabId: tab.id! },
        args: [isCheckingUsernames, followingList],
        func: scanFunction,
      });
    }
  });

  async function scanFunction(
    isCheckingUsernames: boolean,
    followingList: string[]
  ) {
    function getUsernames() {
      const usernameLinks = document.querySelectorAll(
        "div[data-testid='User-Name'] a[tabindex='-1']"
      );

      try {
        [...usernameLinks].forEach((link) => {
          if (link instanceof HTMLElement) {
            if (link.children[0] instanceof HTMLElement) {
              link.children[0].style.color = followingList.includes(
                link.innerText.replace("@", "")
              )
                ? "rgb(163,218,119)"
                : "#dc2626";
            }
          }
        });
      } catch (error) {
        console.log("Error in getUsernames() function: ", error);
      }
    }

    // todo: throttle instead of settimeout
    let timer: number | null = null;

    const eventListener = () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        getUsernames();
      }, 200);
    };

    if (isCheckingUsernames) {
      getUsernames();
      document.body.onscroll = eventListener;
    } else {
      document.body.onscroll = () => {};

      timer = null;
      const usernameLinks = document.querySelectorAll(
        "div[data-testid='User-Name'] a[tabindex='-1']"
      );

      usernameLinks.forEach((link) => {
        if (link instanceof HTMLElement) {
          if (link.children[0] instanceof HTMLElement) {
            link.children[0].style.color = "rgb(123, 113, 113)";
          }
        }
      });
    }
  }

  const handleCheckUsernames = async () => {
    const [tab] = await chrome.tabs.query({ active: true });

    if (tab && tab.url) {
      const twitterUrlPattern = /^https:\/\/(?:.*\.)?twitter\.com\/.*/;

      if (twitterUrlPattern.test(tab.url)) {
        if (!followingList.length) {
          alert("Please fetch your following list");
          return;
        }

        const updateValue = !isCheckingUsernames;

        chrome.storage.local
          .set({ isCheckingUsernames: updateValue })
          .then(() => {
            console.log("Set isCheckingUsernames in storage", updateValue);
          });

        setIsCheckingUsernames(updateValue);

        chrome.scripting.executeScript<[boolean, string[]], void>({
          target: { tabId: tab.id! },
          args: [updateValue, followingList],
          func: scanFunction,
        });
      } else {
        alert("Extension only works on X/Twitter");
      }
    } else {
      console.log("No active tab found or tab URL is undefined.");
    }
  };

  return (
    <>
      <div className="w-96 h-full px-6 pt-4 pb-2 flex flex-col items-center justify-between gap-2 bg-gray-950">
        <div className="w-full flex flex-row items-center justify-center gap-8">
          <h1 className="text-3xl text-gray-100 font-light">
            Crypto Twitter
            <br />
            Scam Shield
          </h1>
          <button
            className={`w-16 h-14 text-lg text-gray-100 border border-gray-600 hover:border-gray-400 rounded ${
              isCheckingUsernames
                ? "bg-gradient-to-r from-emerald-700 to-lime-800"
                : "bg-gradient-to-r from-red-700 to-red-800"
            } shadow-[0px_0px_50px] shadow-sky-700/70`}
            onClick={() => handleCheckUsernames()}
          >
            {isCheckingUsernames ? "ON" : "OFF"}
          </button>
        </div>
        <button
          className="w-full h-10 px-4 py-2 flex items-center justify-center text-xl text-gray-300 hover:text-gray-100 border border-gray-600 hover:border-gray-400 rounded bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 shadow-[0px_0px_50px] shadow-sky-700/70"
          onClick={() => setListIsOpen(!listIsOpen)}
        >
          Following List
        </button>

        {listIsOpen ? (
          <FollowingList
            followingList={followingList}
            getFollowingList={getFollowingList}
          />
        ) : null}
        <button
          className="m-0 p-0 text-md text-gray-300 hover:text-gray-100"
          onClick={() => setDonateIsOpen(!donateIsOpen)}
        >
          Buy me a coffee ☕
        </button>
        {donateIsOpen ? (
          <div className="flex flex-col items-center">
            <p className="text-md text-gray-200">
              Metamask - EVM compatible chains
            </p>
            <p className="text-md text-gray-200">
              0xCF9706706aD4B3c65A1cdF95563eDe5BC84ed88d
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default App;
