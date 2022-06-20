import {Moment} from 'moment';
import {Coords} from '../interfaces/coords.interface';
import {RouteStore} from '../store/route.store';

export class Route {

  id: string;
  travelTime: number;
  distance: number;
  waypoints: Coords[];
  startTime: Moment;
  endTime: Moment;

  constructor(
    id: string,
    travelTime: number,
    distance: number,
    waypoints: Coords[],
    startTime: Moment,
    endTime: Moment
  ) {
    this.id = id;
    this.travelTime = travelTime;
    this.distance = distance;
    this.waypoints = waypoints;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  save = (): void => {
    if (RouteStore.instance.getRouteById(this.id)) {
      RouteStore.instance.updateRoute(this);
    } else {
      RouteStore.instance.createRoute(this);
    }
  };

  delete = (): void => {
    RouteStore.instance.deleteRoute(this);
  };


}
