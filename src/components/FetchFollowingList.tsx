import { useState } from "react";

import FetchFollowingListForm from "./FetchFollowingListForm";
import LoadingMessage from "./LoadingMessage";

export default function FetchFollowingList({
  followingList,
  setFollowingList,
  setIsCheckingUsernames,
}: {
  followingList: string[];
  setFollowingList: (value: string[]) => void;
  setIsCheckingUsernames: (value: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitUsername = async (
    e: { preventDefault: () => void },
    username: string
  ) => {
    e.preventDefault();

    if (!username) {
      alert("Please enter a username");
      return;
    }

    try {
      setIsLoading(true);

      chrome.runtime.sendMessage(
        {
          event: "START_FETCH_FOLLOWING_LIST",
          data: { username },
        },
        (response) => {
          console.log("after fetching", { response });
          if (response.error) {
            alert(
              `Error fetching following list: ${JSON.stringify(response.error)}`
            );
            setIsLoading(false);
            return;
          }

          if (!response.followingList?.length) {
            alert("This user is not following anyone.");
            setIsLoading(false);
            return;
          }

          setFollowingList(response.followingList);
          setIsCheckingUsernames(true);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error fetching following list:", error);
      alert(
        `Error fetching following list: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      );
      setIsLoading(false);
    }
  };

  if (!followingList?.length) {
    return (
      <>
        {isLoading ? (
          <LoadingMessage />
        ) : (
          <p className="text-gray-100 text-md">
            Submit X/Twitter handle to fetch following list
          </p>
        )}
        {!isLoading ? (
          <FetchFollowingListForm
            placeholder="Enter your username"
            onSubmit={handleSubmitUsername}
          />
        ) : null}
      </>
    );
  }

  const numRows = Math.ceil(followingList.length / 2);

  const tableRows = [];
  for (let i = 0; i < numRows; i++) {
    const index1 = i * 2;
    const index2 = index1 + 1;

    const cell1 = followingList[index1] || "";
    const cell2 = followingList[index2] || "";

    tableRows.push(
      <tr key={i} className="flex flex-row justify-between">
        <td className="text-lg text-gray-300">{cell1}</td>
        <td className="text-lg text-gray-300">{cell2}</td>
      </tr>
    );
  }

  return (
    <>
      <div className="overflow-y-auto w-full h-80 p-4 border border-gray-600 rounded bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 shadow-[0px_0px_50px] shadow-sky-700/70">
        {tableRows}
      </div>
      {isLoading ? (
        <LoadingMessage />
      ) : (
        <FetchFollowingListForm
          onSubmit={handleSubmitUsername}
          placeholder="Enter handle for new list"
        />
      )}
    </>
  );
}
