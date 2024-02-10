import FollowingList from "./components/FetchFollowingList";
import { useStorageFollowingList } from "./hooks/useStorageFollowingList";
import { useStorageIsCheckingUsernames } from "./hooks/useStorageIsCheckingUsernames";
import Donation from "./components/Donation";
import { useCallback } from "react";
import LoadingIcon from "./components/LoadingIcon";

function App() {
  const { followingList, setFollowingList } = useStorageFollowingList();
  const { isCheckingUsernames, setIsCheckingUsernames, isLoading } =
    useStorageIsCheckingUsernames();

  const handleToggleCheckUsernames = useCallback(async () => {
    const updatedIsCheckingUsernames = !isCheckingUsernames;

    if (!followingList.length && updatedIsCheckingUsernames) {
      alert('Enter your Twitter/X username and click "Submit" first.');
      return;
    }

    setIsCheckingUsernames(updatedIsCheckingUsernames);
  }, [followingList, isCheckingUsernames, setIsCheckingUsernames]);

  return (
    <>
      <div className="flex flex-col items-center justify-between h-full gap-2 px-6 pt-4 pb-2 w-96 bg-gray-950">
        <div className="flex flex-row items-center justify-center w-full gap-8">
          <h1 className="text-3xl font-light text-gray-100">
            Crypto Twitter
            <br />
            Scam Shield
          </h1>
          <button
            className={`w-16 h-14 text-lg text-gray-100 border border-gray-600 hover:border-gray-400 rounded flex flex-col items-center justify-center ${
              isCheckingUsernames
                ? "bg-gradient-to-r from-emerald-700 to-lime-800"
                : "bg-gradient-to-r from-red-700 to-red-800"
            } shadow-[0px_0px_50px] shadow-sky-700/70`}
            onClick={handleToggleCheckUsernames}
            disabled={isLoading}
          >
            {isLoading ? <LoadingIcon /> : isCheckingUsernames ? "ON" : "OFF"}
          </button>
        </div>
        <FollowingList
          followingList={followingList}
          setFollowingList={setFollowingList}
          setIsCheckingUsernames={setIsCheckingUsernames}
        />
        <Donation />
      </div>
    </>
  );
}

export default App;
