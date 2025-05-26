var map;
var earthquakeMarkers = [];
var markersArray = [];
var cityMarkersArray = [];
var previousState = {
    center: null,
    zoom: null,
    markers: [],
};
const citiesArray = {
    leon:    { lat: 42.5984, lng: -5.5725, zoom: 15, 
        places: [{name:"Cathedral",type:"church", lat:42.59944, lng:-5.56717}, 
            {name:"San Isidoro",type:"church", lat:42.60075, lng:-5.57081},
            {name: "Casa Botines",type:"monument", lat:42.5984, lng:-5.5706},
            {name: "Reino de León",type:"stadium", lat:42.5876, lng:-5.5764},
            {name: "Puente de los Leones",type:"bridge", lat:42.59604, lng:-5.57937}
        ] },
    ny: { lat: 40.7533, lng: -73.9854,  zoom: 12.5,         
        places: [{name:"Statue of Liberty",type:"monument", lat:40.6893, lng:-74.0445}, 
            {name:"Central Park",type:"park", lat:40.7818, lng:-73.9672},
            {name: "9/11 Memorial & Museum",type:"monument", lat:40.7116, lng:-74.0133},
            {name: "Yankee Stadium",type:"stadium", lat:40.8297, lng:-73.9256},
            {name: "Brooklyn Bridge",type:"bridge", lat:40.7061, lng:-73.9968}
        ] },
    tokyo:   { lat: 35.7020, lng: 139.7679, zoom: 14, 
        places: [{name:"Koyko Castle",type:"castle", lat:35.6854, lng:139.7533}, 
            {name:"Skytree of Tokyo",type:"monument", lat:35.71085, lng:139.8106},
            {name: "Senño-Ji Budist Temple",type:"church", lat:35.7159, lng:139.7971},
            {name: "Kiba Park",type:"park", lat:35.6773, lng:139.8102},
            {name: "Godzilla Head",type:"monument", lat:35.6950, lng:139.7019}
        ]},
    london: {lat: 51.4804, lng: -0.1476, zoom: 12.5, 
        places: [{name:"Wimbeldon",type:"stadium", lat:51.4337, lng:-0.2145}, 
            {name:"Hyde Park",type:"park", lat:51.5070, lng:-0.1691},
            {name: "Buckingham Palace",type:"castle", lat:51.5010, lng:-0.1426},
            {name: "Tower Bridge",type:"bridge", lat:51.5056, lng:-0.0753},
            {name: "Big Ben",type:"monument", lat:51.5006, lng:-0.1246}
        ]},
    cairo:  { lat: 30.0490, lng: 31.2247, zoom: 12.5, 
        places: [{name:"Ghiza Piramids",type:"pyramid", lat:29.97938, lng:31.13478}, 
            {name:"Cairo Citadel",type:"castle", lat:30.0287, lng:31.2599},
            {name: "Mosque of Sadiyya Zainab",type:"church",lat:30.0315, lng:31.2423},
            {name: "Egiptian Museum",type:"monument", lat:30.0484, lng:31.2338},
            {name: "Abdin Palace",type:"castle", lat:30.0432, lng:31.2474}
        ]},
    pripiat:  { lat: 51.3950, lng: 30.0766, zoom: 14.5, 
        places: [{name:"ABK-1",type:"radiation", lat:51.3900, lng:30.1010}, 
            {name:"Staryy Yakht-klub",type:"radiation", lat:51.4082, lng:30.0681},
            {name: "Yaniv",type:"radiation", lat:51.3919, lng:30.0524},
            {name: "Semykhody",type:"radiation", lat:51.3976, lng:30.1045},
            {name: "Big Wheel",type:"radiation", lat:51.4083, lng:30.0558}
        ] }
};

//function used to initialize the map
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 40, lng: -4},
        zoom:6.5,
        minZoom: 2,
        restriction: {
        latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180
        },
        strictBounds: true
    }
    });

    const selector = document.getElementById('citySelector');
    
    let lastSelected = "";

    selector.addEventListener("click", () => {
        if (selector.value === lastSelected && selector.value !== "") {
            selectCity(selector.value);
        }
    });

    selector.addEventListener("change", () => {
        lastSelected = selector.value;
        selectCity(selector.value);
    });

    document.getElementById('add').addEventListener('click', newMarker);
    document.getElementById('delete').addEventListener('click',  () => {
        deleteMarker(markersArray); 
        deleteMarker(cityMarkersArray);
        localStorage.removeItem("markers");

        map.setCenter({ lat: 40, lng: -4 });
        map.setZoom(6.5);

        
        document.getElementById('citySelector').value = "";
        document.getElementById('categoryFilter').value = "";

    });

    document.getElementById('categoryFilter').addEventListener('change', () => {
        const category = document.getElementById('categoryFilter').value;
        filterMarkersByCategory(category);
    });

    document.getElementById('earthquake').addEventListener('click', earthquakeMap);
    document.getElementById('back').addEventListener('click', restoreMap);

    loadMarkersFromLocalStorage();


}

