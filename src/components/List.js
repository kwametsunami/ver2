import { useState, useEffect, useRef } from "react";
import FadeIn from "react-fade-in";
import PropagateLoader from "react-spinners/PropagateLoader";

import firebase from "../firebase";
import { getDatabase, ref, onValue, push } from "firebase/database";

import defaultImage from "../assets/radio.png";

const List = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [playingName, setPlayingName] = useState("");

  const [filterTrue, setFilterTrue] = useState(false);
  const [filteredStations, setFilteredStations] = useState([]);

  useEffect(() => {
    if (props.playingStation !== "") {
      setPlayingName(props.playingStation);
    }
  }, [
    radioUrl,
    props.stations,
    filterTrue,
    props.sendToRadio,
    props.playingStation,
  ]);

  useEffect(() => {
    setFilterTrue(false);
  }, [props.stations]);

  useEffect(() => {
    if (props.filterAmount !== "") {
      setFilterTrue(true);
      setFilteredStations(props.filteredArray);
    }
  }, [props.filterAmount]);

  const radioSelect = (event) => {
    event.preventDefault();

    const selectedStation = event.currentTarget.value;
    const selectedStationArr = selectedStation.split(",");

    props.addToRecent(selectedStationArr);

    props.storeKeys(selectedStationArr[0]);
    props.sendToRadio(selectedStationArr[1]);
    props.sendToRadioName(selectedStationArr[5]);
    props.sendImage(selectedStationArr[2]);

    setRadioUrl(selectedStationArr[1]);
    setPlayingName(selectedStationArr[5]);

    props.latitude(selectedStationArr[3]);
    props.longitude(selectedStationArr[4]);
  };

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
      const newState = [];

      const data = response.val();

      for (let key in data) {
        newState.push({
          key: key,
          ...data[key],
        });
      }
    });
  }, []);

  const grabFilter = (event) => {
    const randomizer = (min = 0, max = props.stations.length) => {
      let base = Math.floor(Math.random() * (max - min + 1)) + min;
      let limit = base + parseInt(event.target.value);

      if (props.filteredArray >= 10) {
        setFilteredStations(props.filteredArray);
        setFilterTrue(true);
      }

      if (event.target.value > props.stations.length) {
        let bottom = 0;
        let top = props.stations.length;

        setFilteredStations(props.stations.slice(bottom, parseInt(top)));
        setFilterTrue(true);
        props.setFilterAmount(event.target.value);
        props.setFilteredArray(props.stations.slice(bottom, parseInt(top)));
      } else if (limit > props.stations.length) {
        let diff = limit - props.stations.length;
        let newBase = base - diff;
        let newLimit = newBase + event.target.value;

        setFilteredStations(props.stations.slice(newBase, newLimit));
        setFilterTrue(true);
        props.setFilterAmount(event.target.value);
        props.setFilteredArray(props.stations.slice(newBase, newLimit));
      } else {
        setFilterTrue(true);
        setFilteredStations(props.stations.slice(base, limit));
        props.setFilterAmount(event.target.value);
        props.setFilteredArray(props.stations.slice(base, limit));
      }
    };

    randomizer();
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  const randomStation = () => {
    if (filterTrue) {
      const randomizer = (min = 0, max = filteredStations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = filteredStations[randomizer()];

      let sendToRecent = [];

      sendToRecent.push(
        surpriseStation.changeuuid,
        surpriseStation.url_resolved,
        surpriseStation.favicon,
        surpriseStation.geo_lat,
        surpriseStation.geo_long,
        surpriseStation.name
      );

      props.addToRecent(sendToRecent);

      props.addToRecent(surpriseStation);

      setRadioUrl(surpriseStation.url_resolved);

      props.stationKey(surpriseStation.changeuuid);
      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
      props.sendImage(surpriseStation.favicon);
      props.latitude(surpriseStation.geo_lat);
      props.longitude(surpriseStation.geo_long);
    } else {
      const randomizer = (min = 0, max = props.stations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = props.stations[randomizer()];

      let sendToRecent = [];

      sendToRecent.push(
        surpriseStation.changeuuid,
        surpriseStation.url_resolved,
        surpriseStation.favicon,
        surpriseStation.geo_lat,
        surpriseStation.geo_long,
        surpriseStation.name
      );

      props.addToRecent(sendToRecent);

      setRadioUrl(surpriseStation.url_resolved);

      props.stationKey(surpriseStation.changeuuid);
      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
      props.sendImage(surpriseStation.favicon);
      props.latitude(surpriseStation.geo_lat);
      props.longitude(surpriseStation.geo_long);
    }
  };

  useEffect(() => {
    if (props.randomMobile) {
      randomStation();
    }
  }, [props.randomMobile]);

  useEffect(() => {
    if (props.filterEvent) {
      grabFilter(props.filterEvent);
    }
  }, [props.filterEvent]);

  const favourite = (event, userId) => {
    const pushToDatabase = (event, userId) => {
      const stationFav = event.currentTarget.value;
      const stationFavArr = stationFav.split(",");

      const stationFavObj = {
        stationData: {
          id: stationFavArr[0],
          url: stationFavArr[1],
          icon: stationFavArr[2],
          latitude: stationFavArr[3],
          longitude: stationFavArr[4],
          stationName: stationFavArr[5],
        },
        userId: userId,
      };

      const database = getDatabase(firebase);
      const dbRef = ref(database);

      push(dbRef, stationFavObj);

      props.setSaveToFav(stationFavArr[5]);
      props.setFavPopUp(true);

      setTimeout(() => {
        props.setSaveToFav("");
        props.setFavPopUp(false);
      }, 2000);
    };

    pushToDatabase(event, props.userDetails.user.uid);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [currentGenre, setCurrentGenre] = useState("");

  const pageRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (pageRef.current && pageRef.current.scrollTop > 300) {
        setIsVisible(true);
        setCurrentGenre(props.selectedGenre);
      } else {
        setIsVisible(false);
      }
    };

    if (pageRef.current) {
      pageRef.current.addEventListener("scroll", toggleVisibility);
    }

    if (currentGenre !== props.selectedGenre) {
      searchScroll();
    }

    return () => {
      if (pageRef.current) {
        pageRef.current.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, [pageRef, props.stations]);

  const scrollToTop = () => {
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const searchScroll = () => {
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  };

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <section className="stationList" ref={pageRef}>
      <div className="listFilters">
        {props.resultTextLoading ? (
          <PropagateLoader
            color={"#f7f5ea"}
            height={80}
            width={25}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="textLoading"
          />
        ) : (
          <h3 className="returned">
            returned{" "}
            <span id="amountReturned">
              {filterTrue ? filteredStations.length : props.stations.length}
            </span>{" "}
            {props.quality === 96 ? "high quality " : null}
            stations matching{" "}
            <span id="listSearchTerm">{props.selectedGenre}</span>
          </h3>
        )}
        <div className="topControls">
          <div className="filterButtonContainer">
            <button className="randomStation" onClick={randomStation}>
              <i className="fa-solid fa-shuffle"></i>
            </button>
            <button className="mapViewButton" onClick={props.mapView}>
              <i className="fa-solid fa-earth-americas"></i>
            </button>
            <label htmlFor="number"></label>
          </div>
          <div className="selectDropdown">
            <select
              name="number"
              id="filterNum"
              onChange={grabFilter}
              value="limit results"
            >
              <option disabled>limit results</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="2000">All</option>
            </select>
          </div>
        </div>
      </div>
      <FadeIn transitionDuration={1000} visible={true}>
        <div className="stationListContainer">
          {filterTrue
            ? filteredStations.map((stationDetails) => {
                return (
                  <div
                    className={
                      playingName === stationDetails.name
                        ? "stationInfoPlayingList"
                        : "stationInfoList"
                    }
                  >
                    <div
                      className="imageInfoContainer"
                      onMouseEnter={() =>
                        handleMouseEnter(stationDetails.changeuuid)
                      }
                      onMouseLeave={handleMouseLeave}
                      key={stationDetails.changeuuid}
                    >
                      {hoveredItem === stationDetails.changeuuid ? (
                        <button
                          className="playButtonDiv"
                          value={[
                            `${stationDetails.changeuuid}`,
                            `${stationDetails.url_resolved}`,
                            `${stationDetails.favicon}`,
                            `${stationDetails.geo_lat}`,
                            `${stationDetails.geo_long}`,
                            `${stationDetails.name}`,
                          ]}
                          onClick={radioSelect}
                        ></button>
                      ) : null}
                      <div className="imageList">
                        {playingName === stationDetails.name ? (
                          <button className="playingBars"></button>
                        ) : (
                          <img
                            src={stationDetails.favicon}
                            alt={stationDetails.name}
                            className={`icon ${
                              hoveredItem === stationDetails.changeuuid &&
                              !props.mobile
                                ? "blurred"
                                : ""
                            }`}
                            onError={setDefaultSrc}
                          />
                        )}
                        {hoveredItem === stationDetails.changeuuid &&
                        playingName !== stationDetails.name &&
                        !props.mobile ? (
                          <button
                            className="hoverPlay"
                            value={[
                              `${stationDetails.changeuuid}`,
                              `${stationDetails.url_resolved}`,
                              `${stationDetails.favicon}`,
                              `${stationDetails.geo_lat}`,
                              `${stationDetails.geo_long}`,
                              `${stationDetails.name}`,
                            ]}
                            onClick={radioSelect}
                            id={stationDetails.name}
                          >
                            <i className="fa-solid fa-play"></i>
                          </button>
                        ) : null}
                      </div>

                      <div className="information">
                        <p className="stationName">
                          {stationDetails.name
                            .replace(/_/g, "")
                            .replace(/-/g, " ")
                            .replace(/  +/, " ")
                            .replace(/\//g, "")}
                        </p>
                        <p className="stationCountry">
                          {stationDetails.state !== ""
                            ? `${stationDetails.state}, `
                            : null}
                          {stationDetails.country ===
                          "The United States Of America"
                            ? "USA"
                            : stationDetails.country}
                        </p>
                      </div>

                      <div className="buttonContainer" value={stationDetails}>
                        {props.favKeys.includes(
                          `${stationDetails.changeuuid}`
                        ) ? (
                          <button class={`added`}>
                            <i className="fa-solid fa-star alreadyAdded"></i>
                          </button>
                        ) : (
                          <button
                            className="favourite"
                            onClick={favourite}
                            value={[
                              `${stationDetails.changeuuid}`,
                              `${stationDetails.url_resolved}`,
                              `${stationDetails.favicon}`,
                              `${stationDetails.geo_lat}`,
                              `${stationDetails.geo_long}`,
                              `${stationDetails.name}`,
                            ]}
                          >
                            <i className="fa-solid fa-star"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            : props.stations.map((stationDetails) => {
                return (
                  <div
                    className={
                      playingName === stationDetails.name
                        ? "stationInfoPlayingList"
                        : "stationInfoList"
                    }
                  >
                    <div
                      className="imageInfoContainer"
                      onMouseEnter={() =>
                        handleMouseEnter(stationDetails.changeuuid)
                      }
                      onMouseLeave={handleMouseLeave}
                      key={stationDetails.changeuuid}
                    >
                      {hoveredItem === stationDetails.changeuuid ? (
                        <button
                          className="playButtonDiv"
                          value={[
                            `${stationDetails.changeuuid}`,
                            `${stationDetails.url_resolved}`,
                            `${stationDetails.favicon}`,
                            `${stationDetails.geo_lat}`,
                            `${stationDetails.geo_long}`,
                            `${stationDetails.name}`,
                          ]}
                          onClick={radioSelect}
                        ></button>
                      ) : null}
                      <div className="imageList">
                        {playingName === stationDetails.name ? (
                          <button className="playingBars"></button>
                        ) : (
                          <img
                            src={stationDetails.favicon}
                            alt={stationDetails.name}
                            className={`icon ${
                              hoveredItem === stationDetails.changeuuid &&
                              !props.mobile
                                ? "blurred"
                                : ""
                            }`}
                            onError={setDefaultSrc}
                          />
                        )}
                        {hoveredItem === stationDetails.changeuuid &&
                        playingName !== stationDetails.name &&
                        !props.mobile ? (
                          <button
                            className="hoverPlay"
                            value={[
                              `${stationDetails.changeuuid}`,
                              `${stationDetails.url_resolved}`,
                              `${stationDetails.favicon}`,
                              `${stationDetails.geo_lat}`,
                              `${stationDetails.geo_long}`,
                              `${stationDetails.name}`,
                            ]}
                            onClick={radioSelect}
                            id={stationDetails.name}
                          >
                            <i className="fa-solid fa-play"></i>
                          </button>
                        ) : null}
                      </div>

                      <div className="information">
                        <p className="stationName">
                          {stationDetails.name
                            .replace(/_/g, "")
                            .replace(/-/g, " ")
                            .replace(/  +/, " ")
                            .replace(/\//g, "")}
                        </p>
                        <p className="stationCountry">
                          {stationDetails.state !== ""
                            ? `${stationDetails.state}, `
                            : null}
                          {stationDetails.country ===
                          "The United States Of America"
                            ? "USA"
                            : stationDetails.country}
                        </p>
                      </div>

                      <div className="buttonContainer" value={stationDetails}>
                        {props.favKeys.includes(
                          `${stationDetails.changeuuid}`
                        ) ? (
                          <button class={`added`}>
                            <i className="fa-solid fa-star alreadyAdded"></i>
                          </button>
                        ) : (
                          <button
                            className="favourite"
                            onClick={favourite}
                            value={[
                              `${stationDetails.changeuuid}`,
                              `${stationDetails.url_resolved}`,
                              `${stationDetails.favicon}`,
                              `${stationDetails.geo_lat}`,
                              `${stationDetails.geo_long}`,
                              `${stationDetails.name}`,
                            ]}
                          >
                            <i className="fa-solid fa-star"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </FadeIn>
      {isVisible && (
        <div className="returnBtn">
          <button className="scrollToTop" onClick={scrollToTop}>
            <i className="fa-solid fa-circle-arrow-up"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default List;
