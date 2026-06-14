// ======================================
// STEP 4A: LANDSAT ACQUISITION
// Build Delhi Landsat Mosaic
// ======================================

// Delhi boundary
var delhi = ee.FeatureCollection("FAO/GAUL/2015/level1")
    .filter(ee.Filter.eq('ADM0_NAME', 'India'))
    .filter(ee.Filter.eq('ADM1_NAME', 'Delhi'));

// Display Delhi boundary
Map.centerObject(delhi, 10);
Map.addLayer(delhi, { color: 'red' }, 'Delhi Boundary');


// --------------------------------------
// Landsat 8 Collection 2 Level 2
// --------------------------------------

var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(delhi)
    .filterDate('2025-05-01', '2025-06-30')
    .filter(ee.Filter.lt('CLOUD_COVER', 10));

print('Number of images found:', landsat.size());


// --------------------------------------
// Print candidate scenes
// --------------------------------------

var imageList = landsat.toList(landsat.size());

for (var i = 0; i < landsat.size().getInfo(); i++) {

    var img = ee.Image(imageList.get(i));

    print(
        'Image ' + i,
        img.get('LANDSAT_PRODUCT_ID'),
        img.get('WRS_PATH'),
        img.get('WRS_ROW'),
        img.get('DATE_ACQUIRED'),
        img.get('CLOUD_COVER')
    );
}


// --------------------------------------
// Create Landsat mosaic
// --------------------------------------

var image = landsat.sort('CLOUD_COVER')
    .mosaic();

// --------------------------------------
// Clip mosaic to Delhi
// --------------------------------------

var image_clipped = image.clip(delhi);


// --------------------------------------
// Visualize Delhi mosaic
// --------------------------------------

Map.addLayer(image_clipped, {
    bands: ['SR_B4', 'SR_B3', 'SR_B2'],
    min: 7000,
    max: 15000
}, 'Delhi Mosaic');


// --------------------------------------
// Print mosaic information
// --------------------------------------

print('Mosaic Image:', image);

// ======================================
// STEP 4B: NDVI
// ======================================

// Calculate NDVI
var ndvi = image_clipped.normalizedDifference(['SR_B5', 'SR_B4'])
    .rename('NDVI');

// NDVI visualization parameters
var ndviVis = {
    min: -0.2,
    max: 0.8,
    palette: [
        'blue',
        'white',
        'yellow',
        'green',
        'darkgreen'
    ]
};

// Display NDVI
Map.addLayer(ndvi, ndviVis, 'NDVI');

// Print NDVI statistics
var ndviStats = ndvi.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: delhi,
    scale: 30,
    maxPixels: 1e10
});

print('NDVI Statistics:', ndviStats);

// ======================================
// STEP 4C: Fractional Vegetation Cover
// ======================================

// Use the observed NDVI extremes
var ndviMin = -0.14958591587831083;
var ndviMax = 0.4658529730597824;
// Derived from Delhi May–June 2025 mosaic


// Calculate FVC
var fvc = ndvi.subtract(ndviMin)
    .divide(ndviMax - ndviMin)
    .pow(2)
    .rename('FVC');

// Limit values between 0 and 1
fvc = fvc.clamp(0, 1);


// Visualize FVC
var fvcVis = {
    min: 0,
    max: 1,
    palette: ['white', 'lightgreen', 'darkgreen']
};

Map.addLayer(fvc, fvcVis, 'Fractional Vegetation Cover');


// ======================================
// STEP 4D: Surface Emissivity
// ======================================

// Calculate emissivity
var emissivity = fvc.multiply(0.004)
    .add(0.986)
    .rename('Emissivity');


// Visualize emissivity
var emisVis = {
    min: 0.986,
    max: 0.990,
    palette: ['blue', 'yellow', 'red']
};

Map.addLayer(emissivity, emisVis, 'Surface Emissivity');


// Print statistics
print(
    'FVC Statistics:',
    fvc.reduceRegion({
        reducer: ee.Reducer.minMax(),
        geometry: delhi,
        scale: 30,
        maxPixels: 1e10
    })
);

print(
    'Emissivity Statistics:',
    emissivity.reduceRegion({
        reducer: ee.Reducer.minMax(),
        geometry: delhi,
        scale: 30,
        maxPixels: 1e10
    })
);


// ======================================
// STEP 4E: Brightness Temperature
// ======================================

// Convert ST_B10 to Kelvin
var bt = image_clipped.select('ST_B10')
    .multiply(0.00341802)
    .add(149.0)
    .rename('BT');

// Convert Kelvin to Celsius
var btCelsius = bt.subtract(273.15)
    .rename('BT_Celsius');


// Visualization parameters
var btVis = {
    min: 30,
    max: 55,
    palette: [
        'blue',
        'cyan',
        'green',
        'yellow',
        'orange',
        'red'
    ]
};

// Display Brightness Temperature
Map.addLayer(btCelsius, btVis, 'Brightness Temperature (°C)');


// Print statistics
print(
    'Brightness Temperature Statistics:',
    btCelsius.reduceRegion({
        reducer: ee.Reducer.minMax(),
        geometry: delhi,
        scale: 30,
        maxPixels: 1e10
    })
);

// ======================================
// STEP 4F: Land Surface Temperature
// ======================================

// Constants
var lambda = 10.895e-6;     // Effective wavelength (m)
var rho = 1.4388e-2;        // h*c/sigma (m*K)


