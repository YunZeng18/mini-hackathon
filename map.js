let map;
let yourLocation;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.203431, lng: -122.801094 },
        zoom: 10,
    });
    yourLocation = new google.maps.Marker({
        label: "You",
        position: null
    });
    yourLocation.setMap(map); //create a empty marker on the map so only 1 marker is on the map at all times 
}