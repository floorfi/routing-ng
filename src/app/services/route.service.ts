import { Injectable } from '@angular/core';
import {Route} from '../classes/route.class';
import {Coords} from '../interfaces/coords.interface';
import {Location} from '../classes/location.class';
import {MapboxApiService} from '../api/mapbox.api.service';
import {firstValueFrom} from 'rxjs';
import {MapService} from './map.service';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(
    private mapboxApiService: MapboxApiService,
    private mapService: MapService
  ) { }

  getRouteBetweenLocations = (locationA: Location, locationB: Location): Promise<Route> => {
    const coords: Coords[] = [];
    coords.push(locationA.coords)
    coords.push(locationB.coords)

    return new Promise(resolve => {
      firstValueFrom(this.mapboxApiService.getRoute(coords))
        .then(response => {
          const data = response!.routes[0];
          const route = data.geometry.coordinates;
          const geojson = this.mapService.buildLineStringFeature(route);

          this.mapService.addLayerRoute(locationB.id, geojson)

          const routeStartTime = moment(locationA.leaveTime)
          const routeEndTime = moment(locationA.leaveTime).add(data.duration, 'seconds')

          resolve(new Route(
            locationB.id,
            data.duration,
            data.distance,
            route,
            routeStartTime,
            routeEndTime
          ))
        });
    })
  }
}
