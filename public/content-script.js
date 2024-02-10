export function scanFunction(isCheckingUsernames, followingList) {
  const usernameSelector = "div[data-testid='User-Name'] a[tabindex='-1']";

  function changeUsernamesStyle() {
    const usernameLinks = document.querySelectorAll(usernameSelector);
    Array.from(usernameLinks).forEach((link) => {
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
  }

  function resetUsernamesStyle() {
    const usernameLinks = document.querySelectorAll(usernameSelector);
    usernameLinks.forEach((link) => {
      if (link instanceof HTMLElement) {
        if (link.children[0] instanceof HTMLElement) {
          link.children[0].style.color = "rgb(123, 113, 113)";
        }
      }
    });

    document.body.onscroll = function () {};
  }

  function observeDOM() {
    const handleElementLoaded = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const usernameLink = document.querySelector(usernameSelector);

          if (usernameLink) {
            changeUsernamesStyle();
            observer.disconnect();
          }
        }
      }
    };

    const observer = new MutationObserver(handleElementLoaded);
    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);
  }

  function onScrollListener() {
    requestAnimationFrame(() => {
      changeUsernamesStyle();
    });
  }

  if (!isCheckingUsernames) {
    resetUsernamesStyle();
    return;
  }

  changeUsernamesStyle();
  observeDOM();
  document.body.onscroll = onScrollListener;
}
