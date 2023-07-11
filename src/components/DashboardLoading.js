import ClipLoader from "react-spinners/ClipLoader";

const DashboardLoading = () => {
  return (
    <div className="beatloader">
        <ClipLoader
          color={"#EDD060"}
          size={35}
          aria-label="Loading Spinner"
          data-testid="loader"
          speedMultiplier={0.5}
        />
    </div>
  );
};

export default DashboardLoading;
