import { useState } from "react";

import { fetchFollowingData } from "../services/fetchUserFollowingData";
import PROCESSING from "/processing.svg";

function Form({
  onSubmit,
  placeholder,
}: {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    username: string
  ) => Promise<void>;
  placeholder: string;
}) {
  const [username, setUsername] = useState("");

  return (
    <form
      onSubmit={(e) => onSubmit(e, username)}
      className="w-full h-10 px-4 py-2 flex flex-row items-center justify-between border border-gray-600 hover:border-gray-400 rounded bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 shadow-[0px_0px_50px] shadow-sky-700/70"
    >
      <p className="text-lg text-gray-300">@</p>
      <input
        className="w-full outline-none text-lg text-center text-gray-300 hover:text-gray-100 bg-transparent"
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="text-lg text-gray-300 hover:text-gray-100"
      >
        Submit
      </button>
    </form>
  );
}

export default function FollowingList({
  followingList,
  getFollowingList,
}: {
  followingList: string[];
  getFollowingList: () => Promise<void>;
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

      const fetchedFollowingData = await fetchFollowingData(username);

      await chrome.storage.local.set({ followingList: fetchedFollowingData });

      await getFollowingList();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
  };

  if (followingList.length) {
    const numRows = Math.ceil(followingList.length / 2);

    const tableRows = [];
    for (let i = 0; i < numRows; i++) {
      const index1 = i * 2;
      const index2 = index1 + 1;

      const cell1 = followingList[index1] || "";
      const cell2 = followingList[index2] || "";

      tableRows.push(
        <tr key={i} className="flex flex-row justify-between">
          <td className="text-gray-300 text-lg">{cell1}</td>
          <td className="text-gray-300 text-lg">{cell2}</td>
        </tr>
      );
    }

    return (
      <>
        <div className="overflow-y-auto w-full h-80 p-4 border border-gray-600 rounded bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 shadow-[0px_0px_50px] shadow-sky-700/70">
          {tableRows}
        </div>
        {isLoading ? (
          <span className="flex flex-row items-center gap-2">
            <p className="text-lg text-gray-100">
              Fetching following list, please wait.
              <br />
              Large lists could take 1-3 minutes
            </p>
            <img
              className="animate-spin"
              src={PROCESSING}
              alt="processing icon"
              width={24}
              height={24}
            />
          </span>
        ) : (
          <Form
            onSubmit={handleSubmitUsername}
            placeholder="Enter handle for new list"
          />
        )}
      </>
    );
  } else {
    return (
      <>
        {isLoading ? (
          <span className="flex flex-row items-center gap-2">
            <p className="text-lg text-gray-100">
              Fetching following list, please wait.
              <br />
              Large lists could take 1-3 minutes
            </p>
            <img
              className="animate-spin"
              src={PROCESSING}
              alt="processing icon"
              width={24}
              height={24}
            />
          </span>
        ) : (
          <p className="text-md text-gray-100">
            Submit X/Twitter handle to fetch following list
          </p>
        )}
        {!isLoading ? (
          <Form
            placeholder="Enter your username"
            onSubmit={handleSubmitUsername}
          />
        ) : null}
      </>
    );
  }
}
