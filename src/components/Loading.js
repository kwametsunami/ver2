import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = () => {
  return (
    <div className="loadingPage">
      <ScaleLoader
        color={"#EDD060"}
        height={80}
        width={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="loadingText">
        <h2>Hang tight, {"\n"}grabbing stations</h2>
      </div>
    </div>
  );
};

export default Loading;
