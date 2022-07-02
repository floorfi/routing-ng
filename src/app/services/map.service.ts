import {Injectable} from '@angular/core';
import {Feature, FeatureCollection, Position} from 'geojson';
import * as mapboxgl from 'mapbox-gl';
import {CircleLayer, GeoJSONSource, LineLayer, Map, Marker} from 'mapbox-gl';
import {MapboxStyleDefinition, MapboxStyleSwitcherControl, MapboxStyleSwitcherOptions} from 'mapbox-gl-style-switcher';
import {environment} from '../../environments/environment';
import {MapboxApiService} from '../api/mapbox.api.service';

const styles: MapboxStyleDefinition[] = [
  {
    title: "Light",
    uri: "mapbox://styles/mapbox/light-v9"
  },
  {
    title: "Outdoor",
    uri: "mapbox://styles/mapbox/outdoors-v11"
  }
];

@Injectable({
  providedIn: 'root'
})
export class MapService {

  static instance: MapService;
  map!: Map;
  temporaryMarker?: Marker;

  constructor(
    private mapboxApiService: MapboxApiService
  ) {
    MapService.instance = this;
  }

  addLayerRoute = (id: string, geojson: Feature) => {
    // if the id already exists on the map, we'll reset it using setData
    if (this.map.getSource(id)) {
      const source: GeoJSONSource = this.map.getSource(id) as GeoJSONSource;
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
    if (this.map.getLayer(id)) {
      this.map.removeLayer(id);
      this.map.removeSource(id);
    }
  };

  // Mapbox Marker hinzufügen und ggf. fokussieren
  addMarker = (coords: Position, id: string, setFocus: boolean, icon: string = 'fa-location-dot', color: string = '#000', draggable: boolean = true) => {
    const parentEl = document.createElement('span');
    parentEl.className = 'fa-stack fa-2xl';
    parentEl.setAttribute('id', id);
    const iconBg = document.createElement('i');
    iconBg.className = 'fa-solid fa-location-pin fa-stack-2x';
    iconBg.setAttribute('style', 'color: ' + color);
    parentEl.appendChild(iconBg);
    const iconTop = document.createElement('i');
    iconTop.className = 'fa-solid fa-stack-1x fa-inverse ' + icon;
    parentEl.appendChild(iconTop);

    const marker = new mapboxgl.Marker({
      element: parentEl,
      draggable: draggable
      // @ts-ignore
    })
      // @ts-ignore
      .setLngLat(coords)
      .setOffset([0, -25])
      .addTo(this.map);

    if (draggable) {
      function onDragEnd() {
        const lngLat = marker.getLngLat();
        // coordinates.style.display = 'block';
        // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
      }

      marker.on('dragend', onDragEnd);
    }

    if (setFocus) {
      this.centerMap(coords);
    }
    return marker;
  };

  removeMarker = (marker: Marker) => {
    marker.remove();
  };


  centerMap = (coords: Position) => {
    // @ts-ignore
    this.map.easeTo({center: coords, zoom: 5});
  };


  centerToUserPositionCoords = (pos: { coords: { latitude: number, longitude: number } }) => {
    const coords: Position = [
      pos.coords.longitude,
      pos.coords.latitude
    ];
    this.centerMap(coords);
  };


  addHillshade = () => {
    this.map.addSource('dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1'
    });
    this.map.addLayer(
      {
        'id': 'hillshading',
        'source': 'dem',
        'type': 'hillshade'
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
      },
      // 'waterway-river-canal-shadow'
    );
  };


  newLocationByClick = (coords: Position) => {
    console.log('new');
    if (this.temporaryMarker) this.removeMarker(this.temporaryMarker);

    this.mapboxApiService.getLocationForCoords(coords).subscribe(location => {
      console.log(location.features);
      // create the popup
      const popup = new mapboxgl.Popup({
        offset: 40,
        className: 'bg-white rounded-lg shadow dark:bg-gray-700'
      }).setText(
        location.features[0].place_name_de
      );

      this.temporaryMarker = this.addMarker(coords, 'newLocation', true, 'fa-circle', '#8d8d8d', false);
      this.temporaryMarker.setPopup(popup).togglePopup();
    });


  };


  initiateMap = () => {
    // @ts-ignore
    mapboxgl.accessToken = environment.mapApiKey;
    this.map = new mapboxgl.Map({
      container: "mapid",
      style: styles.find(style => style.title === 'Outdoor')!.uri,

    });

    const options: MapboxStyleSwitcherOptions = {
      defaultStyle: "Outdoor"
    };

    this.map.addControl(new MapboxStyleSwitcherControl(styles, options), 'bottom-left');
    this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    this.map.addControl(new mapboxgl.GeolocateControl(), 'bottom-left');

    this.map.on('load', () => {

      // TODO: Dynamisieren
      this.addHillshade();

      navigator.geolocation.getCurrentPosition(this.centerToUserPositionCoords);

      this.map.on('contextmenu', (e) => {
        const coords: Position = [
          e.lngLat.lng,
          e.lngLat.lat
        ];

        this.newLocationByClick(coords);
      });
    });
  }
}
