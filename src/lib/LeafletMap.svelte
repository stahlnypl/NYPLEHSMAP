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
		}
	});

	// console.log('Supabase: ', supabase);

	let mapElement;
	let map;
	let lng, lat, zoom;

	lng = -74.0;
	lat = 40.7;
	zoom = 10;

	function updateData() {
		zoom = map.getZoom();
		lng = map.getCenter().lng;
		lat = map.getCenter().lat;
	}

	onMount(async () => {
		console.log(window.innerWidth);
		if (browser) {
			const L = await import('leaflet');
			await import('leaflet.locatecontrol');
			await import('leaflet.control.layers.tree');
			await import('leaflet.control.layers.tree/L.Control.Layers.Tree.css');
			await import('leaflet-search/dist/leaflet-search.src.css');
			await import('leaflet-search');

			if (window.innerWidth < 800) {
				zoom = 10;
			} else {
				zoom = 11;
			}

			const initialState = { lng: lng, lat: lat, zoom: zoom };

			map = L.map(mapElement, { zoomControl: true, maxZoom: 25, minZoom: 10 }).setView(
				[initialState.lat, initialState.lng],
				initialState.zoom
			);

			console.log('Initial Bounds: ', map.getBounds());

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
			var aedCheck = L.featureGroup();

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

				console.log('libs: ', libs.libraries);

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
						markers[e.code] = L.marker([e.Y, e.X], { icon: sasbIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
						markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'LPA') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: lpaIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
						markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'SCH') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: schIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
						markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'LSC') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: lscIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
						markersLayer.addLayer(markers[e.code]);
					} else {
						markers[e.code] = L.marker([e.Y, e.X], { icon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip()
							.addTo(map);
						markersLayer.addLayer(markers[e.code]);
					}

					// Marking Sites that are closed
					if (e.status === 'Closed') {
						markers[e.code].setOpacity(0.25);
					}

					markers[e.code].alt = e.name;

					if (e.network === 'W-BX') {
						markers[e.code].addTo(wbronx);
					} else if (e.network === 'C-BX') {
						markers[e.code].addTo(cbronx);
					} else if (e.network === 'E-BX') {
						markers[e.code].addTo(ebronx);
					} else if (e.network === 'W-MH') {
						markers[e.code].addTo(wman);
					} else if (e.network === 'E-MH') {
						markers[e.code].addTo(eman);
					} else if (e.network === 'L-MH') {
						markers[e.code].addTo(lman);
					} else if (e.network === 'SI') {
						markers[e.code].addTo(sisle);
					} else if (e.network === 'NYPL') {
						markers[e.code].addTo(adminSites);
					}

					if (e.name != null) {
						markers[e.code].addTo(allSites);
					}

					if (e.aed_check != true) {
						markers[e.code].addTo(aedCheck);
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

					markers[e.code].bindPopup(popupContent);

					// Marker Properties Array Check
					// console.log(i, markers[e.code].alt, e.name)
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

				const markerTitle = options.title;

				console.log('Markers: ', markers, markers['SASB']);

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
												{ label: 'Francis Martin', layer: markers['FXR'] },
												{ label: 'Grand Concourse', layer: markers['GD'] },
												{ label: 'High Bridge', layer: markers['HB'] },
												{ label: 'Jerome Park', layer: markers['JP'] },
												{ label: 'Kingsbridge', layer: markers['KBR'] },
												{ label: 'Melrose', layer: markers['ME'] },
												{ label: 'Mosholu', layer: markers['MO'] },
												{ label: 'Riverdale', layer: markers['RD'] },
												{ label: 'Sedgwick', layer: markers['SD'] },
												{ label: 'Spuyten Duyvil', layer: markers['DY'] },
												{ label: 'Van Cortlandt', layer: markers['VC'] },
												{ label: 'Woodlawn Heights', layer: markers['WL'] }
											]
										},
										{
											label: 'Central Bronx',
											selectAllCheckbox: true,
											// layer: cbronx,
											collapsed: true,
											children: [
												{ label: 'Allerton', layer: markers['AL'] },
												{ label: 'Belmont', layer: markers['BER'] },
												{ label: 'Bronx Library Center', layer: markers['BLC'] },
												{ label: "Clasons's Point", layer: markers['CP'] },
												{ label: "Hunt's Point", layer: markers['HSR'] },
												{ label: 'Morris Park', layer: markers['MP'] },
												{ label: 'Morrisania', layer: markers['MR'] },
												{ label: 'Mott Haven', layer: markers['MH'] },
												{ label: 'Pelham Parkway-Van Nest', layer: markers['VN'] },
												{ label: 'Tremont', layer: markers['TM'] },
												{ label: 'West Farms', layer: markers['WF'] },
												{ label: 'Woodstock', layer: markers['WO'] }
											]
										},
										{
											label: 'East Bronx',
											selectAllCheckbox: true,
											// layer: ebronx,
											collapsed: true,
											children: [
												{ label: 'Baychester', layer: markers['BAR'] },
												{ label: 'Castle Hill', layer: markers['CT'] },
												{ label: 'City Island', layer: markers['CI'] },
												{ label: 'Eastchester', layer: markers['EA'] },
												{ label: 'Edenwald', layer: markers['EW'] },
												{ label: 'Parkchester', layer: markers['PKR'] },
												{ label: 'Pelham Bay', layer: markers['PM'] },
												{ label: 'Soundview', layer: markers['SV'] },
												{ label: "Throg's Neck", layer: markers['TG'] },
												{ label: 'Wakefield', layer: markers['WK'] },
												{ label: 'Westchester Square', layer: markers['WT'] }
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
												{ label: '115th St', layer: markers['HU'] },
												{ label: 'Bloomingdale', layer: markers['BLR'] },
												{ label: 'Columbus', layer: markers['CS'] },
												{ label: 'Fort Washington', layer: markers['FW'] },
												{ label: 'George Bruce', layer: markers['BR'] },
												{ label: 'Hamilton Grange', layer: markers['HG'] },
												{ label: 'Inwood', layer: markers['INR'] },
												{ label: "Macomb's Bridge", layer: markers['MB'] },
												{ label: 'Morningside Heights', layer: markers['CL'] },
												{ label: 'Muhlenberg', layer: markers['MU'] },
												{ label: 'Riverside', layer: markers['R'] },
												{ label: 'St. Agnes', layer: markers['SA'] },
												{ label: 'Washington Heights', layer: markers['WH'] }
											]
										},
										{
											label: 'East Manhattan',
											selectAllCheckbox: true,
											// layer: eman,
											collapsed: true,
											children: [
												{ label: '125th St', layer: markers['HD'] },
												{ label: '53rd St', layer: markers['53STR'] },
												{ label: '58th St', layer: markers['FE'] },
												{ label: '67th St', layer: markers['SS'] },
												{ label: '96th St', layer: markers['NRS'] },
												{ label: 'Aguilar', layer: markers['AG'] },
												{ label: 'Countee Cullen', layer: markers['CC'] },
												{ label: 'Grand Central', layer: markers['GCB'] },
												{ label: 'Harlem', layer: markers['HL'] },
												{ label: 'Roosevelt Island', layer: markers['RI'] },
												{ label: 'Cathedral', layer: markers['CA'] },
												{ label: 'Webster', layer: markers['WB'] },
												{ label: 'Yorkville', layer: markers['YV'] }
											]
										},
										{
											label: 'Lower Manhattan',
											selectAllCheckbox: true,
											// layer: lman,
											collapsed: true,
											children: [
												{ label: 'Andrew Heiskell', layer: markers['LB'] },
												{ label: 'Battery Park', layer: markers['BPC'] },
												{ label: 'Chatham Square', layer: markers['CHR'] },
												{ label: 'Epiphany', layer: markers['EP'] },
												{ label: 'Hamilton Fish Park', layer: markers['HF'] },
												{ label: 'Hudson Park', layer: markers['HP'] },
												{ label: 'Jefferson Market', layer: markers['JMR'] },
												{ label: 'Kips Bay', layer: markers['KP'] },
												{ label: 'Mulberry St', layer: markers['ML'] },
												{ label: 'New Amsterdam', layer: markers['LM'] },
												{ label: 'Ottendorfer', layer: markers['OT'] },
												{ label: 'Science, Industry, & Business', layer: markers['SIBL'] },
												{ label: 'Seward Park', layer: markers['SE'] },
												{ label: "Tompkin's Square", layer: markers['TS'] }
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
										{ label: 'Charleston', layer: markers['CN'] },
										{ label: 'Dongan Hills', layer: markers['DH'] },
										{ label: 'Great Kills', layer: markers['GK'] },
										{ label: 'Huguenot Park', layer: markers['HK'] },
										{ label: 'Mariners Harbor', layer: markers['MN'] },
										{ label: 'New Dorp', layer: markers['NDR'] },
										{ label: 'Port Richmond', layer: markers['PR'] },
										{ label: 'Richmondtown', layer: markers['RT'] },
										{ label: 'South Beach', layer: markers['SB'] },
										{ label: 'St. George', layer: markers['SGC'] },
										{ label: 'Stapleton', layer: markers['ST'] },
										{ label: 'Todt Hill-Westerleigh', layer: markers['THR'] },
										{ label: 'Tottenville', layer: markers['TV'] },
										{ label: 'West New Brighton', layer: markers['NB'] }
									]
								},
								{
									label: 'Admin',
									// layer: adminSites,
									selectAllCheckbox: true,
									collapsed: true,
									children: [
										{ label: 'Library Services Center', layer: markers['LSC'] },
										{ label: 'Library for The Performing Arts', layer: markers['LPA'] },
										{ label: 'Schomburg', layer: markers['SCH'] },
										{ label: 'Stavros Niarchos', layer: markers['SNFL'] },
										{ label: 'Stephen A Schwartzman', layer: markers['SASB'] }
									]
								}
							]
						},
						{
							label: 'Projects',
							selectAllCheckbox: false,
							collapsed: false,
							children: [{ label: 'AEDs', layer: aedCheck }]
						}
					]
				};
				const treeLayerControl = L.control.layers.tree(baseTree, mapRoutes, options);

				treeLayerControl.addTo(map);

				var LayerControlContainer = document.querySelector(
					'body > div > main > section > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section'
				);

				var CollapseBtn = `<div><img class="layerControlToggle" style="float:right;" src="https://raw.githubusercontent.com/stahlnypl/NYPLEHSMAP/main/static/Data/images/lct_button.png"></div>`;

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
		Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom: {zoom.toFixed(2)} <br />v:
		0.0.4a
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
		line-height: 1.5;
	}
</style>
