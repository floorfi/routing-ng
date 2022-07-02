import {Injectable} from '@angular/core';
import {Position} from 'geojson';
import {Route} from '../classes/route.class';
import {TravelStore} from '../store/travel.store';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  static instance: GeoService;

  constructor(
    private mapService: MapService,
    private travelStore: TravelStore,
  ) {
    GeoService.instance = this;
  }


  getAutoStopLocationsOnRoute = (route: Route) => {
    let autoStopLocations: Position[] = [];

    // So viele automatische Stops braucht es auf der Strecke
    const stopCount = Math.floor(route.travelTime.asSeconds() / this.travelStore.currentTravel!.maxDrivingTime.asSeconds());
    // Wie lang sind die Segmente, nach denen ein Stop eingelegt werden müsste
    const segmentDistance = route.distance / (stopCount + 1);

    // Drive along route and get Segment-Points
    let driven = 0;
    for (let i = 0; i < stopCount; i++) {
      driven += segmentDistance;
      autoStopLocations.push(this.getPointAfterDistanceOfRoute(route, driven));
    }

    return autoStopLocations;
  };


  getPointAfterDistanceOfRoute = (route: Route, targetDistance: number): Position => {
    let returnPositon: Position;
    // Distanz entlang der Linie aufsummieren
    let distanceSum = 0;
    route.waypoints.coordinates.every((coords, index) => {
      const segmentDistance = this.getDistanceBetweenTwoPoints(route.waypoints.coordinates[index], route.waypoints.coordinates[index + 1]);
      distanceSum += segmentDistance;
      // Wenn hälfte der Strecke überschritten wurde, ist das betreffende Segment das, mit der Mitte der Route
      // Vereinfacht wird hier der aktuelle Wegpunkt als Mitte angenommen, auch wenn er eigentlich der erste Wegpunkt nach der Mitte ist
      if (distanceSum >= targetDistance) {
        returnPositon = route.waypoints.coordinates[index + 1];
        return false;
      }
      return true;
    });
    return returnPositon!;
  };


  getDistanceBetweenTwoPoints = (pointA: Position, pointB: Position) => {
    const lon1 = this.toRadian(pointA[0]),
      lat1 = this.toRadian(pointA[1]),
      lon2 = this.toRadian(pointB[0]),
      lat2 = this.toRadian(pointB[1]);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  };


  toRadian = (degree: number) => {
    return degree * Math.PI / 180;
  };

}
