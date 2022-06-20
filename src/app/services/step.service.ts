import {Injectable} from '@angular/core';
import {Location} from '../classes/location.class';
import {Route} from '../classes/route.class';
import {Step} from '../classes/step.class';
import {MapboxLocation} from '../interfaces/mapbox-location.interface';
import {LocationStore} from '../store/location.store';
import {RouteStore} from '../store/route.store';
import {StepStore} from '../store/step.store';
import {TravelStore} from '../store/travel.store';
import {MapService} from './map.service';
import {RouteService} from './route.service';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  static instance: StepService;

  constructor(
    private travelStore: TravelStore,
    private stepStore: StepStore,
    private locationStore: LocationStore,
    private routeService: RouteService,
    private routeStore: RouteStore,
    private mapService: MapService
  ) {
    StepService.instance = this
  }

  addStep = (result: MapboxLocation): void => {
    console.group('Add stop')

    // Neue Location ablegen + Marker setzen
    const coords = this.mapService.convertNumbersToCoords(result.geometry.coordinates)
    const marker = this.mapService.addMarker(coords, true)
    const location = new Location(
      result.id,
      result.text_de,
      coords,
      marker,
      this.travelStore.currentTravel!.start,
      this.travelStore.currentTravel!.start
    )

    // Neuen Step anlegen
    const step = new Step(
      location.id,
      location.label
    )

    // Ggf. vorhandenen vorherigen Step holen
    const previousStep = step.previousStep;

    // Wenn es eine vorhergehende Location gibt: Route berechnen
    if (previousStep) {
      const previousLocation = this.locationStore.getLocationById(previousStep.id)!;
      this.routeService.getRouteBetweenLocations(previousLocation, location).then((route: Route) => {
        route.save();

        location.arriveTime = route.endTime;
        location.leaveTime = route.endTime;
      });
    }

    step.save();
    location.save();

    console.groupEnd();
  };


  removeStep = (stepId: string) => {
    const stepToRemove = this.stepStore.getStepById(stepId)!;

    let previousStep = stepToRemove.previousStep;
    let followingStep = stepToRemove.followingStep;

    // Ggf. vorherige route entfernen
    if (previousStep) {
      const routeToRemove = this.routeStore.getRouteById(stepId)!;
      routeToRemove.delete();
      this.mapService.removeLayer(stepId);
    }

    // Location und step entfernen
    const locationToRemove = this.locationStore.getLocationById(stepToRemove.id)!;
    this.mapService.removeMarker(locationToRemove!.marker);
    locationToRemove.delete();
    stepToRemove.delete();


    // Gibt es einen Folgestep?
    if (followingStep) {
      // Alte Route löschen
      const routeToRemove = this.routeStore.getRouteById(followingStep.id)!;
      routeToRemove.delete();
      this.mapService.removeLayer(followingStep.id);

      // orderIDs der folgenden Steps anpassen
      this.stepStore.steps$.value.forEach(step => {
        if (step.orderId >= followingStep!.orderId) {
          step.orderId = step.orderId - 1;
          step.save();
        }
      });
    }

    // Route neu berechnen (wenn es vorherige und folgende Route gibt)
    if (previousStep && followingStep) {
      const previousLocation = this.locationStore.getLocationById(previousStep.id)!;
      const followingLocation = this.locationStore.getLocationById(followingStep.id)!;
      this.routeService.getRouteBetweenLocations(previousLocation, followingLocation).then(route => {
        route.save();

        followingLocation.arriveTime = route.endTime;
        followingLocation.leaveTime = route.endTime;
      });

      followingLocation.save();
    }
  };


  recalculateTimes = () => {

  };
}
