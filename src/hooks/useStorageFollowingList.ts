import { useCallback, useEffect, useState } from "react";

export const useStorageFollowingList = () => {
  const [followingList, setFollowingList] = useState<Array<string>>([]);

  const getFollowingList = useCallback(async () => {
    try {
      const data = await chrome.storage.local.get("followingList");

      if (Object.keys(data).length === 0) {
        return;
      }

      const following = data.followingList;

      setFollowingList(following);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      else console.log(JSON.stringify(error));
    }
  }, []);

  useEffect(() => {
    getFollowingList();
  }, [getFollowingList]);

  return { followingList, getFollowingList };
};
