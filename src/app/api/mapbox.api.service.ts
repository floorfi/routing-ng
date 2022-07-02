import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Position} from 'geojson';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {MapboxGeocodingResponse} from '../interfaces/mapbox-geocoding-response.interface';
import {MapboxRoute} from '../interfaces/mapbox-route.interface';

@Injectable({
  providedIn: 'root'
})
export class MapboxApiService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  mapboxApiUrl: string = 'https://api.mapbox.com/';

  getSearchResults(searchQuery: string): Observable<MapboxGeocodingResponse> {
    return this.httpClient.get<MapboxGeocodingResponse>(this.mapboxApiUrl + 'geocoding/v5/mapbox.places/' + searchQuery
      + '.json?language=de&access_token=' + environment.mapApiKey);
  }

  getLocationForCoords(coords: Position): Observable<MapboxGeocodingResponse> {
    const coordsString = coords[0] + ',' + coords[1];
    return this.httpClient.get<MapboxGeocodingResponse>(this.mapboxApiUrl + 'geocoding/v5/mapbox.places/' + coordsString
      + '.json?limit=1&language=de&access_token=' + environment.mapApiKey);
  }

  getRoute(coords: Position[], fullPath: boolean): Observable<MapboxRoute | undefined> {
    if (coords.length <= 1) {
      return new Observable();
    }
    let coordString = '';
    coords.forEach(coordinateSet => {
      coordString += coordinateSet[0] + ',' + coordinateSet[1] + ';';
    });
    coordString = coordString.slice(0, -1);

    return this.httpClient.get<MapboxRoute>(this.mapboxApiUrl + 'directions/v5/mapbox/driving/' + coordString
      + '?geometries=geojson' + (fullPath ? '&overview=full' : '') + '&access_token=' + environment.mapApiKey);
  }
}
