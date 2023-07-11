 // const setupApi = async (stationFilter) => {
    //   setLoading(true);
    //   setDashboardLoading(true);

    //   const api = new RadioBrowserApi(fetch.bind(window), "tr-1.fm");

    //   let newFilter = [];

    //   for (let filter in stationsList) {
    //     if (stationsList[filter].tags === stationFilter) {
    //       newFilter.push(stationsList[filter]);
    //     }
    //   }

    //   console.log(newFilter);

    //   let bitrateFilter = [];

    //   for (let bitrate in newFilter) {
    //     if (newFilter[bitrate].bitrate >= props.quality) {
    //       bitrateFilter.push(newFilter[bitrate]);
    //     }
    //   }

    //   console.log(bitrateFilter);

    //   const stations = await api.searchStations({
    //     tag: props.genre,
    //     limit: 300,
    //     hasGeoInfo: true,
    //     lastCheckOk: true,
    //   });

    //   let filtered = [];

    //   for (let bitrate in stations) {
    //     if (stations[bitrate].bitrate >= props.quality) {
    //       filtered.push(stations[bitrate]);
    //     }
    //   }

    //   if (filtered.length > 0) {
    //     setStations(filtered);
    //     setBadSearch(false);
    //     setLoading(false);
    //     setBadResponse(false);
    //   }
    //   return filtered;
    // };

    // setupApi(stationFilter)
    //   .then((data) => {
    //     setStations(data);
    //     if (data.length === 0) {
    //       setLoading(false);
    //       setBadSearch(true);
    //       randomGenre();
    //     }
    //     const sort_by = (field, reverse, primer) => {
    //       const key = primer
    //         ? function (x) {
    //             return primer(x[field]);
    //           }
    //         : function (x) {
    //             return x[field];
    //           };

    //       reverse = !reverse ? 1 : -1;

    //       return function (a, b) {
    //         return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    //       };
    //     };
    //     setDashboardLoading(false);
    //     let dataArray = data.slice(0, 5);

    //     setPopular(dataArray.sort(sort_by("votes", true, parseInt)));
    //   })
    //   .catch((error) => {
    //     setBadResponse(true);
    //     setLoading(false);
    //   });