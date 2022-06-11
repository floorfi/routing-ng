import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {MapboxRoute} from '../interfaces/mapbox-route.interface';
import {Coords} from '../interfaces/coords.interface';
import {MapboxGeocodingResponse} from '../interfaces/mapbox-geocoding-response.interface';

@Injectable({
  providedIn: 'root'
})
export class MapboxApiService {

  constructor(
    private httpClient: HttpClient
    ) { }

  mapboxApiUrl: string = 'https://api.mapbox.com/'

  getSearchResults(searchQuery: string): Observable<MapboxGeocodingResponse> {
    return this.httpClient.get<MapboxGeocodingResponse>(this.mapboxApiUrl +'geocoding/v5/mapbox.places/' + searchQuery
      + '.json?language=de&access_token=' + environment.mapApiKey);
  }

  getRoute(coords: Coords[]): Observable<MapboxRoute|undefined> {
    if(coords.length <= 1) {
      return new Observable();
    }
    let coordString = '';
    coords.forEach(coordinateSet => {
      coordString += coordinateSet.lon + ',' + coordinateSet.lat + ';'
    });
    coordString = coordString.slice(0,-1);

    return this.httpClient.get<MapboxRoute>(this.mapboxApiUrl + 'directions/v5/mapbox/driving/' + coordString
      + '?geometries=geojson&access_token=' + environment.mapApiKey);
  }
}
