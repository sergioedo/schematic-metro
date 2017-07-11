var clone = require('clone');
var jsonfile = require('jsonfile');
var path = require('path');

jsonfile.spaces = 4 //format json output

//Generate stations geojson from schematic data
stations = {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    "features": []
}
feature = {
    "type": "Feature",
    "properties": {
      "line": 0,
      "color": 0
    },
    "geometry": {
      "type": "Point",
      "coordinates": [ 0, 0 ]
    }
};


var file = path.join(process.cwd(),'www','stations.sample.json')
schematic = jsonfile.readFileSync(file);

function exportLine(line, geojson, schematic) {
    count = 0;
    line.nodes.map(node => {
        console.log(line.name + node.coords)

        f = clone(feature);
        f.properties.line = line.name;
        f.properties.label = line.label;
        f.properties.color = line.color;
        if (node.name) {
            f.properties.name = node.name;
            f.properties.title = schematic.stations[node.name].title
        }
        if (node.labelPos) f.properties.labelPos = node.labelPos;
        if (node.marker) f.properties.marker = node.marker;
        if (node.shiftCoords) {
            f.properties.shCoordX = node.shiftCoords[0];
            f.properties.shCoordY = node.shiftCoords[1];
        }
        if (node.canonical) f.properties.canonical = node.canonical;
        if (node.dir) f.properties.dir = node.dir;
        f.properties.order = count*10; //spaces between nodes
        f.geometry.coordinates[0] = node.coords[0];
        f.geometry.coordinates[1] = node.coords[1];
        geojson.features.push(f);
        count++;  //order coords
    })
}

schematic.lines.map(line => {
    console.log(line.name)
    exportLine(line, stations, schematic);
});

//River
if(schematic.river) {
    //Export as a line (with name 'river')
    exportLine(schematic.river, stations, schematic);
}

jsonfile.writeFile(path.join(process.cwd(),'data', 'stations.geojson'), stations, function (err) {
    if (err) console.error(err);
});