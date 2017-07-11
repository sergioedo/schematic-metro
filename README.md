# schematic-metro
d3 schematic view of bcn metro based on https://github.com/johnwalley/d3-tube-map

# Prepare environment

Prepare node libraries, before run any command:
```
npm install
```

# Import/Export to/from GeoJSON

Export www/stations.sample.json to data/stations.geojson
```
npm run export
```

Now you can edit with GeoJSON editor (QGIS for example). In this case, use bcn schematic image as reference.

After edit stations.geojson, you can import to www/stations.json again.
```
npm run import
```

# View results

From www directory, serve it with any utility, for example http-server:
```
npm install -g http-server
cd www
http-server
```
Launch at http://localhost:8080.