// Calculate LST in Kelvin
var lst = bt.divide(
    ee.Image(1).add(
        bt.multiply(lambda)
            .divide(rho)
            .multiply(emissivity.log())
    )
).rename('LST_K');


// Convert LST to Celsius
var lstCelsius = lst.subtract(273.15)
    .rename('LST_Celsius');


// ======================================
// STEP 4G: LST QUALITY CONTROL
// ======================================

// Remove implausibly cold and hot pixels
var lstFiltered = lstCelsius.updateMask(
    lstCelsius.gte(15)
        .and(lstCelsius.lte(70))
);


// ======================================
// VISUALIZATION
// ======================================

var lstVis = {
    min: 30,
    max: 55,
    palette: [
        'blue',
        'cyan',
        'green',
        'yellow',
        'orange',
        'red',
        'darkred'
    ]
};


// Display filtered LST
Map.addLayer(lstFiltered, lstVis,
    'Filtered LST (°C)');


// ======================================
// STATISTICS
// ======================================

print(
    'Filtered LST Statistics:',
    lstFiltered.reduceRegion({
        reducer: ee.Reducer.minMax(),
        geometry: delhi,
        scale: 30,
        maxPixels: 1e10
    })
);


// ======================================
// QA: COLD PIXEL INVESTIGATION
// ======================================

/*
var coldPixels = lstCelsius.lt(15);

Map.addLayer(coldPixels.selfMask(), {
  palette: ['blue']
}, 'Cold Pixels (<15°C)');


var coldPixelCount = coldPixels.selfMask().reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: delhi,
  scale: 30,
  maxPixels: 1e10
});

print('Cold pixel count:', coldPixelCount);
*/

// ======================================
// FINAL OUTPUT
// ======================================

print('Final LST Image:', lstFiltered);

// ======================================
// STEP 5A: CREATE 250m ANALYSIS GRID
// ======================================

var grid = delhi.geometry().coveringGrid(
    ee.Projection('EPSG:3857').atScale(250)
);

// Keep only cells intersecting Delhi
grid = grid.filterBounds(delhi);

print('Number of grid cells:', grid.size());

Map.addLayer(grid, { color: 'black' }, '250m Grid');


// ======================================
// STEP 5B: AGGREGATE LST TO GRID
// ======================================

var gridLST = lstFiltered.reduceRegions({
    collection: grid,
    reducer: ee.Reducer.mean(),
    scale: 30
});


// ======================================
// STEP 5C: REMOVE EMPTY CELLS
// ======================================

// Some cells may have no valid LST pixels after masking.
// Remove them.

gridLST = gridLST.filter(
    ee.Filter.notNull(['mean'])
);

print('Grid LST Dataset:', gridLST.limit(10));


// ======================================
// STEP 5D: CLEAN PROPERTY NAMES
// ======================================

gridLST = gridLST.map(function (feature) {

    return feature.set(
        'mean_lst',
        feature.get('mean')
    );

});

print('Final Grid LST Dataset:',
    gridLST.limit(10));


// ======================================
// STEP 5E: VISUALIZE GRID LST
// ======================================

Map.addLayer(
    gridLST,
    {},
    'Grid LST Features'
);


// ======================================
// STEP 5F: SUMMARY STATISTICS
// ======================================

print(
    'Number of valid grid cells:',
    gridLST.size()
);

print(
    'Mean LST across Delhi:',
    gridLST.aggregate_mean('mean_lst')
);

print(
    'Minimum Grid LST:',
    gridLST.aggregate_min('mean_lst')
);

print(
    'Maximum Grid LST:',
    gridLST.aggregate_max('mean_lst')
);


// ======================================
// STEP 6A: AGGREGATE NDVI TO GRID
// ======================================

var gridNDVI = ndvi.reduceRegions({
    collection: gridLST,
    reducer: ee.Reducer.mean(),
    scale: 30
});

gridNDVI = gridNDVI.map(function (feature) {
    return feature.set(
        'mean_ndvi',
        feature.get('mean')
    );
});

print('NDVI Dataset:', gridNDVI.limit(10));

// ======================================
// STEP 6B: CALCULATE NDBI
// ======================================

var ndbi = image_clipped.normalizedDifference([
    'SR_B6',
    'SR_B5'
]).rename('NDBI');

Map.addLayer(ndbi, {
    min: -0.5,
    max: 0.5,
    palette: ['green', 'white', 'red']
}, 'NDBI');

print(
    'NDBI Statistics:',
    ndbi.reduceRegion({
        reducer: ee.Reducer.minMax(),
        geometry: delhi,
        scale: 30,
        maxPixels: 1e10
    })
);


// ======================================
// STEP 6C: AGGREGATE NDBI TO GRID
// ======================================

var gridFeatures = ndbi.reduceRegions({
    collection: gridNDVI,
    reducer: ee.Reducer.mean(),
    scale: 30
});

gridFeatures = gridFeatures.map(function (feature) {

    return feature.set(
        'mean_ndbi',
        feature.get('mean')
    );

});

print(
    'Final Feature Dataset:',
    gridFeatures.limit(10)
);


gridFeatures = gridFeatures.map(function (feature) {

    return ee.Feature(feature.geometry(), {
        mean_lst: feature.get('mean_lst'),
        mean_ndvi: feature.get('mean_ndvi'),
        mean_ndbi: feature.get('mean_ndbi')
    });

});


// ======================================
// STEP 6E: EXPORT DATASET
// ======================================

Export.table.toDrive({
    collection: gridFeatures,
    description: 'Delhi_Urban_Heat_Dataset',
    fileFormat: 'CSV'
});