import PropagateLoader from "react-spinners/PropagateLoader";

const LoginLoading = () => {
  return (
    <div className="loginLoading">
      <div className="musicNotes">
        <div class="note musicA">
          <div class="musicUp"></div>
          <div class="musicSide musicLong"></div>
        </div>
        <div class="note musicB">
          <div class="musicUp"></div>
        </div>
        <div class="note musicC">
          <div class="musicUp"></div>
          <div class="musicSide"></div>
        </div>
        <div class="note musicD">
          <div class="musicUp"></div>
          <div class="musicSide"></div>
          <div class="musicSide musicDown"></div>
        </div>
      </div>
      <div className="loginLoadingText">
        <h2 className="loginGreeting">
          Welcome back! Loading your preferences
        </h2>
        <PropagateLoader
          color={"#EDD060"}
          height={80}
          width={25}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default LoginLoading;
