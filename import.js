var clone = require('clone');
var jsonfile = require('jsonfile');
var path = require('path');

jsonfile.spaces = 4 //format json output

//Generate lines and stations schematic json from geojson data
station = {
      "title": "Clarendon\nArms",
      "address": "35-36 Clarendon St, Cambridge CB1 1JX",
      "phone": "01223 778272",
      "position": {
        "lat": 52.20465,
        "lon": 0.127679
      }
    };
line = {
    "name": "Town",
    "label": "Town",
    "color": "#ffd300",
    "shiftCoords": [0, 0],
    "nodes":[]
};

node = {
    "coords": [0, 0]
}

var file = path.join(process.cwd(),'data','stations.geojson')
geojson = jsonfile.readFileSync(file);

var schematic = {
    "stations" : {},
    "lines": []
}

//iterate trough ordered points, grouped by line
geojson.features.sort((p1,p2) => {
    //order by line
    if(p1.properties.line < p2.properties.line) return -1;
    if(p1.properties.line > p2.properties.line) return 1;
    //order by order in the same line
    return p1.properties.order - p2.properties.order;
}).map(point => {
    //console.log(point.properties)
    count = 0;
    //get line
    l = schematic.lines.find(l => l.name == point.properties.line);
    l = (point.properties.line == "River")? schematic.river : l;
    if(!l) {  //add line if not exists
        console.log("Line " + point.properties.line + " found!");
        l = clone(line);
        l.name = point.properties.line;
        l.label = point.properties.label || point.properties.line;
        l.color = point.properties.color;
        //special case: River
        if(l.name == "River") {
            schematic.river = l;
        } else { //normal line
            schematic.lines.push(l);
        }
    }
    //add node
    n = clone(node);
    n.coords[0] = point.geometry.coordinates[0];
    n.coords[1] = point.geometry.coordinates[1];
    if (point.properties.name)  n.name = point.properties.name;
    if (point.properties.labelPos) n.labelPos = point.properties.labelPos ;
    if (point.properties.marker) n.marker = point.properties.marker;
    if (point.properties.shCoordX && point.properties.shCoordY) {
        n.shiftCoords = [0, 0];
        n.shiftCoords[0] = point.properties.shCoordX;
        n.shiftCoords[1] = point.properties.shCoordY;
    }
    if (point.properties.canonical) n.canonical = point.properties.canonical;
    if (point.properties.dir) n.dir = point.properties.dir;    
    l.nodes.push(n);
    
    if(point.properties.name) { //station node
        st = schematic.stations[point.properties.name]
        if(!st) {  //add station if not exists
            console.log("Station " + point.properties.name + " found!");
            st = clone(station);
            st.title = point.properties.title || point.properties.name;
            st.position.lat = point.geometry.coordinates[0];
            st.position.lon = point.geometry.coordinates[1];
            schematic.stations[point.properties.name] = st;
        }
    }
});

jsonfile.writeFile(path.join(process.cwd(),'www', 'stations.json'), schematic, function (err) {
    if (err) console.error(err);
});