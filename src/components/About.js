import { useState } from "react";

const About = (props) => {
  const [backToSearch, setBackToSearch] = useState(false);

  const returnToSearch = () => {
    setBackToSearch(!backToSearch);
    setTimeout(() => {
      props.aboutModal(false);
      props.animateBack(true);
    }, 400);
  };

  return (
    <section className="about">
      <div className={`aboutContainer ${backToSearch ? "animateClose" : ""}`}>
        <div className="aboutContent">
          <h2 className="aboutTitle">what is tr1-fm?</h2>
          <p>
            tr-1.fm (pronounced tee-arr-one-ef-em) is a website that allows you
            to listen to stations across the world. Simply type in any genre,
            decade, or language, and instantly gather radio stations to play.
            It's your choice between a map or a list of results, whichever route
            you go, you'll be jamming out in no time.
          </p>
          <p>
            The name tr-1.fm is based on the legendary{" "}
            <a
              href="https://en.wikipedia.org/wiki/Regency_TR-1"
              target="_blank"
              rel="noreferrer"
            >
              Regency TR-1
            </a>{" "}
            which was the first commercially manufactured transistor radio,
            completely changing the game for hand held devices, leading into a
            future of portability and changing our relationship with our
            technology. Listen on your computer, mobile device, or tablet,
            tr-1.fm goes with you.
          </p>
          <p>
            tr-1.fm is based on the community assembled{" "}
            <a
              href="https://at1.api.radio-browser.info/"
              target="_blank"
              rel="noreferrer"
            >
              radio-browser API
            </a>
            , that's amazed a database of over 35,000 stations across the globe,
            ranging from high quality coorporate stations to college and amateur
            ones, each with songs, and stories to tell.
          </p>
          <button className="aboutGetStarted" onClick={returnToSearch}>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
