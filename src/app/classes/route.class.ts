import {LineString} from 'geojson';
import {Duration, Moment} from 'moment-timezone';
import {MapService} from '../services/map.service';
import {LocationStore} from '../store/location.store';
import {RouteStore} from '../store/route.store';
import {StepStore} from '../store/step.store';
import {Location} from './location.class';
import {Step} from './step.class';

export class Route {

  id: string;
  travelTime: Duration;
  distance: number;
  waypoints: LineString;

  constructor(
    id: string,
    travelTime: Duration,
    distance: number,
    waypoints: LineString
  ) {
    this.id = id;
    this.travelTime = travelTime;
    this.distance = distance;
    this.waypoints = waypoints;
  }

  get step(): Step | undefined {
    return StepStore.instance.getStepById(this.id);
  }

  get startLocation(): Location {
    return LocationStore.instance.getLocationById(this.endLocation.previousLocation!.id)!;
  }

  get endLocation(): Location {
    return LocationStore.instance.getLocationById(this.id)!;
  }

  drawToMap = () => {
    const waypoints = this.waypoints.coordinates;
    const geojson = MapService.instance.buildLineStringFeature(waypoints);
    MapService.instance.addLayerRoute(this.id, geojson);
  };

  removeFromMap = () => {
    MapService.instance.removeLayer(this.id);
  };


  save = (): void => {
    this.drawToMap();
    if (RouteStore.instance.getRouteById(this.id)) {
      RouteStore.instance.updateRoute(this);
    } else {
      RouteStore.instance.createRoute(this);
    }
  };


  delete = (): void => {
    this.removeFromMap();
    RouteStore.instance.deleteRoute(this);
  };


}
