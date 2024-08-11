// public/js/app.js
const map = L.map('map').setView([24.9021, 91.8736], 13); // Sylhet, Bangladesh

// Base Layers
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
function geocode(query) {
    fetch(`/geocode?q=${query}`)
    .then(response => response.json())
    .then(data => {
        if (data.length) {
            const firstResult = data[0];
            const latlng = [firstResult.lat, firstResult.lon];
            L.marker(latlng).addTo(map)
                .bindPopup(firstResult.display_name).openPopup();
            map.setView(latlng, 14);
        }
    });
}

// Routing
function route(start, end) {
    fetch(`/route?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
        L.Routing.control({
            waypoints: [
                L.latLng(start.split(',')[1], start.split(',')[0]),
                L.latLng(end.split(',')[1], end.split(',')[0])
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: 'blue', opacity: 1, weight: 5 }]
            },
            createMarker: function(i, waypoint, n) {
                const marker = L.marker(waypoint.latLng).bindPopup(i === 0 ? "Start" : "End");
                return marker;
            }
        }).addTo(map);
    });
}
