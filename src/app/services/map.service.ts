import { Injectable } from '@angular/core';
import {Feature, FeatureCollection, Position} from 'geojson';
import {CircleLayer, GeoJSONSource, LineLayer, Marker, Map} from 'mapbox-gl';
import {Coords} from '../interfaces/coords.interface';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../environments/environment';
import {MapboxStyleDefinition, MapboxStyleSwitcherControl, MapboxStyleSwitcherOptions} from 'mapbox-gl-style-switcher';

const styles: MapboxStyleDefinition[] = [
  {
    title: "Standard",
    uri:"mapbox://styles/floorfi/cl2ncj0b5005114n5kpqbddb1"
  },
  {
    title: "Light",
    uri:"mapbox://styles/mapbox/light-v9"
  },
  {
    title: "Outdoor",
    uri:"mapbox://styles/mapbox/outdoors-v11"
  }
];

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map!: Map;

  constructor() { }

  addLayerRoute = (id: string, geojson: Feature) => {
    // if the id already exists on the map, we'll reset it using setData
    if (this.map.getSource(id)) {
      const source: GeoJSONSource = this.map.getSource(id) as GeoJSONSource
      source.setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      const geoJsonSource: any = {
        'type': 'geojson',
        'data': geojson
      }

      const layerObj: LineLayer = {
        'id': id,
        'type': 'line',
        'source': geoJsonSource,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      }

      this.map.addLayer(layerObj)
    }

  }


  addLayerPoint = (id: string, coords: Position): Map => {
    const layer: CircleLayer = {
      'id': id,
      'type': 'circle',
      'source': this.buildGeoJsonSource(coords),
      'paint': {
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    }
    return this.map.addLayer(layer);
  }

  buildGeoJsonSource = (coords: Position): GeoJSONSource => {
    const featureCollection: FeatureCollection = {
      'type': 'FeatureCollection',
      'features': [this.buildPointFeature(coords)]
    }
    return new GeoJSONSource({
      'data': featureCollection
    })
  }

  buildPointFeature = (coords: Position): Feature => {
    return {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': coords
      }
    }
  }

  buildLineStringFeature = (coords: Position[]): Feature => {
    return {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': coords
      }
    }
  }

  removeLayer = (id: string) => {
    if(this.map.getLayer(id)) {
      this.map.removeLayer(id)
      this.map.removeSource(id)
    }
  }

  // Mapbox Marker hinzufügen und ggf. fokussieren
  addMarker = (coords: Coords, setFocus: boolean) => {
    const marker = new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: true
    }).setLngLat(coords)
      .addTo(this.map);

    if(setFocus) {
      this.centerMap(coords)
      this.zoomIn()
    }
    return marker
  }

  removeMarker = (marker: Marker) => {
    marker.remove();
  }

  centerMap = (coords: Coords) => {
    this.map.setCenter(coords);
  }

  zoomIn = () => {
    this.map.zoomTo(5);
  }

  convertCoordsToNumbers = (coords: Coords): number[] => {
    return [coords.lat, coords.lon]
  }

  convertNumbersToCoords = (coords: number[]): Coords => {
    return {
      lon: coords[0],
      lat: coords[1]
    }
  }

  initiateMap = () => {
    // @ts-ignore
    mapboxgl.accessToken = environment.mapApiKey
    this.map = new mapboxgl.Map({
      container: "mapid",
      style: styles.find(style=>style.title==='Standard')!.uri
    });

    const options: MapboxStyleSwitcherOptions = {
      defaultStyle: "Standard"
    };

    this.map.addControl(new MapboxStyleSwitcherControl(styles, options));

    this.map.on('load', () => {

    })
  }
}
