export async function fetchUserID(username: string) {
  const url = `https://ct-safe-server.onrender.com/${username}`;

  try {
    const userInfo = await chrome.identity.getProfileUserInfo({
      accountStatus: chrome.identity.AccountStatus.ANY,
    });

    const response = await fetch(url, {
      headers: {
        "X-User-ID": userInfo.id,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchUserID function:", error);
    throw error;
  }
}

export async function fetchFollowingData(userID: string) {
  const url = `https://ct-safe-server.onrender.com/following/${userID}`;

  try {
    const userInfo = await chrome.identity.getProfileUserInfo({
      accountStatus: chrome.identity.AccountStatus.ANY,
    });

    const response = await fetch(url, {
      headers: {
        "X-User-ID": userInfo.id,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchFollowingData function:", error);
    throw error;
  }
}