//function used to recognise the selected city
function selectCity(){
    const city = document.getElementById('citySelector').value;
    const cityData = citiesArray[city];

    if(cityData){
        map.setCenter({lat: cityData.lat, lng: cityData.lng});
        map.setZoom(cityData.zoom);
    }

    showCityMarkers(cityData, map);
    
    const currentFilter = document.getElementById('categoryFilter').value;
    filterMarkersByCategory(currentFilter);
}

//function used to show the city markers.
function showCityMarkers(cityData, map){
    deleteMarker(cityMarkersArray);

    if (!cityData.places) return;

    cityData.places.forEach(place => {
        const marker = showIcons(place);

        cityMarkersArray.push(marker);
    });
}

//function used to show the diferent icons for each category
function showIcons(place){
    const type = place.type && place.type.trim() !== "" ? place.type : "default";
    const iconUrl = `img/${type}.png`;

    let marker = new google.maps.Marker({
        position: {lat: place.lat, lng: place.lng},
        title: place.name,
        map: map,
        icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    marker.type = type;

    google.maps.event.addListener(marker, 'mouseover', function() {
        marker.setIcon({
            url: iconUrl,
            scaledSize: new google.maps.Size(50, 50)
        });

        const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong>`
        });

        marker.addListener("click", () => {
        infoWindow.open(map, marker);
        });

    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        marker.setIcon({
            url: iconUrl,
            scaledSize: new google.maps.Size(40, 40)
        });
    });

    return marker;
}

//function used to start a new marker
function newMarker(){
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;

    if(location.trim() == ""){
        alert('You must add a location and a category');
        return;
    }

    createMarker(location, category);

}

//function used to create a marker
function createMarker(location, category){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

    fetch(url, {
        headers: {
            'User-Agent': 'MiAppMapa/1.0 (grupoe@gmail.com)'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            const place = {
                name: location,
                type: category,
                lat: lat,
                lng: lon
            };

            const marker = showIcons(place);
            
            markersArray.push(marker);
            saveMarkersToLocalStorage();

            map.setCenter({ lat, lng: lon });
            map.setZoom(12);

        }else{
            alert("Results not found");
        }
    })
    .catch(error => {
        alert("It's not posible to catch the coords.");
        console.error(error);
    });
}

//function used to save the markers into the localStorage
function saveMarkersToLocalStorage(){
    localStorage.setItem("markers", JSON.stringify(markersArray.map(marker => ({
        position: {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        },
        title: marker.getTitle(),
        icon: marker.getIcon().url,
        type: marker.type
    }))));
}

//function used to load the markers from the localStorage
function loadMarkersFromLocalStorage() {
    const storedMarkers = JSON.parse(localStorage.getItem("markers"));
    if (storedMarkers && Array.isArray(storedMarkers)) {
        storedMarkers.forEach(stored => {
            const marker = new google.maps.Marker({
                position: stored.position,
                title: stored.title,
                map: map,
                icon: {
                    url: stored.icon,
                    scaledSize: new google.maps.Size(40, 40)
                }
            });

            marker.type = stored.type;

            const infoWindow = new google.maps.InfoWindow({
                content: `<strong>${stored.title}</strong>`
            });
            marker.addListener("click", () => infoWindow.open(map, marker));

            markersArray.push(marker);
        });
    }
}

//function used to clean the map and delete all the markers
function deleteMarker(array){
    array.forEach(marker => marker.setMap(null));
    array.length = 0;
}

//function used to filter the markers by category
function filterMarkersByCategory(category) {
    markersArray.forEach(marker => {
        const type = marker.type;
        marker.setVisible(category === "" || type === category);
    });

    cityMarkersArray.forEach(marker => {
        const type = marker.type;
        marker.setVisible(category === "" || type === category);
    });
}

//function used to load the page for earthquakes
function earthquakeMap(){
    saveMap();

    document.getElementById('location').style.display = 'none';
    document.getElementById('category').style.display = 'none';
    document.getElementById('citySelector').style.display = 'none';
    document.getElementById('add').style.display = 'none';
    document.getElementById('delete').style.display = 'none';
    document.getElementById('categoryFilter').style.display = 'none';
    document.getElementById('earthquake').style.display = 'none';
    document.getElementById('back').style.display = '';

    [...markersArray, ...cityMarkersArray].forEach(marker => marker.setMap(null));

    map.setCenter({ lat: 40, lng: -4 });
    map.setZoom(5);

    loadEarthquakeMap();
}

//function used to load the info of the earthquakes
function loadEarthquakeMap(){
    //fetch to catch the info from the url and then.then to work with promises 
        fetch('https://www.ign.es/ign/RssTools/sismologia.xml')
        .then(response => response.text()) //text to catch the text or JSON from an element
        .then(data => {
            console.log(data);
            const parser = new DOMParser(); //to use a text chain from XML or HTML as DOM object
            const xml = parser.parseFromString(data, "application/xml"); //to know that it´s an XML
            const items = xml.querySelectorAll("item");

           loadEarthquakeMarker(items);

            document.getElementById('magnitudeFilter').style.display = '';
            document.getElementById('magnitudeFilter').addEventListener('change', () => {
                const selected = document.getElementById('magnitudeFilter').value;
                filterEarthquakeMarkersByMagnitude(selected);
            });


        })
        .catch(err => {
            alert("Earthquake's XML can't be charged");
            console.error(err);
        });
}

//function used to load the earthquakes markers
function loadEarthquakeMarker(items){
     items.forEach(item => {
                let title = item.querySelector("title")?.textContent || "";
                title = translateEarthquakeTitle(title);
                const lat = item.getElementsByTagName("geo:lat")[0]?.textContent;
                const lng = item.getElementsByTagName("geo:long")[0]?.textContent;
                const description = item.querySelector("description")?.textContent || "";
                const magnitude = parseMagnitudeFromDescription(description);
                const type = magnitude < 2.0 ? "micro" :
                magnitude < 4.0 ? "minor" : "light";

                if (!isNaN(lat) && !isNaN(lng)) {
                    const iconUrl = getEarthquakeIcon(magnitude);

                    const marker = new google.maps.Marker({
                        position: {lat: parseFloat(lat), lng: parseFloat(lng)},
                        map: map,
                        icon: {
                            url: iconUrl, 
                            scaledSize: new google.maps.Size(40, 40)
                        },
                        title: title
                    });
                    marker.type = type;
                    marker.magnitude = magnitude;

                    earthquakeMarkers.push(marker);

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<strong>${title}</strong>`
                    });

                    marker.addListener("click", () => infoWindow.open(map, marker));
                }
            });
}

