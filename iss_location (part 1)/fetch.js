let url = "https://api.wheretheiss.at/v1/satellites/25544"

let issLat = document.querySelector("#iss-lat")
let issLong = document.querySelector("#iss-long")
let timeElement = document.querySelector("#date")

let update = 10000
let maxFailedAttempts = 3

let issMarker
let issIcon = L.icon({
    iconUrl: "noun-satellite-2782613.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

//map
let map = L.map("iss-map").setView([0, 0], 1)

//map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

iss(maxFailedAttempts)

//doesn't use callbacks uses a promise, which is a JS object
//promises it will either provide data or will be rejected
function iss(attempts) {

    if (attempts <= 0) {
        alert("Failed after several attempts to contact server.")
        return
    }

    fetch(url)
    .then(res => res.json()) //no need for return if omitting curlies
    .then( (issData) => {
        console.log(issData)
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

        //update date
        let date = Date()
        timeElement.innerHTML = date

        //create marker if doesn't exist
        //move marker if it does exist
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
    .finally( () => setTimeout(iss, update, attempts)) //runs after fetch worked/failed, recursive call
}




