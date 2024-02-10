import { useState } from 'react';

function FetchFollowingListForm({
  onSubmit,
  placeholder
}: {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    username: string
  ) => Promise<void>;
  placeholder: string;
}) {
  const [username, setUsername] = useState('');

  return (
    <form
      onSubmit={(e) => onSubmit(e, username)}
      className="w-full h-10 px-4 py-2 flex flex-row items-center justify-between border border-gray-600 hover:border-gray-400 rounded bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 shadow-[0px_0px_50px] shadow-sky-700/70"
    >
      <p className="text-lg text-gray-300">@</p>
      <input
        className="w-full text-lg text-center text-gray-300 bg-transparent outline-none hover:text-gray-100"
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

export default FetchFollowingListForm;
