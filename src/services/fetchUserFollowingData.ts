export async function fetchFollowingData(username: string) {
  const lambdaFunctionUrl = `https://arint0k8s4.execute-api.ap-southeast-2.amazonaws.com`;

  const screenname = username;

  const urlWithParams = `${lambdaFunctionUrl}?screenname=${encodeURIComponent(
    screenname
  )}`;

  try {
    // const userInfo = await chrome.identity.getProfileUserInfo({
    //   accountStatus: chrome.identity.AccountStatus.ANY,
    // });

    const response = await fetch(urlWithParams);
    // headers: {
    //   "X-User-ID": userInfo.id,
    // },

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
