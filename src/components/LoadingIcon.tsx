import PROCESSING from '/processing.svg';

function LoadingIcon() {
  return (
    <img
      className="animate-spin"
      src={PROCESSING}
      alt="processing icon"
      width={24}
      height={24}
    />
  );
}

export default LoadingIcon;
