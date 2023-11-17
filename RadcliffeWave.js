/*
  * In `onReady`, the `wwtlib.SpaceTimeController.set_timeRate` will control the speed of the movement
  * The colors and point sizes are set in the `setupDustLayer` and `setupClusterLayer` functions 
  * Just to allow using WWT's internal clock, I've set 1 degree of phase to correspond to a time of 1 day
  * 
  * For getting the current view parameters, run the following in the JavaScript console
  * RA: wwt.renderContext.viewCamera.get_RA()
  * Dec: wwt.renderContext.viewCamera.get_dec()
  * Zoom: wwt.renderContext.viewCamera.zoom
  * */

var scriptInterface, wwt;
var clusterLayer, dustLayer, sunLayer, bestFitLayer;

var startTime = new Date("2023-10-17 11:55:55Z");
var endTime = new Date("2025-10-06 11:55:55Z");



function initWWT() {
  const builder = new wwtlib.WWTControlBuilder("wwtcanvas");
  builder.startRenderLoop(true);
  scriptInterface = builder.create();
  scriptInterface.add_ready(onReady); 
}

function onReady() {
  wwt = wwtlib.WWTControl.singleton;
  const settings = scriptInterface.settings;
  wwt.setBackgroundImageByName("Solar System");
  wwt.setForegroundImageByName("Solar System");
  wwtlib.SpaceTimeController.set_now(startTime);
  const ra = 22.36801497192689;
  const dec = 22.68;
  const zoom = 2189465275.4030666;
  wwt.gotoRADecZoom(ra, dec, zoom, true);
  const SECONDS_PER_DAY = 86400;
  wwtlib.SpaceTimeController.set_timeRate(120 * SECONDS_PER_DAY);

  // To stop for testing purposes
  // wwtlib.SpaceTimeController.set_now(new Date("2023-10-18 11:55:55Z"));
  // wwtlib.SpaceTimeController.set_syncToClock(false);

  settings.set_solarSystemStars(false);
  settings.set_actualPlanetScale(true);
  settings.set_showConstellationFigures(false);
  settings.set_showCrosshairs(false);
  setupDustLayer();
  setupClusterLayer();
  setupSunLayer();
  setupBestFitLayer();

  window.requestAnimationFrame(checkForTimeReset);
}

function setupDustLayer() {
  const dustColor = wwtlib.Color.load("#ec0018");
  fetch("RW_dust_oscillation_phase_updated_radec.csv")
    .then(response => response.text())
    .then(text => { 
      dustLayer = wwtlib.LayerManager.createSpreadsheetLayer("Sky", "Radcliffe Wave Dust", text);
      dustLayer.set_lngColumn(0);
      dustLayer.set_latColumn(1);
      dustLayer.set_altColumn(2);
      dustLayer.set_startDateColumn(4);
      dustLayer.set_endDateColumn(5);
      // dustLayer.set_colorMap(3);
      dustLayer.set_timeSeries(true);
      dustLayer.set_raUnits(wwtlib.RAUnits.degrees);
      dustLayer.set_altUnit(wwtlib.AltUnits.parsecs);
      dustLayer.set_altType(wwtlib.AltTypes.distance);
      dustLayer.set_color(dustColor);
      dustLayer.set_showFarSide(true);
      dustLayer.set_scaleFactor(25);
      dustLayer.set_markerScale(wwtlib.MarkerScales.screen);
    });
}

function setupClusterLayer() {
  fetch("RW_cluster_oscillation_phase_updated_radec.csv")
    .then(response => response.text())
    .then(text => { 
      clusterLayer = wwtlib.LayerManager.createSpreadsheetLayer("Sky", "Radcliffe Wave Cluster", text);
      clusterLayer.set_lngColumn(0);
      clusterLayer.set_latColumn(1);
      clusterLayer.set_altColumn(2);
      clusterLayer.set_startDateColumn(4);
      clusterLayer.set_endDateColumn(5);
      clusterLayer.set_timeSeries(true);
      clusterLayer.set_raUnits(wwtlib.RAUnits.degrees);
      clusterLayer.set_altUnit(wwtlib.AltUnits.parsecs);
      clusterLayer.set_altType(wwtlib.AltTypes.distance);
      clusterLayer.set_color(wwtlib.Color.load("#1f3cf1"));
      clusterLayer.set_showFarSide(true);
      clusterLayer.set_scaleFactor(30);
      clusterLayer.set_markerScale(wwtlib.MarkerScales.screen);
    });
}

function setupSunLayer() {
  fetch("Sun_radec_C.csv")
    .then(response => response.text())
    .then(text => text.replace(/\n/g, "\r\n"))
    .then(text => { 
      sunLayer = wwtlib.LayerManager.createSpreadsheetLayer("Sky", "Radcliffe Wave Sun", text);
      sunLayer.set_lngColumn(0);
      sunLayer.set_latColumn(1);
      sunLayer.set_altColumn(2);
      sunLayer.set_startDateColumn(4);
      sunLayer.set_endDateColumn(5);
      sunLayer.set_timeSeries(true);
      sunLayer.set_raUnits(wwtlib.RAUnits.degrees);
      sunLayer.set_altUnit(wwtlib.AltUnits.parsecs);
      sunLayer.set_altType(wwtlib.AltTypes.distance);
      sunLayer.set_color(wwtlib.Color.load("#ffff0a"));
      sunLayer.set_showFarSide(true);
      sunLayer.set_scaleFactor(50);
      sunLayer.set_markerScale(wwtlib.MarkerScales.screen);
    });
}

function setupBestFitLayer() {
  fetch("RW_best_fit_oscillation_phase_radec.csv")
    .then(response => response.text())
    .then(text => text.replace(/\n/g, "\r\n"))
    .then(text => { 
      bestFitLayer = wwtlib.LayerManager.createSpreadsheetLayer("Sky", "Radcliffe Wave Best Fit", text);
      bestFitLayer.set_lngColumn(0);
      bestFitLayer.set_latColumn(1);
      bestFitLayer.set_altColumn(2);
      bestFitLayer.set_raUnits(wwtlib.RAUnits.degrees);
      bestFitLayer.set_altUnit(wwtlib.AltUnits.parsecs);
      bestFitLayer.set_altType(wwtlib.AltTypes.distance);
      bestFitLayer.set_color(wwtlib.Color.load("#83befb"));
      bestFitLayer.set_showFarSide(true);
      bestFitLayer.set_scaleFactor(50);
      bestFitLayer.set_markerScale(wwtlib.MarkerScales.screen);
    });
}

function checkForTimeReset(_timestamp) {
  if (wwtlib.SpaceTimeController.get_now() >= endTime) {
    wwtlib.SpaceTimeController.set_now(startTime);
  }
  window.requestAnimationFrame(checkForTimeReset);
}

window.addEventListener("load", initWWT);
