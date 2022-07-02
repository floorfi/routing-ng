import {Injectable} from '@angular/core';
import {Position} from 'geojson';
import * as moment from 'moment-timezone';
import {firstValueFrom} from 'rxjs';
import {MapboxApiService} from '../api/mapbox.api.service';
import {Location} from '../classes/location.class';
import {Route} from '../classes/route.class';
import {GeoService} from './geo.service';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  static instance: RouteService;

  constructor(
    private mapboxApiService: MapboxApiService,
    private mapService: MapService,
    private geoService: GeoService
  ) {
    RouteService.instance = this;
  }

  getRouteBetweenLocations = (locationA: Location, locationB: Location, fullPath = false): Promise<Route> => {
    console.log('Calculate route');
    const coords: Position[] = [];
    coords.push(locationA.coords);
    coords.push(locationB.coords);

    return new Promise(resolve => {
      firstValueFrom(this.mapboxApiService.getRoute(coords, fullPath))
        .then(response => {
          const data = response!.routes[0];
          const routeStartTime = moment(locationA.leaveTime);
          const routeEndTime = moment(locationA.leaveTime).add(data.duration, 'seconds')

          resolve(new Route(
            locationB.id,
            moment.duration(data.duration, 'seconds'),
            data.distance,
            data.geometry,
            routeStartTime,
            routeEndTime
          ))
        });
    })
  }


  addAutoStops = (startLocation: Location, endLocation: Location, route: Route): Promise<true> => {
    return new Promise(async resolve => {
      let previousLocation = startLocation;

      // Positionen für Zwischenstops holen
      const locationsToConnect = this.geoService.getAutoStopLocationsOnRoute(route);

      console.log('Start Location', previousLocation);
      console.log('Final Location', endLocation);
      console.group('Build autostops');

      // Step/Position und Routen für einzelne AutoSteps generieren
      for (const position of locationsToConnect) {
        console.log('Autostop', position);
        previousLocation = await this.buildSingleAutoStop(position, previousLocation.orderId + 1);
        endLocation.orderId++;
      }


      // Letzten Autostop mit eigentlicher Folgelocation verbinden
      console.log('Build final step');
      endLocation.buildRouteTo().then(() => {
        resolve(true);
        console.groupEnd();
      });

    });
  };

  drawRouteToMap = (route: Route) => {
    const waypoints = route.waypoints.coordinates;
    const geojson = this.mapService.buildLineStringFeature(waypoints);
    this.mapService.addLayerRoute(route.id, geojson);
  };

  private buildSingleAutoStop = (autoStopPosition: Position, orderId: number): Promise<Location> => {
    return new Promise<Location>(resolve => {
      const location = new Location(
        autoStopPosition[0] + ',' + autoStopPosition[1],
        autoStopPosition[0] + ',' + autoStopPosition[1],
        autoStopPosition,
        orderId,
        'fa-bed',
        '#a72a4c'
      );

      location.buildRouteTo().then(() => {
        resolve(location);
      });
    });
  };
}
