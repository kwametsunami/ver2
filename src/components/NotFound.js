import { Link } from "react-router-dom";

// gif imports
import squidward from "../assets/squidward.gif";
import twoDudes from "../assets/twodudes.gif";
import lisa from "../assets/lisa.gif";
import poliwhirl from "../assets/poliwhirl.gif";
import guyDance from "../assets/guyDance.gif";
import frogAndBud from "../assets/frogAndBud.gif";
import floppy from "../assets/floppy.gif";

const NotFound = () => {
  return (
    <div className="danceParty">
      <div className="dancePartyContainer wrapper">
        <h3>
          Hey! You made it to party 404.{" "}
          <Link to="/">Head back to the site</Link> or hit unmute and bust out
          your best moves with us.
        </h3>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/pxw-5qfJ1dk?&autoplay=1&mute=1"
          title="YouTube video player"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <div className="danceBuddies">
          <img src={floppy} alt="floppy yellow dude" />
          <img src={squidward} alt="squidward dancing" />
          <img src={twoDudes} alt="big guy n little guy dancing" />
          <img src={poliwhirl} alt="poliwhirl raising the roof" />
          <img src={guyDance} alt="bald green dude busting moves" />
          <img src={lisa} alt="lisa simpson rockin out" />
          <img src={frogAndBud} alt="cat and frog happy to be here" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
