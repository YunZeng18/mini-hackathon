const inputForm = document.getElementById("inputForm");
const departureSchedule = document.getElementById("departureSchedule");
const results = document.getElementById("results");
let departureArr = [];



// form submit event
inputForm.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent page from reloading and form submitting
    const routeNumber = event.target.routeNumber.value; // get the input value by the name attribute 'routeNumber'
    const stopNumber = event.target.stopNumber.value; // get the input value by the name attribute 'stopNumber'

    // check if routeNumber and stopNumberinputs have a value
    if (routeNumber && stopNumber) {

        // get position using api and put you on the map
        axios.get(`https://api.translink.ca/rttiapi/v1/stops/${stopNumber}?apikey=pjRs77VXyCWOZvOh9djO`)
            .then(success => {

                let yourLatitude = success.data.Latitude;
                let yourlongitude = success.data.Longitude;

                let yourLatlng = new google.maps.LatLng(yourLatitude, yourlongitude);

                yourLocation.setPosition(yourLatlng); // changes the marker position
                map.setZoom(17);
                map.panTo(yourLocation.position)

                // To add the marker to the map, call setMap();

            })
            .catch(error => {
                console.log(error);
                console.log("couldnt get your whereabouts :(");
                alert("invalid stop ID");
                yourLocation.setPosition(null);
                map.setZoom(10);
                map.panTo(49.203431, -122.801094);
            });

        axios.get(`https://api.translink.ca/rttiapi/v1/stops/${stopNumber}/estimates?apikey=pjRs77VXyCWOZvOh9djO&routeNo=${routeNumber}`)
            .then(success => {
                if (success.data.length === 0) {
                    console.log(`Bus ${routeNumber} is not coming to your stop #${stopNumber}!!!`);
                    renderNoNextBus();

                } else {
                    departureArr = success.data[0].Schedules;//save the schedule for next 6 buses in the array
                    console.log(departureArr);
                    console.log("got the data !");
                    renderSchedule(departureArr);// renderMessages function, loop through array & create DOM elements}
                }
            })
            .catch(error => {
                console.log(error);

                console.log("couldnt get the data :(");
                alert("Invalid routeNumber or stop ID");
            });






    } else if (stopNumber && !routeNumber) {//only stop ID in input field

        // get position using api and put you on the map
        axios.get(`https://api.translink.ca/rttiapi/v1/stops/${stopNumber}?apikey=pjRs77VXyCWOZvOh9djO`)
            .then(success => {

                let yourLatitude = success.data.Latitude;
                let yourlongitude = success.data.Longitude;

                let yourLatlng = new google.maps.LatLng(yourLatitude, yourlongitude);

                yourLocation.setPosition(yourLatlng); // changes the marker position
                map.setZoom(17);
                map.panTo(yourLocation.position)
            })
            .catch(error => {
                console.log(error);
                console.log("couldnt get your whereabouts :(");
                alert("invalid stop ID");
            });

        //get the list of routes at this stop
        axios.get(`https://api.translink.ca/rttiapi/v1/routes?apikey=pjRs77VXyCWOZvOh9djO&stopNo=${stopNumber}`)
            .then(success => {
                const routeList = success.data;
                console.log(routeList);
                renderRoutes(routeList);
            })
            .catch(error => {
                console.log(error);
            });
    }
    else {
        // if no values are set for the input fields
        alert("please enter a routeNumber and stop ID");
    }
});

//append a simple no next bus message to <results> in dom
const renderNoNextBus = () => {
    departureSchedule.innerHTML = "";// clear <table> element before appending
    results.innerHTML = ""; // clear <results> element before appending
    const message = document.createElement('h2');
    message.innerText = "That bus isn't coming to you!!!"

    results.appendChild(message);

}

//append elements to the dom from array of routes
const renderRoutes = (arrayInput) => {
    departureSchedule.innerHTML = ""; // clear <table> element before appending
    results.innerHTML = "";//clear <results> element before appending

    const routeHeading = document.createElement('h3');
    routeHeading.innerText = "Routes passing this Stop";
    results.appendChild(routeHeading);

    arrayInput.forEach(route => {
        const eachRoute = document.createElement('p');
        eachRoute.innerText = route.RouteNo;
        results.appendChild(eachRoute);
    })
}

// append elements to the dom from array of schedules
const renderSchedule = (arrayInput) => {
    departureSchedule.innerHTML = ""; // clear <table> element before appending
    results.innerHTML = "";//clear <results> element before appending
    //   // function which sorts the array by timestamp before looping
    //   sortByDate(messages);

    //headings of the table
    const scheduleHeadings = document.createElement('tr');

    const headingDepartureTime = document.createElement('th');
    headingDepartureTime.innerText = "Estimated Departure Times";
    scheduleHeadings.appendChild(headingDepartureTime);

    const headingCountDown = document.createElement('th');
    headingCountDown.innerText = "Time remaining til departure";
    scheduleHeadings.appendChild(headingCountDown);

    const headingDestination = document.createElement('th');
    headingDestination.innerText = "Destination";
    scheduleHeadings.appendChild(headingDestination);

    departureSchedule.appendChild(scheduleHeadings);

    // loop through departureArr
    arrayInput.forEach((departure) => {
        const eachDeparture = document.createElement('tr');

        const departureTime = document.createElement('td');
        departureTime.innerText = departure.ExpectedLeaveTime;
        eachDeparture.appendChild(departureTime);

        const countdown = document.createElement('td');
        countdown.innerText = departure.ExpectedCountdown + ' min';
        eachDeparture.appendChild(countdown);

        const destination = document.createElement('td');
        destination.innerText = departure.Destination;
        eachDeparture.appendChild(destination);

        departureSchedule.appendChild(eachDeparture);
        // create <li>
        // const messageLi = document.createElement("li");

        // // create <h3> for name
        // const nameElem = document.createElement("h3");
        // nameElem.innerText = departure.name;
        // // you can add classes to each element with .classList.add();
        // // nameElem.classList.add('message-form__name');

        // // create <p> for message
        // const messageElem = document.createElement("h3");
        // messageElem.innerText = departure.message;

        // // create <time> element
        // const messageTimeElem = document.createElement("time");
        // messageTimeElem.innerText = new Date(
        //   departure.timestamp
        // ).toLocaleDateString();

        // // !important: append all elements to the <li> before appending to the <ul>
        // messageLi.appendChild(nameElem);
        // messageLi.appendChild(messageElem);
        // messageLi.appendChild(messageTimeElem);
        // // finally append to <ul>
        // departureSchedule.appendChild(messageLi);
    });


};

// funtion to help sort the array by date, call before looping https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// const sortByDate = (arr) => arr.sort((a, b) => b.timestamp - a.timestamp);
