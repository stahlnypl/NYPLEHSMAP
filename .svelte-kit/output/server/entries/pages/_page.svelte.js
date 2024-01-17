import { c as create_ssr_component, o as onDestroy, d as add_attribute, e as escape, v as validate_component } from "../../chunks/ssr.js";
import { createClient } from "@supabase/supabase-js";
import { P as PUBLIC_SUPABASE_ANON_KEY } from "../../chunks/public.js";
const LeafletMap_svelte_svelte_type_style_lang = "";
const css = {
  code: "@import 'leaflet/dist/leaflet.css';@import 'leaflet-search/dist/leaflet-search.src.css';section.svelte-1kfa1ap div.svelte-1kfa1ap{height:100vh}.header-bg.svelte-1kfa1ap.svelte-1kfa1ap{position:fixed;display:flex;top:1rem;left:5rem;background:rgba(255, 255, 255, 0.2);box-shadow:0 8px 32px 0 rgba(0, 0, 0, 0.37);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(4.5px);border-radius:10px;border:1px solid rgba(255, 255, 255, 0.18);z-index:999;height:fit-content}.header-bg.svelte-1kfa1ap>span.svelte-1kfa1ap{padding-left:1rem;padding-right:1rem;padding-top:0.5rem;padding-bottom:0.5rem;font-size:x-large;font-weight:normal;color:#415462;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif}.sidebar.svelte-1kfa1ap.svelte-1kfa1ap{background-color:rgba(35, 55, 75, 0.9);color:#fff;padding:6px 12px;font-family:monospace;z-index:-1;position:absolute;bottom:1%;left:1%;margin:12px;border-radius:4px;height:auto;line-height:1.5}",
  map: null
};
const supabaseUrl = "https://fcmkyfkiiblxmbgwuegf.supabase.co";
const LeafletMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;
  createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  let mapElement;
  let lng, lat, zoom;
  lng = -74;
  lat = 40.7;
  zoom = 10;
  onDestroy(async () => {
  });
  $$result.css.add(css);
  return `<section class="svelte-1kfa1ap"><div class="svelte-1kfa1ap"${add_attribute("this", mapElement, 0)}></div> <div class="header-bg svelte-1kfa1ap" data-svelte-h="svelte-18idny7"><span class="svelte-1kfa1ap">NYPL Environmental Health &amp; Safety Map</span></div> <div class="sidebar svelte-1kfa1ap">Longitude: ${escape(lng.toFixed(4))} | Latitude: ${escape(lat.toFixed(4))} | Zoom: ${escape(zoom.toFixed(2))} <br>v:
		0.0.4a</div> </section>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main>${validate_component(LeafletMap, "LeafletMap").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Page as default
};
