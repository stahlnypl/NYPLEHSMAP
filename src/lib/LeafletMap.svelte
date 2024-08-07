<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import { loadJSONData } from './components/dataloader.js';

	// Initialize Supabase client
	const supabaseUrl = 'https://fcmkyfkiiblxmbgwuegf.supabase.co';
	const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey, {
		auth: {
			persistSession: false
		}
	});

	// console.log('Supabase: ', supabase);

	// Calling Empty Variables //
	let mapElement;
	let map;
	let lng, lat, zoom;

	// Assigning Initial View Values //
	lng = -74.0;
	lat = 40.7;
	zoom = 10;

	// Function for Developer Element //
	function updateData() {
		zoom = map.getZoom();
		lng = map.getCenter().lng;
		lat = map.getCenter().lat;
	}

	// Initalizing Leaflet Map on Mount of Svelte //
	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');
			await import('leaflet.locatecontrol');
			await import('leaflet.control.layers.tree');
			await import('leaflet.control.layers.tree/L.Control.Layers.Tree.css');
			await import('leaflet-search/dist/leaflet-search.src.css');
			await import('leaflet-search');

			// Zoom Value Dependant on Screen Size (Phone vs Desktop)
			if (window.innerWidth < 800) {
				zoom = 10;
			} else {
				zoom = 11;
			}

			// Setting up Initial View for Leaflet Map
			const initialState = { lng: lng, lat: lat, zoom: zoom };

			// Createing Map Element and Settings
			map = L.map(mapElement, { zoomControl: true, maxZoom: 25, minZoom: 10 }).setView(
				[initialState.lat, initialState.lng],
				initialState.zoom
			);

			// Setting Maximum Bounds to Focus on only NYC
			map.setMaxBounds(map.getBounds());

			// Assigning Mapbox API Token
			var accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

			// Creating MapBox Light Theme Tile Layer
			var lightTheme = L.tileLayer(
				'https://api.mapbox.com/styles/v1/stahlstradamus/clrb4kx8p005v01qo3vaef7k7/tiles/{z}/{x}/{y}?access_token=' +
					accessToken,
				{
					attribution:
						'© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					maxZoom: 25
				}
			);

			// Creating MapBox Dark Theme Tile Layer
			var darkTheme = L.tileLayer(
				'https://api.mapbox.com/styles/v1/stahlstradamus/clrb52eso006901pi7jv416qa/tiles/{z}/{x}/{y}?access_token=' +
					accessToken,
				{
					attribution:
						'© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					maxZoom: 25
				}
			).addTo(map);

			// var baseLayers = {
			// 	'Dark Theme': darkTheme,
			// 	'Light Theme': lightTheme
			// };

			// Event listener to Display Location Data in Developer Element
			map.on('move', () => {
				updateData();
			});

			// Assigning Base Maps for Layer Control Tree
			var baseTree = {
				label: 'Base Maps',
				children: [
					{ label: 'Light Theme', layer: lightTheme },
					{ label: 'Dark Theme', layer: darkTheme }
				]
			};

			// Options for Layer Control Tree
			var options = {
				collapseAll: '',
				collapsed: false
			};

			// Display/Hide Developer Lat Long Info
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

			// Setting Variables for Layer Control Tree
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
			var ehsCheck = L.featureGroup();
			var roofCheck = L.featureGroup();
			var mewpCheck = L.featureGroup();
			var hvacCheck = L.featureGroup();
			var noSites = L.featureGroup();
			var netLMH = L.featureGroup();
			var netEMH = L.featureGroup();
			var netWMH = L.featureGroup();
			var netWBX = L.featureGroup();
			var netCBX = L.featureGroup();
			var netEBX = L.featureGroup();
			var netNSI = L.featureGroup();
			var netSSI = L.featureGroup();
			var netBX = L.featureGroup();
			var netMH = L.featureGroup();
			var netSI = L.featureGroup();

			// Asyncronous Fucction to Call Supabase Library Data
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

			// Loading GeoJSON from component
			const JsonData = await loadJSONData();

			// Styling GeoJSON
			if (JsonData) {
				var Netstyle = {
					style: function (feature) {
						switch (feature.properties.Network) {
							case 'L-MH':
								return { color: '#0059FF' };
							case 'E-MH':
								return { color: '#5DB2D4' };
							case 'W-MH':
								return { color: '#2E85E9' };
							case 'W-BX':
								return { color: '#A690FE' };
							case 'C-BX':
								return { color: '#7B48FE' };
							case 'E-BX':
								return { color: '#5100FF' };
							case 'N-SI':
								return { color: '#89E88D' };
							case 'S-SI':
								return { color: '#187900' };
						}
					},
					weight: 1,
					fillOpacity: 0.5
				};

				// console.log('NET Style: ', Netstyle);

				// Adding featureGroup
				JsonData.features.forEach((c) => {
					var Net_vals = c.properties.Network;

					if (Net_vals === 'L-MH') {
						L.geoJSON(c, Netstyle).addTo(netLMH);
						L.geoJSON(c, Netstyle).addTo(netMH);
					}
					if (Net_vals === 'E-MH') {
						L.geoJSON(c, Netstyle).addTo(netEMH);
						L.geoJSON(c, Netstyle).addTo(netMH);
					}
					if (Net_vals === 'W-MH') {
						L.geoJSON(c, Netstyle).addTo(netWMH);
						L.geoJSON(c, Netstyle).addTo(netMH);
					}
					if (Net_vals === 'W-BX') {
						L.geoJSON(c, Netstyle).addTo(netWBX);
						L.geoJSON(c, Netstyle).addTo(netBX);
					}
					if (Net_vals === 'C-BX') {
						L.geoJSON(c, Netstyle).addTo(netCBX);
						L.geoJSON(c, Netstyle).addTo(netBX);
					}
					if (Net_vals === 'E-BX') {
						L.geoJSON(c, Netstyle).addTo(netEBX);
						L.geoJSON(c, Netstyle).addTo(netBX);
					}
					if (Net_vals === 'N-SI') {
						L.geoJSON(c, Netstyle).addTo(netNSI);
						L.geoJSON(c, Netstyle).addTo(netSI);
					}
					if (Net_vals === 'S-SI') {
						L.geoJSON(c, Netstyle).addTo(netSSI);
						L.geoJSON(c, Netstyle).addTo(netSI);
					}
				});

				// Adding Layers to Map
				var Net_Data = L.geoJSON(JsonData, Netstyle);
			}

			// Asyncronous Function to create Markers for Data
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

				var tnIcon = L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/stahlenstein/nyplehsMap/main/static/icons/270mad.svg',
					iconSize: [15, 15]
				});

				// Setting Variables for Marker Groups
				let markers = [];
				var markersLayer = new L.LayerGroup();
				map.addLayer(markersLayer);

				// console.log('libs: ', libs.libraries);

				// Adding tooltips to each Marker
				libs.libraries.forEach((e, i) => {
					var tooltip = L.tooltip([e.Y, e.X], {
						content: e.name,
						permanent: false,
						direction: 'auto',
						offset: [10, 0]
					});

					// console.log(Data);

					// Creating Markers, Assigning icons, and Adding to Layer
					if (e.code === 'SASB') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: sasbIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip();
						// .addTo(map);
						// markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'LPA') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: lpaIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip();
						// .addTo(map);
						// markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'SCH') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: schIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip();
						// .addTo(map);
						// markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'LSC') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: lscIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip();
						// .addTo(map);
						// markersLayer.addLayer(markers[e.code]);
					} else if (e.code === 'TN') {
						markers[e.code] = L.marker([e.Y, e.X], { icon: tnIcon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip();
						// .addTo(map);
						// markersLayer.addLayer(markers[e.code]);
					} else {
						markers[e.code] = L.marker([e.Y, e.X], { icon, title: e.code })
							.bindTooltip(tooltip)
							.openTooltip();
						// .addTo(map);
						// markersLayer.addLayer(markers[e.code]);
					}

					// Marking Sites that are closed
					if (e.status === 'Closed') {
						markers[e.code].setOpacity(0.25);
					}

					markers[e.code].alt = e.name;

					// Logic for Grouping Libraries into Networks
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
						// markers[e.code].addTo(adminSites);
					}

					if (e.name != null) {
						markers[e.code].addTo(allSites);
					}

					if (e.aed_check != true) {
						markers[e.code].addTo(aedCheck);
					}

					if (e.ehs_inspection === 'JTS') {
						markers[e.code].addTo(ehsCheck);
						// console.log('EHS Button Checked!');
					}

					if (e.roof_inventory === 'JTS') {
						markers[e.code].addTo(roofCheck);
					}

					if (e.mewp_inventory === 'JTS') {
						markers[e.code].addTo(mewpCheck);
					}

					if (e.hvac_inspections === 'JTS') {
						markers[e.code].addTo(hvacCheck);
					}

					// // Selection of the 'Close' Button
					// var ehsCheckClick = document.querySelector(
					// 	'div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > div.leaflet-layerstree-children > div:nth-child(2) > div.leaflet-layerstree-children > div:nth-child(2) > div > span:nth-child(2) > label > input'
					// );

					// console.log(e);

					// HTML for Marker Popup Content
					var popupContent = `
										<table>
					  <thead>
					    <tr>
					      <th colspan="2" style="padding-bottom:1em; font-size:large;">${e.name}</th>
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
						<tr>
							<td style="text-align: right">AED Inspected: </td>
					    	<td><label class="toggle"> <input type="checkbox">
								<div class="slide-toggle"></div></label>
							</td>
						</tr>
					  </tbody>
					</table>
					
										`;

					// Binding Pop Content to Correct Marker
					markers[e.code].bindPopup(popupContent);

					// Marker Properties Array Check
					// console.log(i, markers[e.code].alt, e.name)

					waitForElm('#layerTree').then((elm) => {
						// console.log('Element is ready');
						// console.log(elm);
						var Radiobtn = document.querySelectorAll('input[name="radio"]');

						Radiobtn[3].addEventListener('input', () => {
							if (e.ehs_inspection === 'JTS') {
								// markers[e.code]._icon.style.filter =
								// 	// 'brightness(0) saturate(100%) invert(58%) sepia(28%) saturate(257%) hue-rotate(242deg) brightness(83%) contrast(80%)';
								// markers[e.code]._icon.style.backgroundImage="url(/Users/jtylerstahl/Downloads/NYPLEHSMAP-main/static/user.svg)"
								// console.log(markers[e.code]._icon.backgroundImage);
							}
						});

						// console.log(Radiobtn[0]);
					});
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

				// Checking Marker ID
				// console.log('Markers: ', markers, markers['SASB']);

				// Assigning Data to Layer Control Data
				var mapRoutes = {
					label: 'Branches',
					layer: allSites,
					radioGroup: 'radio',
					// layer: allSites,
					children: [
						{
							label: 'Branches',
							// selectAllCheckbox:true,
							children: [
								{
									label: 'Bronx',
									collapsed: true,
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
									collapsed: true,
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
												{ label: 'Harlem', layer: markers['HL'] },
												{ label: 'Roosevelt Island', layer: markers['RI'] },
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
												{ label: 'Seward Park', layer: markers['SE'] },
												{ label: "Tompkin's Square", layer: markers['TS'] }
											]
										}
									]
								},
								{
									label: 'Staten Island',
									// layer: sisle,
									selectAllCheckbox: false,
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
									selectAllCheckbox: false,
									collapsed: true,
									children: [
										{ label: 'Library Services Center', layer: markers['LSC'] },
										{ label: 'Library for The Performing Arts', layer: markers['LPA'] },
										{ label: 'Schomburg', layer: markers['SCH'] },
										{ label: 'Stavros Niarchos', layer: markers['SNFL'] },
										{ label: 'Stephen A Schwartzman', layer: markers['SASB'] },
										{ label: '270 Madison', layer: markers['TN'] }
									]
								}
							]
						},
						{ label: 'Clear Selection', layer: noSites, radioGroup: 'radio' },
						{
							label: 'Network Areas',
							layer: Net_Data,
							selectAllCheckbox: false,
							collapsed: true,
							children: [
								{
									label: 'Bronx',
									layer: netBX,
									selectAllCheckbox: false,
									collapsed: true,
									children: [
										{ label: 'West Bronx', layer: netWBX },
										{ label: 'Central Bronx', layer: netCBX },
										{ label: 'East Bronx', layer: netEBX }
									]
								},

								{
									label: 'Manhattan',
									layer: netMH,
									selectAllCheckbox: false,
									collapsed: true,
									children: [
										{ label: 'West Manhattan', layer: netWMH },
										{ label: 'East Manhattan', layer: netEMH },
										{ label: 'Lower Manhattan', layer: netLMH }
									]
								},
								{
									label: 'Staten Island',
									layer: netSI,
									selectAllCheckbox: false,
									collapsed: true,
									children: [
										{ label: 'North Staten Island', layer: netNSI },
										{ label: 'South Staten Island', layer: netSSI }
									]
								}
							]
						},
						{
							label: 'Projects',
							selectAllCheckbox: false,
							collapsed: false,
							children: [
								{ label: 'AEDs', layer: aedCheck, radioGroup: 'radio' },
								{ label: 'EHS Inspection', layer: ehsCheck, radioGroup: 'radio' },
								{ label: 'Roof Inventory', layer: roofCheck, radioGroup: 'radio' },
								{ label: 'MEWP Inventory', layer: mewpCheck, radioGroup: 'radio' },
								{ label: 'HVAC Inspections', layer: hvacCheck, radioGroup: 'radio' }

								// { label: 'AEDs', layer: aedCheck },
								// { label: 'EHS Inspection', layer: ehsCheck },
								// { label: 'Roof Inventory', layer: roofCheck },
								// { label: 'MEWP Inventory', layer: mewpCheck }
							]
						}
					]
				};

				// Final Assignment and Creation of Layer Control Tree
				const treeLayerControl = L.control.layers.tree(baseTree, mapRoutes, options);

				// Adding Layer Control Tree to Map
				treeLayerControl.addTo(map);

				// Selection of the Layer Control Tree Container to add 'Close Button'
				var LayerControlContainer = document.querySelector(
					'body > div > main > section > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section'
				);

				// Creating 'Close' Button
				var CollapseBtn = `<div><img class="layerControlToggle" style="float:right;" src="https://raw.githubusercontent.com/stahlnypl/NYPLEHSMAP/main/static/Data/images/lct_button.png"></div>`;

				// Inserting HTML for 'Close' Button into Layer Control Tree Container
				LayerControlContainer.insertAdjacentHTML('afterbegin', CollapseBtn);

				// Selection of the 'Close' Button
				var layerCollapseBtn = document.querySelector(
					'body > div > main > section > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div:nth-child(1)'
				);

				// Adding Click Event Listener on 'Close' Button to hide Layer Control Tree
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

				// Selection of the Title Banner
				var titleSpan = document.querySelector('div.header-bg');

				map.on('baselayerchange', function (e) {
					console.log(e);
					// Check if the selected layer is the one you want
					if (e.name === '0') {
						// Change the font color of the span
						document.querySelector(
							'body > div > main > section > div.header-bg > span'
						).style.color = '#415462'; // Change to your desired color
						console.log('light theme');
					} else {
						// Reset the font color (optional)
						document.querySelector(
							'body > div > main > section > div.header-bg > span'
						).style.color = '#dfdfdf'; // Or your default color
						console.log('dark theme');
					}
				});

				// Adding Click Event Listener on Banner to Remove Banner from View
				titleSpan.addEventListener('click', () => {
					document.querySelector('body > div > main > section').removeChild(titleSpan);
					console.log('Title Span Clicked!');
				});
			}

			// Asyncronous Function to Fetch Supabase Library Data
			async function meterAdditionData() {
				try {
					const libs = await fetchData();
					// console.log(libs);
					addMarkersToMap(map, libs);
				} catch (error) {
					console.error('Error: ', error);
				}
			}

			// Calling Asycronous Function for Adding Library Data
			meterAdditionData();

			var controlTree = document.querySelector(
				'div.leaflet-control-container > div.leaflet-top.leaflet-right'
			);
			controlTree.setAttribute('id', 'layerTree');
			// console.log(controlTree);

			function waitForElm(selector) {
				return new Promise((resolve) => {
					if (document.querySelector(selector)) {
						return resolve(document.querySelector(selector));
					}

					const observer = new MutationObserver((mutations) => {
						// console.log(mutations)
						if (document.querySelector(selector)) {
							resolve(document.querySelector(selector));
						}
					});

					// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
					observer.observe(document.querySelector('#layerTree'), {
						attributes: true,
						childList: true,
						subtree: false,
						characterData: false
					});
					// observer.disconnect();
				});
			}

			// Addition of GPS Locate Control to Map
			L.control
				.locate({
					icon: 'leaflet-control-locate-location-arrow',
					initialZoomLevel: 18
				})
				.addTo(map);
		}
	});

	// Function to Destroy on Close
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
		<br />v: 0.0.10a
		<br />Updated: 08/06/2024
	</div>
</section>

<style>
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet-search/dist/leaflet-search.src.css';

	section div:first-child {
		height: 100vh;
	}

	.header-bg {
		position: fixed;
		display: flex;
		top: 1rem;
		left: 3rem;
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
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		font-size: calc(3vmin);
		font-weight: normal;
		color: #dfdfdf;
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
