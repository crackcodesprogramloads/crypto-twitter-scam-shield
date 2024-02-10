export function scanFunction(isCheckingUsernames, followingList) {
  const usernameSelector = "div[data-testid='User-Name'] a[tabindex='-1']";

  function changeUsernamesStyle() {
    const usernameLinks = document.querySelectorAll(usernameSelector);
    Array.from(usernameLinks).forEach((link) => {
      if (link instanceof HTMLElement) {
        if (link.children[0] instanceof HTMLElement) {
          link.children[0].style.color = followingList.includes(
            link.innerText.replace('@', '')
          )
            ? 'rgb(163,218,119)'
            : '#dc2626';
        }
      }
    });
  }

  function resetUsernamesStyle() {
    const usernameLinks = document.querySelectorAll(usernameSelector);
    console.log('resetUsernamesStyle', usernameLinks.length, usernameLinks);
    usernameLinks.forEach((link) => {
      if (link instanceof HTMLElement) {
        if (link.children[0] instanceof HTMLElement) {
          link.children[0].style.color = 'rgb(123, 113, 113)';
        }
      }
    });

    console.log('body: ', document.body);

    document.body.onscroll = function () {};
  }

  function observeDOM() {
    // Function to handle the mutation
    const handleElementLoaded = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Check if the target element is now available
          const usernameLink = document.querySelector(usernameSelector);

          if (usernameLink) {
            // Target element is loaded, trigger your function
            // console.log('Element is loaded:', usernameLink);
            changeUsernamesStyle(); // Call your function here
            observer.disconnect(); // Stop observing once the element is loaded
          }
        }
      }
    };

    // Create a MutationObserver and configure it to observe childList changes
    const observer = new MutationObserver(handleElementLoaded);
    const config = { childList: true, subtree: true };

    // Start observing the entire document
    observer.observe(document.body, config);
  }

  function onScrollListener() {
    console.log('scrolling');
    requestAnimationFrame(() => {
      changeUsernamesStyle();
    });
  }

  if (!isCheckingUsernames) {
    console.log('resetting');
    resetUsernamesStyle();
    return;
  }

  // change usernames styles once browser loads the username element from the observer
  console.log('observeDOM');
  changeUsernamesStyle();
  observeDOM();
  document.body.onscroll = onScrollListener;
}
