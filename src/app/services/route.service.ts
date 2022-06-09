import { Injectable } from '@angular/core';
import {GeoRoute} from '../interfaces/route.interface';
import {Coords} from '../interfaces/coords.interface';
import {GeoLocation} from '../interfaces/location.interface';
import {MapboxApiService} from '../api/mapbox.api.service';
import {firstValueFrom} from 'rxjs';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  routes: GeoRoute[] = [];

  constructor(
    private mapboxApiService: MapboxApiService,
    private mapService: MapService
  ) { }

  getRouteBetweenLocations = (locationA: GeoLocation, locationB: GeoLocation): Promise<GeoRoute> => {
    const coords: Coords[] = [];
    coords.push(locationA.coords)
    coords.push(locationB.coords)

    return new Promise(resolve => {
      firstValueFrom(this.mapboxApiService.getRoute(coords))
        .then(response => {
          const data = response!.routes[0];
          const route = data.geometry.coordinates;
          const geojson = this.mapService.buildFeature('LineString', route);

          this.mapService.addLayerRoute(locationB.id, geojson)

          const routeStartTime = locationA.leaveTime
          const routeEndTime = locationA.leaveTime!.add(data.duration, 'seconds')

          resolve(
            {
              id: locationB.id,
              travelTime: data.duration,
              waypoints: route,
              distance: data.distance,
              startTime: routeStartTime,
              endTime: routeEndTime
            }
          )
        });
    })
  }

  addRoute = (route: GeoRoute) => {
    this.routes.push(route);
  }

  removeRoute = (id: string) => {
    this.routes = this.routes.filter((route: GeoRoute) => {
      return route.id !== id
    })
  }

  getRouteByID = (id: string): GeoRoute|undefined => {
    return this.routes.find(route => route.id === id)
  }

  reindex = () => {
    this.routes.filter((route: GeoRoute) => route)
  }

}
