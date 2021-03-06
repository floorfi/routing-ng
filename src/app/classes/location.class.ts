import {Position} from 'geojson';
import {Marker} from 'mapbox-gl';
import {Moment} from 'moment';
import * as moment from 'moment-timezone';
import {MapService} from '../services/map.service';
import {RouteService} from '../services/route.service';
import {LocationStore} from '../store/location.store';
import {RouteStore} from '../store/route.store';
import {StepStore} from '../store/step.store';
import {TravelStore} from '../store/travel.store';
import {Route} from './route.class';
import {Step} from './step.class';

export class Location {

  id: string;
  locationName: string;
  coords: Position;
  marker?: Marker;
  orderId: number;
  arriveTime!: Moment;
  leaveTime!: Moment;
  pin: {
    icon: string,
    color: string
  };

  constructor(
    id: string,
    label: string,
    coords: Position,
    orderId: number,
    icon: string = 'fa-mountain-city',
    color: string = '#000'
  ) {
    this.id = id;
    this.locationName = label;
    this.coords = coords;
    this.orderId = orderId;
    this.pin = {
      icon: icon,
      color: color
    };
    this.calculateTimes();
  }


  get previousLocation(): Location | null {
    if (LocationStore.instance.locations$.value.length === 0) return null;
    return LocationStore.instance.locations$.value.find(location => location.orderId === this.orderId - 1)!;
  }


  get followingLocation(): Location | null {
    const followingLocation = LocationStore.instance.locations$.value.find(location => location.orderId === this.orderId + 1);
    return followingLocation ? followingLocation : null;
  }


  get step(): Step | undefined {
    return StepStore.instance.getStepById(this.id);
  }


  get route(): Route | undefined {
    return RouteStore.instance.getRouteById(this.id);
  }


  calculateTimes = () => {
    if(this.orderId === 0 || !this.route) {
      this.arriveTime = moment(TravelStore.instance.currentTravel!.start);
    } else {
      this.arriveTime = moment(this.previousLocation!.leaveTime).add(this.route!.travelTime.asSeconds(), 'seconds')
    }
    const arriveTime = moment(this.arriveTime)
    this.leaveTime = arriveTime.add(TravelStore.instance.currentTravel!.standardLocationDuration.asSeconds(), 'seconds')
    // TODO: Tagesbeginn/Ende ber??cksichtigen

  }


  buildRouteTo = (): Promise<true> => {
    console.log('Build Route for Location', this);
    console.log(this.previousLocation);

    if (this.previousLocation) {
      return new Promise<true>(resolve => {
        // Alte Route l??schen
        const routeToRemove = RouteStore.instance.getRouteById(this.id)!;
        if (routeToRemove) {
          routeToRemove.delete();
        }

        RouteService.instance.getRouteBetweenLocations(this.previousLocation!, this).then((route: Route) => {
          route.save();
          console.log(route);
          this.calculateTimes();
          this.save();

          resolve(true);
        });
      });
    }

    return Promise.resolve(true);
  };


  drawToMap = () => {
    this.removeFromMap();
    const marker = MapService.instance.addMarker(this.coords, this.id, true, this.pin.icon, this.pin.color);
    this.marker = marker;
  };


  removeFromMap = () => {
    if (this.marker) {
      MapService.instance.removeMarker(this.marker);
      this.marker = undefined;
    }
  };


  save = (): void => {
    console.log('Location save');
    if (LocationStore.instance.getLocationById(this.id)) {
      LocationStore.instance.updateLocation(this);
    } else {
      LocationStore.instance.createLocation(this);
    }

    this.drawToMap();
  };


  delete = (): void => {
    console.log('Location delete');
    this.removeFromMap();
    LocationStore.instance.deleteLocation(this);

    // orderIDs der folgenden Locations anpassen
    LocationStore.instance.locations$.value.forEach(location => {
      if (location.orderId >= this.orderId) {
        location.orderId = location.orderId - 1;
        location.save();
      }
    });
  };

}
