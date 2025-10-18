//window.alert('Hello from folium');



function removeFlag(){
// Удалим флаг - не дай бог кто увидит, что есть такой флаг
$('.leaflet-control-container > .leaflet-bottom.leaflet-right > div > a > svg').remove();
}

setTimeout(()=>removeFlag, 5000);


function eduContition(schoolMarker, eduMarkerCandidate){
   if(eduMarkerCandidate.options.className != 'edu')
      return false;

   dist = window._leafleatMap.distance(schoolMarker.getLatLng(), eduMarkerCandidate.getLatLng()); 
   console.log('calcd dist:');
   console.log(dist);
   return dist <= 3000;
}

function onLayerPreClick(layerEvent) {

    console.log('marker:');
    console.log(layerEvent);

    if(!layerEvent.target instanceof L.Marker) 
        return;

    ignoredMarker = layerEvent.target;
    
    if(ignoredMarker.options.className != 'school')
        return;

    window._leafleatMap.eachLayer(layer=>{
        if(layer == ignoredMarker)
            return;
        if (layer instanceof L.Marker) {
          layer.remove();
        } 
        if (layer instanceof L.Circle) {
          layer.remove();
        } 
    });

    L.circle(ignoredMarker.getLatLng(), 3000, {color:"black", opacity:'0.2', dashArray: 6, fill:'true', fillColor: 'orange', fillOpacity: '0.3', width:1}).addTo(window._leafleatMap);

    eduMarkerList = [];
    window._edu.forEach(edu=>{
       eduLatLng = L.latLng(edu.lat, edu.lng);
       dist = window._leafleatMap.distance(ignoredMarker.getLatLng(), eduLatLng); 
       console.log('calcd dist:');
       console.log(dist);
       if(dist <= 3000){
         icon = L.AwesomeMarkers.icon(
                {
                "markerColor": "purple",
                "iconColor": "white",
                "icon": "glyphicon glyphicon-book",
                "prefix": "glyphicon",
                "extraClasses": "fa-rotate-0",
                }
         );
         eduMarker = L.marker(eduLatLng, { icon: icon }).bindPopup(edu.name).bindTooltip(edu.addr);
         eduMarkerList.push(eduMarker)
       }
    });

    if(eduMarkerList.length  >0)
      L.layerGroup(eduMarkerList).addTo(window._leafleatMap);
}

function onMapClick(mapEvent) {
     console.log('map:');
    if(window._markers.edu) 
        window._markers.edu.forEach(m=>m.remove());

    if(window._markers.school) 
        window._markers.school.forEach(m=>m.addTo(window._leafleatMap));

     window._leafleatMap.eachLayer(layer=>{
        if (layer instanceof L.Circle ||  layer instanceof L.LayerGroup) {
          layer.remove();
        }
    });
}


L.Map.addInitHook(function () {
 
  window._leafleatMap=this;

  //Ставим обработчик на преклик для всей карты
  window._leafleatMap.on('click', onMapClick);
  window._markers={};

  setTimeout(()=>{
    console.log('Время прошло');
    console.log(window._leafleatMap._layers);
    // Проходим по каждому слою (школы , еду и диаметры)
    // и устанавливаем обработчик на преклик
    window._leafleatMap.eachLayer(layer=>{
        //console.log('layer loaded');
        layer.on('preclick', onLayerPreClick)
        if(layer instanceof L.Marker) {
            if(!window._markers[layer.options.className])
                window._markers[layer.options.className] = [];
           window._markers[layer.options.className].push(layer);
        }
    });
   },
   1000);

});



