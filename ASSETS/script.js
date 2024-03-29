jQuery(document).ready(main)

function main() {
	var newMap = L.map('map').setView([46.5,2], 6);
	L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors | <a href="https://github.com/Adri-Charbonneau/birdsatlas">Adri-Charbonneau</a>'
	}).addTo(newMap);
	
	// loading GeoJSON file
	$.getJSON("https://adri-charbonneau.github.io/birdsatlas/DATA/MAILLES.geojson",function(data){
		// L.geoJson function is used to parse geojson file and load on to map
		// add GeoJSON layer to the map once the file is loaded
		var datalayer = L.geoJson(data, {
			
			onEachFeature: function(feature, featureLayer) {
				//featureLayer.bindPopup(feature.properties.maille);
				
				featureLayer.on('click', function() {
					document.getElementById('details').style.display = "block";
					document.getElementById('tuto').style.display = "none";
					var area_name = feature.properties.area_name;
					var maille = document.getElementById('maille');
					maille.textContent = feature.properties.maille;
					// var area_id = document.getElementById('area_id');
					// area_id.textContent = feature.properties.id;
					document.getElementById("area_name_url").setAttribute("href","https://oiseauxdefrance.org/prospecting?area=" + feature.properties.area_name + "&type=ATLAS_GRID");
					document.getElementById("faune_france").setAttribute("href","https://www.faune-france.org/index.php?m_id=94&sp_DChoice=all&sp_SChoice=all&sp_PChoice=grid&sp_FChoice=species&sp_Grid=" + feature.properties.id_faune_france);
					// document.getElementById("github_historic").setAttribute("href","https://adri-charbonneau.github.io/birdsatlas/SPECIES/TOTAL/CSV/ALL-SPECIES-" + feature.properties.area_name + ".csv");
					document.getElementById("area_species_2019").setAttribute("src","https://adri-charbonneau.github.io/birdsatlas/SPECIES/2019/TXT/SPECIES-2019-" + feature.properties.area_name + ".txt");
					document.getElementById("area_species_never").setAttribute("src","https://adri-charbonneau.github.io/birdsatlas/SPECIES/LIST/SPECIES-BLANKS-" + feature.properties.area_name + ".txt");
					document.getElementById("area_species_nf").setAttribute("src","https://adri-charbonneau.github.io/birdsatlas/SPECIES/LIST/SPECIES-NF-" + feature.properties.area_name + ".txt");
					featureLayer.setStyle({
						weight: 3,
						opacity: 5,
						color: 'red',
						fillOpacity: 0,	
					});
				});
				
				featureLayer.setStyle({
					weight: 1,
					opacity: 0.5,
					color: 'red',
					dashArray: '3',
					fillOpacity: 0,	
				});
				
				featureLayer.on('mouseover', function () {
					featureLayer.setStyle({
						color: 'red',
						fillOpacity: 0.5,
					});
				});
				
				featureLayer.on('mouseout', function () {
					featureLayer.setStyle({
						// weight: 1,
						// opacity: 0.5,
						color: 'red',
						dashArray: '3',
						fillOpacity: 0,	
					});
				});
				
			}
		}).addTo(newMap);
		newMap.fitBounds(datalayer.getBounds());

		// USER LOCATION
		L.control.locate().addTo(newMap);
		//L.control.search().addTo(newMap);

		// SCALE
		L.control.scale({
			metric: true,
			imperial: false,
			position: 'bottomright'
		}).addTo(newMap)
		
		// WATERMARK
		L.Control.Watermark = L.Control.extend({
			onAdd: function (newMap) {
				var img = L.DomUtil.create('img');
				
				img.src = 'https://adri-charbonneau.github.io/birdsatlas/ASSETS/ICON.png';
				img.style.width = '100px';
				
				return img;
			},
			
			onRemove: function (newMap) {
				// Nothing to do here
			}
		});
		
		L.control.watermark = function (opts) {
			return new L.Control.Watermark(opts);
		};
		
		var watermarkControl = L.control.watermark({position: 'topright'}).addTo(newMap);
		
		// SEARCH
		newMap.addControl( new L.Control.Search({
			url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
			jsonpParam: 'json_callback',
			propertyName: 'display_name',
			propertyLoc: ['lat','lon'],
			marker: L.circleMarker([0,0],{radius:30}),
			autoCollapse: true,
			autoType: false,
			minLength: 2
		}) );
		
		
		
	});
}