//function used to search for the magnitude
function parseMagnitudeFromDescription(description) {
    const match = description.match(/magnitud\s*(\d+(\.\d+)?)/i);
    return match ? parseFloat(match[1]) : 0;
}

//function used to search for the correct icon
function getEarthquakeIcon(magnitude) {
    if (magnitude < 2.0) return "img/earthquake_micro.png";
    else if (magnitude < 4.0) return "img/earthquake_minor.png";
    else return "img/earthquake_light.png";
}

//funtion used to translate the title of the earthquake
function translateEarthquakeTitle(title) {
    return title
        .replace(/Terremoto/i, "Earthquake")
}

//function used to restore the map
function restoreMap() {
    deleteMarker(earthquakeMarkers);

    document.getElementById('location').style.display = '';
    document.getElementById('category').style.display = '';
    document.getElementById('citySelector').style.display = '';
    document.getElementById('add').style.display = '';
    document.getElementById('delete').style.display = '';
    document.getElementById('categoryFilter').style.display = '';
    document.getElementById('earthquake').style.display = '';
    document.getElementById('back').style.display = 'none';
    document.getElementById('magnitudeFilter').style.display = 'none';

    previousState.markers.forEach(marker => marker.setMap(map));

    [...markersArray, ...cityMarkersArray].forEach(marker => marker.setMap(null));
    
    previousState.markers.forEach(marker => marker.setMap(map));

    map.setCenter(previousState.center);
    map.setZoom(previousState.zoom);
}

//function used to save the map as it is at a specific moment
function saveMap(){
    previousState.center = map.getCenter();
    previousState.zoom = map.getZoom();
    previousState.markers = [...markersArray, ...cityMarkersArray];
}

//function used to search for a specific range of magnitude
function filterEarthquakeMarkersByMagnitude(type) {
    earthquakeMarkers.forEach(marker => {
        marker.setVisible(type === "" || marker.type === type);
    });
}
