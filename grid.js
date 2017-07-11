var clone = require('clone');
var jsonfile = require('jsonfile');
var path = require('path');

jsonfile.spaces = 4 //format json output

//Generate grid for schematic
grid = {
  "type": "FeatureCollection",
  "features": []
}
feature = {
    "type": "Feature",
    "properties": {
      "fil": 0,
      "col": 0
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [ 0, 0 ],
        [ 0, 0 ]
      ]
    }
};
grid_size = 1200;

for (i = -grid_size; i<=grid_size; i++) {
    //cols
    f = clone(feature);
    f.properties.col = i;
    f.geometry.coordinates[0][1] = -grid_size;
    f.geometry.coordinates[1][1] = grid_size;
    f.geometry.coordinates[0][0] = i;
    f.geometry.coordinates[1][0] = i;
    grid.features.push(f);
    //fils
    f = clone(feature);
    f.properties.fil = i;
    f.geometry.coordinates[0][0] = -grid_size;
    f.geometry.coordinates[1][0] = grid_size;
    f.geometry.coordinates[0][1] = i;
    f.geometry.coordinates[1][1] = i;
    grid.features.push(f);
}

jsonfile.writeFile(path.join(process.cwd(),'data', 'grid.geojson'), grid, function (err) {
    if (err) console.error(err);
});