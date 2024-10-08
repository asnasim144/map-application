// public/js/app.js
const map = L.map('map').setView([24.9021, 91.8736], 13); // Sylhet, Bangladesh

// Base Layers
console.log("object", L)
const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const satellite = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
});

const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const baseMaps = {
    "Streets": streets,
    "Satellite": satellite,
    "Terrain": terrain
};

L.control.layers(baseMaps).addTo(map);

// User Location
map.locate({ setView: true, maxZoom: 16 });
map.on('locationfound', function(e) {
    const radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
});

// Geocoding (Search)
function performSearch() {
    const query = document.getElementById('search').value;
    geocode(query);
}

function geocode(query) {
    fetch(`/geocode?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        if (data.length) {
            const firstResult = data[0];
            const latlng = [firstResult.lat, firstResult.lon];
            L.marker(latlng).addTo(map)
                .bindPopup(firstResult.display_name).openPopup();
            map.setView(latlng, 14);
        } else {
            alert("Location not found.");
        }
    })
    .catch(error => console.error('Error in geocoding:', error));
}

// // Geocoding (Search)
// function geocode(query) {
//     fetch(`/geocode?q=${query}`)
//     .then(response => response.json())
//     .then(data => {
//         if (data.length) {
//             const firstResult = data[0];
//             const latlng = [firstResult.lat, firstResult.lon];
//             L.marker(latlng).addTo(map)
//                 .bindPopup(firstResult.display_name).openPopup();
//             map.setView(latlng, 14);
//         }
//     });
// }

// Routing
function performRouting() {
    const start = document.getElementById('start').value;

    console.log("🚀 ~ file: app.js:77 ~ performRouting ~ start:", start);
    const end = document.getElementById('end').value;

    console.log("🚀 ~ file: app.js:80 ~ performRouting ~ end:", end);
    route(start, end);
}

function route(start, end) {
    fetch(`/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
    .then(response => {
        console.log("🚀 ~ file: app.js:88 ~ route ~ response:", response);
        return response.json();
    })
    .then(data => {
        const routeData = data.routes[0];
        const routeLine = L.geoJSON(routeData.geometry, {
            style: { color: 'blue', weight: 4 }
        }).addTo(map);
        map.fitBounds(routeLine.getBounds());
    })
    .catch(error => console.error('Error in routing:', error));
}

