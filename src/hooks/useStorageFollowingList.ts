import { useCallback, useEffect, useState } from "react";

export const useStorageFollowingList = () => {
  const [followingList, setFollowingList] = useState<Array<string>>([]);

  const getFollowingList = useCallback(async () => {
    try {
      const data = await chrome.storage.local.get("followingList");

      console.log({ data });

      if (Object.keys(data).length === 0) {
        return;
      }

      const following = data.followingList;

      // const list = following
      //   .map((profiles) =>
      //     Object.values(profiles).map((profile) => profile.username)
      //   )
      //   .flat()
      //   .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

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
