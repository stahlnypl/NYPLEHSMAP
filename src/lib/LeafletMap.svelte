<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	


	// Initialize Supabase client
	const supabaseUrl = 'https://fcmkyfkiiblxmbgwuegf.supabase.co';
	const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  
}});

	// console.log('Supabase: ', supabase);

	let mapElement;
	let map;
	let lng, lat, zoom;

	lng = -74.0;
	lat = 40.7;
	zoom = 11;

	function updateData() {
		zoom = map.getZoom();
		lng = map.getCenter().lng;
		lat = map.getCenter().lat;
	}

	onMount(async () => {
		console.log(window.innerWidth)
		if (browser) {
			const L = await import('leaflet');
			await import('leaflet.locatecontrol');
			await import('leaflet.control.layers.tree');
			await import('leaflet.control.layers.tree/L.Control.Layers.Tree.css');
			await import('leaflet-search/dist/leaflet-search.src.css');
			await import('leaflet-search');

			const initialState = { lng: lng, lat: lat, zoom: zoom };

			map = L.map(mapElement, { zoomControl: true, maxZoom: 25, minZoom: 11 }).setView(
				[initialState.lat, initialState.lng],
				initialState.zoom
			);

			// console.log('Initial Bounds: ', map.getBounds());

			map.setMaxBounds(map.getBounds());

			var accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

			L.tileLayer(
				'https://api.mapbox.com/styles/v1/stahlstradamus/cloecokpb001v01p80phr35aj/tiles/{z}/{x}/{y}?access_token=' +
					accessToken,
				{
					attribution:
						'© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
						maxZoom: 25
				}
			).addTo(map);

			map.on('move', () => {
				updateData();
			});

			var baseTree = {
				label: 'Base Maps',
				children: []
			};

			var options = {
				collapseAll: '',
				collapsed: false
			};

			// display/hide lat long info
			document.addEventListener('keypress', (e) => {
				if (e.code == 'Backquote') {
					console.log('wow!');
					var sb = document.querySelector('.sidebar');
					if (sb.style.zIndex <= 0) {
						sb.style.zIndex = 999;
					} else {
						sb.style.zIndex = -1;
					}
				}
			});

			var wbronx = L.featureGroup();
			var cbronx = L.featureGroup();
			var ebronx = L.featureGroup();
			var wman = L.featureGroup();
			var eman = L.featureGroup();
			var lman = L.featureGroup();
			var sisle = L.featureGroup();
			var allSites = L.featureGroup();
			var adminSites = L.featureGroup();
			var routeLayers;

			async function fetchData() {
				const { data } = await supabase.from('libraries').select('*');
				// console.log(data);
				return {
					libraries: data ?? []
				};
			}

			// Tooltip Label Creation //
			var tooltipThreshold = 18;
			var lastZoom;
			map.on('zoomend', function () {
				var zoom = map.getZoom();
				if (zoom < tooltipThreshold && (!lastZoom || lastZoom >= tooltipThreshold)) {
					map.eachLayer(function (l) {
						if (l.getTooltip()) {
							var tooltip = l.getTooltip();
							l.unbindTooltip().bindTooltip(tooltip, {
								permanent: false
							});
						}
					});
				} else if (zoom >= tooltipThreshold && (!lastZoom || lastZoom < tooltipThreshold)) {
					map.eachLayer(function (l) {
						if (l.getTooltip()) {
							var tooltip = l.getTooltip();
							l.unbindTooltip().bindTooltip(tooltip, {
								permanent: true
							});
						}
					});
				}
				lastZoom = zoom;
			});

			async function addMarkersToMap(map, libs) {
				var icon = L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/stahlenstein/nyplehsMap/main/static/icons/branch.svg',
					iconSize: [15, 15]
				});

				var sasbIcon = L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/stahlenstein/nyplehsMap/main/static/icons/SASB.svg',
					iconSize: [15, 15]
				});

				var lpaIcon = L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/stahlenstein/nyplehsMap/main/static/icons/LPA.svg',
					iconSize: [15, 15]
				});

				var schIcon = L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/stahlenstein/nyplehsMap/main/static/icons/Burg.svg',
					iconSize: [15, 15]
				});

				var lscIcon = L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/stahlenstein/nyplehsMap/main/static/icons/LSC.svg',
					iconSize: [15, 15]
				});

				let markers = [];
				var markersLayer = new L.LayerGroup();
					map.addLayer(markersLayer);

					console.log('libs: ', libs.libraries)

					var libData = {};
					libs.libraries.forEach((f, i) => {
						var objectKeyName = f.code;
						libData[objectKeyName] = f

					});
					// console.log('new object: ', libData)

				// Adding tooltips to each Marker
				libs.libraries.forEach((e, i) => {
					var tooltip = L.tooltip([e.Y, e.X], {
						content: e.name,
						permanent: false,
						direction: 'auto',
						offset: [10, 0]
					});

					// console.log(e)



					// Creating Markers, Assigning icons, and Adding to Layer
					if (e.code === 'SASB') {
						markers[i] = L.marker([e.Y, e.X], { icon: sasbIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
						markersLayer.addLayer(markers[i]);
					} else if (e.code === 'LPA') {
						markers[i] = L.marker([e.Y, e.X], { icon: lpaIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
							markersLayer.addLayer(markers[i]);
					} else if (e.code === 'SCH') {
						markers[i] = L.marker([e.Y, e.X], { icon: schIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
							markersLayer.addLayer(markers[i]);
					} else if (e.code === 'LSC') {
						markers[i] = L.marker([e.Y, e.X], { icon: lscIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
							markersLayer.addLayer(markers[i]);
					} else {
						markers[i] = L.marker([e.Y, e.X], { icon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
							markersLayer.addLayer(markers[i]);
					}

					// Marking Sites that are closed
					if(e.status === 'Closed') {
						markers[i].setOpacity(.25);
						
					}


					markers[i].alt = e.name;

					if (e.network === 'W-BX') {
						markers[i].addTo(wbronx);
					} else if (e.network === 'C-BX') {
						markers[i].addTo(cbronx);
					} else if (e.network === 'E-BX') {
						markers[i].addTo(ebronx);
					} else if (e.network === 'W-MH') {
						markers[i].addTo(wman);
					} else if (e.network === 'E-MH') {
						markers[i].addTo(eman);
					} else if (e.network === 'L-MH') {
						markers[i].addTo(lman);
					} else if (e.network === 'SI') {
						markers[i].addTo(sisle);
					} else if (e.network === 'NYPL') {
						markers[i].addTo(adminSites);
					}

					if (e.name != null) {
						markers[i].addTo(allSites);
					}

					// console.log(e);

					var popupContent = `
										<table>
					  <thead>
					    <tr>
					      <th colspan="2" style="padding-bottom:1em">${e.name}</th>
					    </tr>
					  </thead>
					  <tbody>
						<tr>
							<td style="text-align: right">Address: </td>
							<td>${e.housenum} ${e.streetname}</td>
					    <tr>
					      <td style="text-align: right">Network: </td>
					      <td>${e.network}</td>
					    </tr>
					    <tr>

					      <td style="padding-bottom: 1em; text-align: right">Code: </td>
					      <td style="padding-bottom: 1em">${e.code}</td>
					    </tr>
					    <tr>
					      <td style="padding-bottom: 1em; text-align: right">Status: </td>
					      <td style="padding-bottom: 1em">${e.status}</td>
					    </tr>
					    <tr>
					      <td style="text-align: right">Coordinator: </td>
					      <td>${e.coordinator}</td>
					    </tr>
					  </tbody>
					</table>
										`;

					markers[i].bindPopup(popupContent);

					// Marker Properties Array Check
					// console.log(i, markers[i].alt, e.name)
					;
				});

				//... adding data in searchLayer ...
				map.addControl(
					new L.Control.Search({
						layer: markersLayer,
						initial: false,
						zoom: 17,
						marker: false
					})
				);
				//searchLayer is a L.LayerGroup contains searched markers

				const markerTitle = options.title

				console.log('Markers: ', markers.values())
				

				var mapRoutes = {
					label: 'Branches',
					selectAllCheckbox: true,
					// layer: allSites,
					children: [
						{
							label: 'Networks',
							children: [
								{
									label: 'Bronx',
									children: [
										{
											label: 'West Bronx',
											selectAllCheckbox: true,
											// layer: wbronx,
											collapsed: true,
											children: [
												{ label: 'Francis Martin', layer: markers[27] },
												{ label: 'Grand Concourse', layer: markers[30] },
												{ label: 'High Bridge', layer: markers[35] },
												{ label: 'Jerome Park', layer: markers[41] },
												{ label: 'Kingsbridge', layer: markers[42] },
												{ label: 'Melrose', layer: markers[46] },
												{ label: 'Mosholu', layer: markers[50] },
												{ label: 'Riverdale', layer: markers[62] },
												{ label: 'Sedgwick', layer: markers[66] },
												{ label: 'Spuyten Duyvil', layer: markers[70] },
												{ label: 'Van Cortlandt', layer: markers[80] },
												{ label: 'Woodlawn Heights', layer: markers[90] }
											]
										},
										{
											label: 'Central Bronx',
											selectAllCheckbox: true,
											// layer: cbronx,
											collapsed: true,
											children: [
												{ label: 'Allerton', layer: markers[9] },
												{ label: 'Belmont', layer: markers[13] },
												{ label: 'Bronx Library Center', layer: markers[15] },
												{ label: "Clasons's Point", layer: markers[19] },
												{ label: "Hunt's Point", layer: markers[38] },
												{ label: 'Morris Park', layer: markers[48] },
												{ label: 'Morrisania', layer: markers[49] },
												{ label: 'Mott Haven', layer: markers[51] },
												{ label: 'Pelham Parkway-Van Nest', layer: markers[59] },
												{ label: 'Tremont', layer: markers[79] },
												{ label: 'West Farms', layer: markers[84] },
												{ label: 'Woodstock', layer: markers[91] }
											]
										},
										{
											label: 'East Bronx',
											selectAllCheckbox: true,
											// layer: ebronx,
											collapsed: true,
											children: [
												{ label: 'Baychester', layer: markers[12] },
												{ label: 'Castle Hill', layer: markers[16] },
												{ label: 'City Island', layer: markers[18] },
												{ label: 'Eastchester', layer: markers[23] },
												{ label: 'Edenwald', layer: markers[24] },
												{ label: 'Parkchester', layer: markers[57] },
												{ label: 'Pelham Bay', layer: markers[58] },
												{ label: 'Soundview', layer: markers[68] },
												{ label: "Throg's Neck", layer: markers[75] },
												{ label: 'Wakefield', layer: markers[81] },
												{ label: 'Westchester Square', layer: markers[89] }
											]
										}
									]
								},
								{
									label: 'Manhattan',
									children: [
										{
											label: 'West Manhattan',
											selectAllCheckbox: true,
											// layer: wman,
											collapsed: true,
											children: [
												{ label: '115th St', layer: markers[2] },
												{ label: 'Bloomingdale', layer: markers[14] },
												{ label: 'Columbus', layer: markers[20] },
												{ label: 'Fort Washington', layer: markers[26] },
												{ label: 'George Bruce', layer: markers[28] },
												{ label: 'Hamilton Grange', layer: markers[33] },
												{ label: 'Inwood', layer: markers[39] },
												{ label: "Macomb's Bridge", layer: markers[44] },
												{ label: 'Morningside Heights', layer: markers[47] },
												{ label: 'Muhlenberg', layer: markers[52] },
												{ label: 'Riverside', layer: markers[63] },
												{ label: 'St. Agnes', layer: markers[71] },
												{ label: 'Washington Heights', layer: markers[82] }
											]
										},
										{
											label: 'East Manhattan',
											selectAllCheckbox: true,
											// layer: eman,
											collapsed: true,
											children: [
												{ label: '125th St', layer: markers[3] },
												{ label: '53rd St', layer: markers[4] },
												{ label: '58th St', layer: markers[5] },
												{ label: '67th St', layer: markers[6] },
												{ label: '96th St', layer: markers[7] },
												{ label: 'Aguilar', layer: markers[8] },
												{ label: 'Countee Cullen', layer: markers[21] },
												{ label: 'Grand Central', layer: markers[29] },
												{ label: 'Harlem', layer: markers[34] },
												{ label: 'Roosevelt Island', layer: markers[64] },
												{ label: 'Cathedral', layer: markers[74] },
												{ label: 'Webster', layer: markers[83] },
												{ label: 'Yorkville', layer: markers[92] }
											]
										},
										{
											label: 'Lower Manhattan',
											selectAllCheckbox: true,
											// layer: lman,
											collapsed: true,
											children: [
												{ label: 'Andrew Heiskell', layer: markers[10] },
												{ label: 'Battery Park', layer: markers[11] },
												{ label: 'Chatham Square', layer: markers[17] },
												{ label: 'Epiphany', layer: markers[25] },
												{ label: 'Hamilton Fish Park', layer: markers[32] },
												{ label: 'Hudson Park', layer: markers[36] },
												{ label: 'Jefferson Market', layer: markers[40] },
												{ label: 'Kips Bay', layer: markers[43] },
												{ label: 'Mulberry St', layer: markers[53] },
												{ label: 'New Amsterdam', layer: markers[54] },
												{ label: 'Ottendorfer', layer: markers[56] },
												{ label: 'Science, Industry, & Business', layer: markers[65] },
												{ label: 'Seward Park', layer: markers[67] },
												{ label: "Tompkin's Square", layer: markers[77] }
											]
										}
									]
								},
								{
									label: 'Staten Island',
									// layer: sisle,
									selectAllCheckbox: true,
									collapsed: true,
									children: [
										{ label: 'Dongan Hills', layer: markers[22] },
										{ label: 'Great Kills', layer: markers[31] },
										{ label: 'Huguenot Park', layer: markers[37] },
										{ label: 'Mariners Harbor', layer: markers[45] },
										{ label: 'New Dorp', layer: markers[55] },
										{ label: 'Port Richmond', layer: markers[60] },
										{ label: 'Richmondtown', layer: markers[61] },
										{ label: 'South Beach', layer: markers[69] },
										{ label: 'St. George', layer: markers[72] },
										{ label: 'Stapleton', layer: markers[73] },
										{ label: 'Todt Hill-Westerleigh', layer: markers[76] },
										{ label: 'Tottenville', layer: markers[78] },
										{ label: 'West New Brighton', layer: markers[88] }
									]
								},
								{
									label: 'Admin',
									// layer: adminSites,
									selectAllCheckbox: true,
									collapsed: true,
									children: [
										{ label: 'Library Services Center', layer: markers[0] },
										{ label: 'Library for The Performing Arts', layer: markers[85] },
										{ label: 'Schomburg', layer: markers[86] },
										{ label: 'Stavros Niarchos', layer: markers[1] },
										{ label: 'Stephen A Schwartzman', layer: markers.find((e) => e.options.title === 'SASB') }
									]
								}
							]
						},
						{
							label: 'Problems',
							selectAllCheckbox: false,
							collapsed: false,
							children: [{ label: 'Dead Head', layer: routeLayers }]
						}
					]
				};
				const treeLayerControl = L.control.layers.tree(baseTree, mapRoutes, options);

				treeLayerControl.addTo(map);

				var LayerControlContainer = document.querySelector(
					'body > div > main > section > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section'
				);

				var CollapseBtn = `<div><img class="layerControlToggle" style="float:right;" src="/Data/images/lct_button.png"></div>`;

				LayerControlContainer.insertAdjacentHTML('afterbegin', CollapseBtn);

				var layerCollapseBtn = document.querySelector(
					'body > div > main > section > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div:nth-child(1)'
				);

				layerCollapseBtn.addEventListener('click', () => {
					document
						.querySelector('div.header-bg > span')
						.removeAttribute('leaflet-control-layers-expanded');
					document
						.querySelector(
							'body > div > main > section > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div'
						)
						.setAttribute(
							'class',
							'leaflet-control-layers leaflet-control-layers-collapsed leaflet-control'
						);
				});

				var titleSpan = document.querySelector('div.header-bg');

				titleSpan.addEventListener('click', () => {
					document.querySelector('body > div > main > section').removeChild(titleSpan);
					console.log('Title Span Clicked!');
				});
			}

			async function meterAdditionData() {
				try {
					const libs = await fetchData();
					console.log(libs);
					addMarkersToMap(map, libs);
				} catch (error) {
					console.error('Error: ', error);
				}
			}

			meterAdditionData();

			L.control
				.locate({
					icon: 'leaflet-control-locate-location-arrow',
					initialZoomLevel: 18
				})
				.addTo(map);
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<section>
	<div bind:this={mapElement} />
	<div class="header-bg">
		<span>NYPL Environmental Health & Safety Map</span>
	</div>
	<div class="sidebar">
		Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom: {zoom.toFixed(2)}
	</div>
</section>

<style>
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet-search/dist/leaflet-search.src.css';
	section div {
		height: 100vh;
	}

	.header-bg {
		position: fixed;
		display: flex;
		top: 1rem;
		left: 5rem;
		background: rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(4.5px);
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		z-index: 999;
		height: fit-content;
	}

	.header-bg > span {
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		font-size: x-large;
		font-weight: normal;
		color: #415462;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}

	.sidebar {
		background-color: rgba(35, 55, 75, 0.9);
		color: #fff;
		padding: 6px 12px;
		font-family: monospace;
		z-index: -1;
		position: absolute;
		bottom: 1%;
		left: 1%;
		margin: 12px;
		border-radius: 4px;
		height: auto;
	}
</style>
