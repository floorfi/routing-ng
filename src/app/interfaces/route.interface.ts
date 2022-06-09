import {Moment} from 'moment';
import {Coords} from './coords.interface';

export interface GeoRoute {
    id: string;
    travelTime: number;
    distance: number;
    waypoints: Coords[];
    startTime?: Moment;
    endTime?: Moment;
}
