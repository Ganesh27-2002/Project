
            mapboxgl.accessToken = mapToken;
            
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                center: listing.geometry.coordinates, // starting position [lng, lat]
                zoom: 10 // starting zoom
            });
            // console.log(coordinates);

           const marker= new mapboxgl.Marker({color:"red",rotation:45})
           
           .setLngLat(listing.geometry.coordinates)
           .setPopup(
            new mapboxgl.Popup({offset: 25})
            
            .setHTML(`<h4>${listing.title}</h4><h6>Exact Location Of the Listing.</h6>`)
           )
           .addTo(map);