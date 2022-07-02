import {Point} from 'geojson';

export interface MapboxLocation {
  bbox: [number, number, number, number];
  center: [number, number];
  context: any[];
  geometry: Point;
  id: string;
  language: string;
  language_de: string;
  place_name: string;
  place_name_de: string;
  place_type: string[];
  properties: object;
  relevance: number;
  text: string;
  text_de: string;
  type: string;
}
