export async function loadJSONData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/stahlnypl/NYPLEHSMAP/main/static/Data/JSON/NYPLNetworks.geojson');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading Tract Data:', error);
        return null;
    }
};