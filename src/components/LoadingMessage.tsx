import LoadingIcon from './LoadingIcon';

function LoadingMessage() {
  return (
    <span className="flex flex-row items-center gap-2">
      <p className="text-lg text-gray-100">
        Fetching following list, please wait.
        <br />
        Large lists could take 1-3 minutes.
        <br />
        You can close this window and come back when its done.
      </p>
      <LoadingIcon />
    </span>
  );
}

export default LoadingMessage;
