import {Injectable} from '@angular/core';
import {LocationStore} from '../store/location.store';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  static instance: LocationService;

  constructor() {
    LocationService.instance = this;
  }


  get nextOrderID(): number {
    if (LocationStore.instance.locations$.value.length === 0) return 0;
    return LocationStore.instance.locations$.value.reduce((prev, curr) => prev.orderId < curr.orderId ? curr : prev).orderId + 1;
  }

}
