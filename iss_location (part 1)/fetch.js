// We use the API to request data 

let url = "https://api.wheretheiss.at/v1/satellites/25544"

// Creating the id's for latitud - longitud and time 

let issLat = document.querySelector("#iss-lat")
let issLong = document.querySelector("#iss-long")
let timeElement = document.querySelector("#date")

let update = 10000
let maxFailedAttempts = 3

// We modify the icon ( noun-satellite-2782613.png ) 

let issMarker
let issIcon = L.icon({
    iconUrl: "noun-satellite-2782613.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

//The map is set ( #iss-map ) to view in the website.

let map = L.map("iss-map").setView([0, 0], 1)

//The map resources and data "openstreetmap"

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

iss(maxFailedAttempts)

//It will either provide data or will be rejected

function iss(attempts) {

    if (attempts <= 0) {
        alert("Failed after several attempts to contact server.")
        return
    }

    fetch(url)
    .then(res => res.json()) 
    .then( (issData) => {
        console.log(issData)
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

        //update date
        let date = Date()
        timeElement.innerHTML = date

        //create OR move marker depending if or not exist.
        
        if (!issMarker) {
            issMarker = L.marker([lat, long], {icon: issIcon}).addTo(map)
        } else {
            issMarker.setLatLng([lat, long])
        }
    })
    .catch((err) => {
        attempts--
        console.log("ERROR!", err)
    })
    .finally( () => setTimeout(iss, update, attempts)) //Update the time 
}
