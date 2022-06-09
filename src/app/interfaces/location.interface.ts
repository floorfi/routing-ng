import {Marker} from "mapbox-gl";
import {Moment} from 'moment';
import {Coords} from './coords.interface';

export interface GeoLocation {
    id: string;
    label: string;
    coords: Coords;
    marker: Marker;
    arriveTime?: Moment;
    leaveTime?: Moment;
}
