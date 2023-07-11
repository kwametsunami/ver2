import HLSPlayer from "./HLSPlayer";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import firebase from "../firebase";
import { getDatabase, ref, push } from "firebase/database";

import defaultImage from "../assets/radio.png";

import { useState, useEffect } from "react";

const setDefaultSrc = (event) => {
  event.target.src = defaultImage;
};

const setDefaultAlert = () => {
  alert(
    "Sorry, this station is offline or not playable on mobile. Please select another stream."
  );
};

const Player = (props) => {
  const [formattedTitle, setFormattedTitle] = useState("");
  const [stationUrl, setStationUrl] = useState("");

  useEffect(() => {
    let ogTitle = props.stationName;
    let format = ogTitle
      .replace(/_/g, "")
      .replace(/-/g, " ")
      .replace(/  +/, " ")
      .replace(/\//g, "");

    setFormattedTitle(format);

    setStationUrl(props.audioSource);
  }, [props.stationName, props.audioSource]);

  const favourite = (event, userId) => {
    const pushToDatabase = (event, userId) => {
      const playerStation = event.currentTarget.value;
      const playerStationArr = playerStation.split(",");

      const stationFavObj = {
        stationData: {
          id: playerStationArr[0],
          url: playerStationArr[1],
          icon: playerStationArr[2],
          latitude: playerStationArr[3],
          longitude: playerStationArr[4],
          stationName: playerStationArr[5],
        },
        userId: userId,
      };

      const database = getDatabase(firebase);
      const dbRef = ref(database);

      push(dbRef, stationFavObj);

      props.setSaveToFav(playerStationArr[5]);
      props.setFavPopUp(true);

      setTimeout(() => {
        props.setSaveToFav("");
        props.setFavPopUp(false);
      }, 2000);
    };

    pushToDatabase(event, props.userDetails.user.uid);
  };

  return (
    <section className="radio">
      <div className="radioPlayer">
        <div className="radioInfo">
          <div className="playingImgContainer">
            <img
              src={props.stationImage}
              alt={props.stationName}
              onError={setDefaultSrc}
              className="playingBlur"
            />
            <img
              src={props.stationImage}
              alt={`${props.stationName}`}
              onError={setDefaultSrc}
              className="playingIcon"
            />
          </div>
          <div className="radioInfoTitleContainer">
            <h3 className="radioInfoTitle">{formattedTitle}</h3>
          </div>
        </div>
        <div className="playerContainer">
          {props.mobile ? (
            <AudioPlayer
              autoPlay
              layout="horizontal-reverse"
              showJumpControls={false}
              onError={setDefaultAlert}
              src={props.audioSource}
            />
          ) : (
            <HLSPlayer stationUrl={stationUrl} />
          )}
        </div>
        <div className="playerFav">
          <button
            className="playerFavBtn"
            onClick={favourite}
            value={[
              `${props.stationKey}`,
              `${props.audioSource}`,
              `${props.stationImage}`,
              `${props.latitude}`,
              `${props.longitude}`,
              `${props.stationName}`,
            ]}
          >
            {props.favKeys.includes(props.stationKey) ? (
              <i className="fa-solid fa-star added"></i>
            ) : (
              <i className="fa-solid fa-star notAdded"></i>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Player;
