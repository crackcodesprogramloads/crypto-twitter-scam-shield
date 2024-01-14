import { useCallback, useEffect, useState } from "react";

export type Following = Array<{ [key: string]: { username: string } }>;

export const useStorageFollowingList = () => {
  const [followingList, setFollowingList] = useState<Array<string>>([]);

  const getFollowingList = useCallback(async () => {
    try {
      const data = await chrome.storage.local.get("followingList");

      if (Object.keys(data).length === 0) {
        return;
      }

      const following = data.followingList.following as Following;

      const list = following
        .map((profiles) =>
          Object.values(profiles).map((profile) => profile.username)
        )
        .flat()
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      setFollowingList(list);
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
