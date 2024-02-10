import { useState } from 'react';

function FollowingList({
  followingList,
  getFollowingList
}: {
  followingList: string[];
  getFollowingList: () => void;
}) {
  const [listIsOpen, setListIsOpen] = useState(false);
  return (
    <>
      <button
        className="w-full h-10 px-4 py-2 flex items-center justify-center text-xl text-gray-300 hover:text-gray-100 border border-gray-600 hover:border-gray-400 rounded bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 shadow-[0px_0px_50px] shadow-sky-700/70"
        onClick={() => setListIsOpen(!listIsOpen)}
      >
        Following List
      </button>

      {listIsOpen ? (
        <FollowingList
          followingList={followingList}
          getFollowingList={getFollowingList}
        />
      ) : null}
    </>
  );
}

export default FollowingList;
