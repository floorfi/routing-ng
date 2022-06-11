import {Coords} from '../interfaces/coords.interface';
import {Marker} from 'mapbox-gl';
import {Moment} from 'moment';
import {StepStore} from '../store/step.store';
import {LocationStore} from '../store/location.store';

export class Location {

  id: string;
  label: string;
  coords: Coords;
  marker: Marker;
  arriveTime: Moment;
  leaveTime: Moment;

  constructor(
    id: string,
    label: string,
    coords: Coords,
    marker: Marker,
    arriveTime: Moment,
    leaveTime: Moment
  ) {
    this.id = id,
    this.label = label,
    this.coords = coords,
    this.marker = marker,
    this.arriveTime = arriveTime,
    this.leaveTime = leaveTime
  }

  save = (): void => {
    LocationStore.instance.createLocation(this);
  }

}
