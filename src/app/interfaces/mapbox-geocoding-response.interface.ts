import {MapboxLocation} from './mapbox-location.interface';

export interface MapboxGeocodingResponse {
    attribution: string;
    features: MapboxLocation[];
    query: string[];
    type: string;
}
