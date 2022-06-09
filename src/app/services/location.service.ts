import { Injectable } from '@angular/core';
import {MapboxLocation} from '../interfaces/mapbox-location.interface';
import {GeoLocation} from '../interfaces/location.interface';
import {RouteService} from './route.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  locations: GeoLocation[] = [];

  constructor(
    private routeService: RouteService
  ) { }

  addLocation = (location: GeoLocation) => {
    this.locations.push(location)
  }
  removeLocation = (id: string) => {
    this.locations = this.locations.filter((location: GeoLocation) => {
      return location.id !== id
    })
  }

  getTravelDistanceToLocation = (id: string) => {
    let travelTime: number = 0;
    const locationIndex = this.locations.findIndex(location => location.id === id);
    // Erster Stop -> 0
    if(locationIndex !== 0) {
      this.routeService.routes.every((route, index) => {

        if(index >= locationIndex){
          return false
        } else {
          travelTime += route.travelTime
          return true
        }
      })
    }

    return travelTime

  }

  getlocationByID = (id: string): GeoLocation|undefined => {
    return this.locations.find(location => location.id === id)
  }

  reindex = () => {
    this.locations.filter((location: GeoLocation) => location)
  }

}
