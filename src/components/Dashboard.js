import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import { getDatabase, ref, push } from "firebase/database";

import FadeIn from "react-fade-in";

import DashboardLoading from "./DashboardLoading";

import defaultImage from "../assets/radio.png";

const Dashboard = (props) => {
  const [showInfo, setShowInfo] = useState(false);
  const [popularView, setPopularView] = useState(1);
  const [recentView, setRecentView] = useState(false);
  const [userPage, setUserPage] = useState(false);
  const [userDate, setUserDate] = useState("");
  const [showMobile, setShowMobile] = useState(false);

  const [favPrompt, setFavPrompt] = useState(false);
  const [recentPrompt, setRecentPrompt] = useState(false);

  useEffect(() => {
    if (props.mobile === false) {
      setPopularView(1);
    } else {
      setPopularView(null);
    }
  }, []);

  useEffect(() => {
    props.recentStations.length === 0
      ? setRecentPrompt(true)
      : setRecentPrompt(false);

    props.testArr.length === 0 ? setFavPrompt(true) : setFavPrompt(false);
  }, [
    props.recentStations,
    props.testArr,
    props.logout,
    props.userDetails,
    userDate,
  ]);

  const mobileMenu = () => {
    setShowMobile(!showMobile);
    setPopularView(null);
    props.setShowCaret(!props.showCaret);
  };

  const userView = () => {
    setRecentView(false);
    setPopularView(0);
    setUserPage(true);
  };

  const chartView = () => {
    setUserPage(false);
    setPopularView(1);
    setRecentView(false);
  };

  const showRecent = () => {
    setUserPage(false);
    setRecentView(true);
    setPopularView(0);
  };

  const favView = () => {
    setUserPage(false);
    setPopularView(2);
    setRecentView(false);
  };

  const infoButton = () => {
    setShowInfo(!showInfo);

    if (props.mobile) {
      setRecentView(false);
      setUserPage(false);
      setPopularView(5);
    }
  };

  const backMobile = () => {
    setPopularView(null);
  };

  useEffect(() => {
    if (props.userDetails.user.email !== "anon@tr1.fm") {
      const moment = require("moment");

      if (typeof props.userDetails.user.createdAt === "undefined") {
        const timestamp = props.userDetails.user.metadata.createdAt;
        const date = moment(parseInt(timestamp, 10));
        const formattedDate = date.format("YYYY-MM-DD");

        setUserDate(formattedDate);
      } else {
        const timestamp = props.userDetails.user.createdAt;
        const date = moment(parseInt(timestamp, 10));
        const formattedDate = date.format("YYYY-MM-DD");

        setUserDate(formattedDate);
      }
    } else {
      setUserDate("");
    }
  }, [props.userDetails, props.logout]);

  const playStation = (event) => {
    event.preventDefault();

    const dashboardStation = event.currentTarget.value;
    const dashboardStationArr = dashboardStation.split(",");

    props.storeKeys(dashboardStationArr[0]);
    props.sendToRadio(dashboardStationArr[1]);
    props.sendToRadioName(dashboardStationArr[5]);
    props.sendImage(dashboardStationArr[2]);

    props.latitude(dashboardStationArr[3]);
    props.longitude(dashboardStationArr[4]);

    props.addToRecent(dashboardStationArr);
  };

  const recentPlayStation = (event) => {
    event.preventDefault();

    const dashboardStation = event.currentTarget.value;
    const dashboardStationArr = dashboardStation.split(",");

    props.storeKeys(dashboardStationArr[0]);
    props.sendToRadio(dashboardStationArr[1]);
    props.sendToRadioName(dashboardStationArr[5]);
    props.sendImage(dashboardStationArr[2]);

    props.latitude(dashboardStationArr[3]);
    props.longitude(dashboardStationArr[4]);
  };

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

  const clearRecent = (event) => {
    event.preventDefault();

    props.setRecentStations([]);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  const goToLogin = (event) => {
    event.preventDefault();
    props.login();
  };

  const logout = () => {
    props.logout();
    setUserDate("");
  };

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {props.mobile ? (
        <div className="dashboardContainerMobile">
          {showMobile || props.mobileOptions ? null : (
            <div className="hamburgerMenu">
              <button className="hamburger" onClick={mobileMenu}>
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          )}
          {showMobile ? (
            <div className="dashboardPopOut">
              <div className="dashboardControls">
                <div className="dashboardLogo">
                  <Link onClick={props.landingView} to="/">
                    <h2>tr-1.fm</h2>
                  </Link>
                  <div
                    className="goBack"
                    id={popularView != null ? "" : "hidden"}
                  >
                    <button onClick={backMobile}>
                      <i className="fa-solid fa-chevron-left"></i>
                      <p>back</p>
                    </button>
                  </div>
                </div>
                <div className="dashboardClose">
                  <button className="hamburgerX" onClick={mobileMenu}>
                    <i className="fa-solid fa-caret-left"></i>
                  </button>
                </div>
              </div>

              <FadeIn
                transitionDuration={350}
                className="mobileDashboardContainer"
              >
                {popularView === 5 ? (
                  <div className="instructionsMobile">
                    <p>
                      Discover the world through radio! In map mode, click on a
                      marker to get more information on a station -- from there,
                      hit play to start listening! If you like what you're
                      hearing hit the star to save it!
                    </p>
                    <p>
                      On the dashboard, you can view the top 5 stations from
                      your search, check out your recently played, and manage
                      your favourites.
                    </p>
                    <p>
                      Don't know what to listen to? Hit shuffle and we'll give
                      you a random station within your search!
                    </p>
                  </div>
                ) : popularView === null ? (
                  <div className="mobileDashButtons">
                    <FadeIn transitionDuration={750}>
                      <button onClick={userView} className="userButtonMobile">
                        <i className="fa-solid fa-user"></i>
                        <p className="buttonText">user</p>
                      </button>
                      <button onClick={chartView} className="chartButtonMobile">
                        <i className="fa-solid fa-chart-simple"></i>
                        <p className="buttonText">popular</p>
                      </button>
                      <button
                        onClick={showRecent}
                        className="recentButtonMobile"
                      >
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        <p className="buttonText">recently played</p>
                      </button>
                      <button onClick={favView} className="favButtonMobile">
                        <i className="fa-solid fa-star"></i>
                        <p className="buttonText">favourites</p>
                      </button>
                      <button onClick={infoButton} className="infoButtonMobile">
                        <i className="fa-solid fa-circle-info"></i>
                        <p className="buttonText">information</p>
                      </button>
                    </FadeIn>
                  </div>
                ) : userPage ? (
                  <div className="userContainer">
                    <h2 id="userContainerTitle">dashboard</h2>
                    {userDate !== "" ? (
                      <div className="userContent">
                        <div className="creationDate">
                          <p>
                            member since <br />
                            <span id="userDate">{userDate}</span>
                          </p>
                        </div>
                        <button className="userSignOut" onClick={logout}>
                          logout
                        </button>
                      </div>
                    ) : (
                      <div className="anonymousContent">
                        <p>Things are more fun with an account!</p>
                        <div className="anonButtons">
                          <button
                            className="logInDashboard"
                            onClick={goToLogin}
                          >
                            login
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : recentView ? (
                  <div className="recentContainer">
                    <div className="recentContainerTop">
                      <h2>
                        <span id="recentTitle">recently </span>played
                      </h2>
                      {!recentPrompt && props.stationUrl !== "" ? (
                        <button className="clearRecent" onClick={clearRecent}>
                          clear list
                        </button>
                      ) : null}
                    </div>
                    <div className="recentContainerContainer">
                      {recentPrompt ? (
                        <p className="recentPrompt">
                          It's pretty quiet here... starting listening to
                          something!
                        </p>
                      ) : (
                        <FadeIn
                          transitionDuration={500}
                          visible={true}
                          className="recentFade"
                        >
                          {props.recentStations.map((recent) => {
                            return (
                              <div
                                className={
                                  props.currentKey === recent[0]
                                    ? "recentItemsPlaying"
                                    : "recentItems"
                                }
                                key={`${recent[0]}`}
                              >
                                <button
                                  className="playButtonDivRecent"
                                  onClick={recentPlayStation}
                                  value={[
                                    `${recent[0]}`,
                                    `${recent[1]}`,
                                    `${recent[2]}`,
                                    `${recent[3]}`,
                                    `${recent[4]}`,
                                    `${recent[5]}`,
                                  ]}
                                ></button>
                                <div className="imageAndText">
                                  {props.currentKey === recent[0] ? (
                                    <div className="playingBarsRecent"></div>
                                  ) : (
                                    <img
                                      src={`${recent[2]}`}
                                      alt={`${recent[5]}`}
                                      onError={setDefaultSrc}
                                      className={
                                        hoveredItem === recent[0]
                                          ? "blurred"
                                          : ""
                                      }
                                    />
                                  )}
                                  <div className="recentItemsText">
                                    <p className="recentTextTitle">
                                      {`${recent[5]
                                        .replace(/_/g, "")
                                        .replace(/-/g, " ")
                                        .replace(/  +/, " ")
                                        .replace(/\//g, "")}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="recentItemsButton">
                                  {props.favKeys.includes(`${recent[0]}`) ? (
                                    <button class="added">
                                      <i className="fa-solid fa-star alreadyAdded"></i>
                                    </button>
                                  ) : (
                                    <button
                                      className="recentAddFav"
                                      onClick={favourite}
                                      value={[
                                        `${recent[0]}`,
                                        `${recent[1]}`,
                                        `${recent[2]}`,
                                        `${recent[3]}`,
                                        `${recent[4]}`,
                                        `${recent[5]}`,
                                      ]}
                                    >
                                      <i className="fa-solid fa-star"></i>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </FadeIn>
                      )}
                    </div>
                  </div>
                ) : popularView === 1 ? (
                  <div className="popularView">
                    {!props.dashboardLoading ? (
                      props.badSearch ? null : (
                        <h2 id="popularTitle">
                          top{" "}
                          <span id="popularSearchTerm">{props.genreName} </span>
                          stations
                        </h2>
                      )
                    ) : null}
                    {props.dashboardLoading ? <DashboardLoading /> : null}
                    <div className="popularContainerContainer">
                      <FadeIn transitionDuration={500}>
                        {props.dashboardLoading
                          ? null
                          : props.popular.map((stations) => {
                              return (
                                <div
                                  className={
                                    props.currentKey === stations.changeuuid
                                      ? "popularResultsPlaying"
                                      : "popularResults"
                                  }
                                  key={`${stations.changeuuid}`}
                                >
                                  <button
                                    onClick={playStation}
                                    value={[
                                      `${stations.changeuuid}`,
                                      `${stations.url_resolved}`,
                                      `${stations.favicon}`,
                                      `${stations.geo_lat}`,
                                      `${stations.geo_long}`,
                                      `${stations.name}`,
                                    ]}
                                    className="playButtonDivPopular"
                                  ></button>
                                  <div className="imageAndText">
                                    {props.currentKey ===
                                    stations.changeuuid ? (
                                      <div className="playingBarsPopular"></div>
                                    ) : (
                                      <img
                                        src={`${stations.favicon}`}
                                        alt={`${stations.name}`}
                                        onError={setDefaultSrc}
                                      />
                                    )}
                                    <div className="popularText">
                                      <p className="popularTextTitle">{`${stations.name
                                        .replace(/_/g, "")
                                        .replace(/-/g, " ")
                                        .replace(/  +/, " ")
                                        .replace(/\//g, "")}`}</p>
                                    </div>
                                  </div>
                                  <div className="popularButtons">
                                    {props.favKeys.includes(
                                      `${stations.changeuuid}`
                                    ) ? (
                                      <button class="added">
                                        <i className="fa-solid fa-star alreadyAdded"></i>
                                      </button>
                                    ) : (
                                      <button
                                        className="addFav"
                                        onClick={favourite}
                                        value={[
                                          `${stations.changeuuid}`,
                                          `${stations.url_resolved}`,
                                          `${stations.favicon}`,
                                          `${stations.geo_lat}`,
                                          `${stations.geo_long}`,
                                          `${stations.name}`,
                                        ]}
                                      >
                                        <i className="fa-solid fa-star"></i>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                      </FadeIn>
                    </div>
                    ;
                  </div>
                ) : (
                  <div className="favContainer">
                    <h2 className="favTitleTotal">
                      your
                      <span id="favouriteTitle"> favourites</span>
                    </h2>
                    <div className="favContainerContainer">
                      {favPrompt ? (
                        <div className="favPrompt">
                          <p>
                            Your favourite stations will live here! Hit the star
                            icon on the stations you'd like to come back to.
                          </p>
                          {props.userDetails.user.email === "anon@tr1.fm" ? (
                            <div className="notSignedIn">
                              <p id="notSignedIn">
                                You are currently not signed in. Favourites will
                                not be saved after this session.
                              </p>
                              <button
                                class="notSignedInBtn"
                                onClick={goToLogin}
                              >
                                login
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div
                          className="favContent"
                          id={props.stationUrl === "" ? "fullScroll" : ""}
                        >
                          <FadeIn
                            transitionDuration={700}
                            className={`scrollableContent`}
                          >
                            {props.testArr.map((favStation) => {
                              return (
                                <div
                                  className={
                                    props.currentKey ===
                                    favStation.stationData.id
                                      ? "favItemsPlaying"
                                      : "favItems"
                                  }
                                  key={`${favStation.key}`}
                                >
                                  <button
                                    className="playButtonDivFav"
                                    onClick={playStation}
                                    value={[
                                      `${favStation.stationData.id}`,
                                      `${favStation.stationData.url}`,
                                      `${favStation.stationData.icon}`,
                                      `${favStation.stationData.latitude}`,
                                      `${favStation.stationData.longitude}`,
                                      `${favStation.stationData.stationName}`,
                                    ]}
                                  ></button>
                                  <div className="imageAndText">
                                    {props.currentKey ===
                                    favStation.stationData.id ? (
                                      <div className="playingBarsFav"></div>
                                    ) : (
                                      <img
                                        src={`${favStation.stationData.icon}`}
                                        alt={`${favStation.stationData.stationName}`}
                                        onError={setDefaultSrc}
                                        className={
                                          hoveredItem ===
                                          favStation.stationData.id
                                            ? "blurred"
                                            : ""
                                        }
                                      />
                                    )}
                                    <div className="favText">
                                      <p className="favTextTitle">{`${favStation.stationData.stationName
                                        .replace(/_/g, "")
                                        .replace(/-/g, " ")
                                        .replace(/  +/, " ")
                                        .replace(/\//g, "")}`}</p>
                                    </div>
                                  </div>
                                  <div className="favButtons">
                                    <button
                                      className="removeFav"
                                      onClick={() =>
                                        props.removeFav(favStation.key)
                                      }
                                    >
                                      <i class="fa-solid fa-trash-can trash"></i>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </FadeIn>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </FadeIn>
              <div className="userLoggedIn">
                {props.userDetails.user.email !== "anon@tr1.fm" ? (
                  <p id="dashboardUser">{props.userDetails.user.email}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className="dashboardContainer"
          id={props.stationUrl === "" ? "fullDashContainer" : ""}
        >
          <div className="dashboardLogo">
            <FadeIn transitionDuration={300}>
              <Link onClick={props.landingView} to="/">
                <h2>tr-1.fm</h2>
              </Link>
            </FadeIn>
          </div>
          <div className="emailDashboard">
            {props.userDetails.user.email !== "anon@tr1.fm" ? (
              <p id="dashboardUser">{props.userDetails.user.email}</p>
            ) : null}
          </div>
          <div
            className="middleDashboard"
            id={props.stationUrl === "" ? "fullMiddle" : ""}
          >
            {userPage ? (
              <div className="userContainer">
                <h2 id="userContainerTitle">dashboard</h2>
                {userDate !== "" ? (
                  <div className="userContent">
                    <div className="creationDate">
                      <p>
                        member since <br />
                        <span id="userDate">{userDate}</span>
                      </p>
                    </div>
                    <button className="userSignOut" onClick={logout}>
                      logout
                    </button>
                  </div>
                ) : (
                  <div className="anonymousContent">
                    <p>Things are more fun with an account!</p>
                    <div className="anonButtons">
                      <button className="logInDashboard" onClick={goToLogin}>
                        login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : recentView ? (
              <div className="recentContainer">
                <h2>
                  <span id="recentTitle">recently </span>played
                </h2>
                <div className="recentContainerContainer">
                  {recentPrompt ? (
                    <p className="recentPrompt">
                      It's pretty quiet here... starting listening to something!
                    </p>
                  ) : (
                    <FadeIn
                      transitionDuration={500}
                      visible={true}
                      className="recentFade"
                    >
                      {props.recentStations.map((recent) => {
                        return (
                          <div
                            className={
                              props.currentKey === recent[0]
                                ? "recentItemsPlaying"
                                : "recentItems"
                            }
                            key={`${recent[0]}`}
                            onMouseEnter={() => handleMouseEnter(recent[0])}
                            onMouseLeave={handleMouseLeave}
                          >
                            {hoveredItem === recent[0] ? (
                              <button
                                className="playButtonDivRecent"
                                onClick={recentPlayStation}
                                value={[
                                  `${recent[0]}`,
                                  `${recent[1]}`,
                                  `${recent[2]}`,
                                  `${recent[3]}`,
                                  `${recent[4]}`,
                                  `${recent[5]}`,
                                ]}
                              ></button>
                            ) : null}
                            {props.currentKey === recent[0] ? (
                              <div className="playingBarsRecent"></div>
                            ) : (
                              <img
                                src={`${recent[2]}`}
                                alt={`${recent[5]}`}
                                onError={setDefaultSrc}
                                className={
                                  hoveredItem === recent[0] ? "blurred" : ""
                                }
                              />
                            )}
                            {hoveredItem === recent[0] &&
                            props.stationUrl !== recent[1] ? (
                              <div className="hoverPlayDash">
                                <i className="fa-solid fa-play"></i>
                              </div>
                            ) : null}
                            <div className="recentItemsText">
                              <p className="recentTextTitle">
                                {`${recent[5]
                                  .replace(/_/g, "")
                                  .replace(/-/g, " ")
                                  .replace(/  +/, " ")
                                  .replace(/\//g, "")}`}
                              </p>
                            </div>
                            <div className="recentItemsButton">
                              {props.favKeys.includes(`${recent[0]}`) ? (
                                <button class="added">
                                  <i className="fa-solid fa-star alreadyAdded"></i>
                                </button>
                              ) : (
                                <button
                                  className="recentAddFav"
                                  onClick={favourite}
                                  value={[
                                    `${recent[0]}`,
                                    `${recent[1]}`,
                                    `${recent[2]}`,
                                    `${recent[3]}`,
                                    `${recent[4]}`,
                                    `${recent[5]}`,
                                  ]}
                                >
                                  <i className="fa-solid fa-star"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {!recentPrompt && props.stationUrl !== "" ? (
                        <button className="clearRecent" onClick={clearRecent}>
                          clear list
                        </button>
                      ) : null}
                    </FadeIn>
                  )}
                </div>
              </div>
            ) : popularView === 1 ? (
              <div className="popularView">
                {!props.dashboardLoading ? (
                  props.badSearch ? null : (
                    <h2 id="popularTitle">
                      top <span id="popularSearchTerm">{props.genreName} </span>
                      stations
                    </h2>
                  )
                ) : null}
                {props.dashboardLoading ? <DashboardLoading /> : null}
                <div className="popularContainerContainer">
                  <FadeIn transitionDuration={500}>
                    {props.dashboardLoading
                      ? null
                      : props.popular.map((stations) => {
                          return (
                            <div
                              className={
                                props.currentKey === stations.changeuuid
                                  ? "popularResultsPlaying"
                                  : "popularResults"
                              }
                              key={`${stations.changeuuid}`}
                              onMouseEnter={() =>
                                handleMouseEnter(stations.changeuuid)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              {hoveredItem === stations.changeuuid ? (
                                <button
                                  onClick={playStation}
                                  value={[
                                    `${stations.changeuuid}`,
                                    `${stations.url_resolved}`,
                                    `${stations.favicon}`,
                                    `${stations.geo_lat}`,
                                    `${stations.geo_long}`,
                                    `${stations.name}`,
                                  ]}
                                  className="playButtonDivPopular"
                                ></button>
                              ) : null}
                              {props.currentKey === stations.changeuuid ? (
                                <div className="playingBarsPopular"></div>
                              ) : (
                                <img
                                  src={`${stations.favicon}`}
                                  alt={`${stations.name}`}
                                  onError={setDefaultSrc}
                                  className={
                                    hoveredItem === stations.changeuuid
                                      ? "blurred"
                                      : ""
                                  }
                                />
                              )}
                              {hoveredItem === stations.changeuuid &&
                              props.stationUrl !== stations.url_resolved ? (
                                <div className="hoverPlayDash">
                                  <i className="fa-solid fa-play"></i>
                                </div>
                              ) : null}
                              <div className="popularText">
                                <p className="popularTextTitle">{`${stations.name
                                  .replace(/_/g, "")
                                  .replace(/-/g, " ")
                                  .replace(/  +/, " ")
                                  .replace(/\//g, "")}`}</p>
                              </div>
                              <div className="popularButtons">
                                {props.favKeys.includes(
                                  `${stations.changeuuid}`
                                ) ? (
                                  <button class="added">
                                    <i className="fa-solid fa-star alreadyAdded"></i>
                                  </button>
                                ) : (
                                  <button
                                    className="addFav"
                                    onClick={favourite}
                                    value={[
                                      `${stations.changeuuid}`,
                                      `${stations.url_resolved}`,
                                      `${stations.favicon}`,
                                      `${stations.geo_lat}`,
                                      `${stations.geo_long}`,
                                      `${stations.name}`,
                                    ]}
                                  >
                                    <i className="fa-solid fa-star"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                  </FadeIn>
                </div>
                ;
              </div>
            ) : (
              <div className="favContainer">
                <h2 className="favTitleTotal">
                  your
                  <span id="favouriteTitle"> favourites</span>
                </h2>
                <div className="favContainerContainer">
                  {favPrompt ? (
                    <div className="favPrompt">
                      <p>
                        Your favourite stations will live here! Hit the star
                        icon on the stations you'd like to come back to.
                      </p>
                      {props.userDetails.user.email === "anon@tr1.fm" ? (
                        <div className="notSignedIn">
                          <p id="notSignedIn">
                            You are currently not signed in. Favourites will not
                            be saved after this session.
                          </p>
                          <button class="notSignedInBtn" onClick={goToLogin}>
                            login
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div
                      className="favContent"
                      id={props.stationUrl === "" ? "fullScroll" : ""}
                    >
                      <FadeIn
                        transitionDuration={700}
                        className={`scrollableContent`}
                      >
                        {props.testArr.map((favStation) => {
                          return (
                            <div
                              className={
                                props.currentKey === favStation.stationData.id
                                  ? "favItemsPlaying"
                                  : "favItems"
                              }
                              key={`${favStation.key}`}
                              onMouseEnter={() =>
                                handleMouseEnter(favStation.stationData.id)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              {hoveredItem === favStation.stationData.id ? (
                                <button
                                  className="playButtonDivFav"
                                  onClick={playStation}
                                  value={[
                                    `${favStation.stationData.id}`,
                                    `${favStation.stationData.url}`,
                                    `${favStation.stationData.icon}`,
                                    `${favStation.stationData.latitude}`,
                                    `${favStation.stationData.longitude}`,
                                    `${favStation.stationData.stationName}`,
                                  ]}
                                ></button>
                              ) : null}
                              {props.currentKey ===
                              favStation.stationData.id ? (
                                <div className="playingBarsFav"></div>
                              ) : (
                                <img
                                  src={`${favStation.stationData.icon}`}
                                  alt={`${favStation.stationData.stationName}`}
                                  onError={setDefaultSrc}
                                  className={
                                    hoveredItem === favStation.stationData.id
                                      ? "blurred"
                                      : ""
                                  }
                                />
                              )}
                              {hoveredItem === favStation.stationData.id &&
                              props.stationUrl !==
                                favStation.stationData.url ? (
                                <div className="hoverPlayDash">
                                  <i className="fa-solid fa-play"></i>
                                </div>
                              ) : null}
                              <div className="favText">
                                <p className="favTextTitle">{`${favStation.stationData.stationName
                                  .replace(/_/g, "")
                                  .replace(/-/g, " ")
                                  .replace(/  +/, " ")
                                  .replace(/\//g, "")}`}</p>
                              </div>
                              <div className="favButtons">
                                <button
                                  className="removeFav"
                                  onClick={() =>
                                    props.removeFav(favStation.key)
                                  }
                                >
                                  {hoveredItem === favStation.stationData.id ? (
                                    <i class="fa-solid fa-trash-can trash"></i>
                                  ) : (
                                    <i className="fa-solid fa-star faved"></i>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </FadeIn>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            className={
              props.stationUrl === "" ? "infoContainerBottom" : "infoContainer"
            }
          >
            <div className="infoButtons">
              <button
                className="dashLogin"
                onClick={userView}
                id={userPage ? "selectedUserBtn" : ""}
              >
                <i
                  className="fa-solid fa-user"
                  id={userPage ? "selectedUser" : ""}
                ></i>
              </button>
              <button
                onClick={chartView}
                id={popularView === 1 ? "selectedPopularBtn" : ""}
                className="popular"
              >
                <i
                  className="fa-solid fa-fire popularBtn"
                  id={popularView === 1 ? "selectedPopular" : ""}
                ></i>
              </button>
              <button
                onClick={showRecent}
                id={recentView ? "selectedRecentBtn" : ""}
                className="recent"
              >
                <i
                  className="fa-solid fa-clock-rotate-left recentBtn"
                  id={recentView ? "selectedRecent" : ""}
                ></i>
              </button>
              <button
                onClick={favView}
                id={popularView === 2 ? "selectedFavsBtn" : ""}
                className="fav"
              >
                <i
                  className="fa-solid fa-star favsBtn"
                  id={popularView === 2 ? "selectedFavs" : ""}
                ></i>
              </button>
              <button
                onClick={infoButton}
                id={showInfo ? "selectedInfoBtn" : ""}
                className="info"
              >
                <i
                  className="fa-solid fa-circle-info infoBtn"
                  id={showInfo ? "selectedInfo" : ""}
                ></i>
              </button>
            </div>
            {showInfo ? (
              <div className="instructions">
                <button className="infoButton" onClick={infoButton}>
                  <i className="fa-solid fa-window-minimize"></i>
                </button>
                <p>
                  Discover the world through radio! In map mode, click on a
                  marker to get more information on a station -- from there, hit
                  play to start listening! If you like what you're hearing hit
                  the star to save it!
                </p>
                <p>
                  On the dashboard, you can view the top 5 stations from your
                  search, check out your recently played, and manage your
                  favourites.
                </p>
                <p>
                  Don't know what to listen to? Hit shuffle and we'll give you a
                  random station within your search!
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
