import PropagateLoader from "react-spinners/PropagateLoader";

const SignedUp = () => {
  return (
    <div className="registerSuccess">
      <div className="musicNotes">
        <div className="note musicA">
          <div className="musicUp"></div>
          <div className="musicSide musicLong"></div>
        </div>
        <div className="note musicB">
          <div className="musicUp"></div>
        </div>
        <div className="note musicC">
          <div className="musicUp"></div>
          <div className="musicSide"></div>
        </div>
        <div className="note musicD">
          <div className="musicUp"></div>
          <div className="musicSide"></div>
          <div className="musicSide musicDown"></div>
        </div>
      </div>
      <div className="loginLoadingText">
        <h2 className="loginGreeting">
          Account created successfully, welcome!
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

export default SignedUp;
