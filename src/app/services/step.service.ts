import {Injectable} from '@angular/core';
import {Location} from '../classes/location.class';
import {Step} from '../classes/step.class';
import {MapboxLocation} from '../interfaces/mapbox-location.interface';
import {LocationStore} from '../store/location.store';
import {RouteStore} from '../store/route.store';
import {StepStore} from '../store/step.store';
import {TravelStore} from '../store/travel.store';
import {LocationService} from './location.service';
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
    private locationService: LocationService,
    private routeService: RouteService,
    private routeStore: RouteStore,
  ) {
    StepService.instance = this;
  }

  get nextOrderID(): number {
    if (StepStore.instance.steps$.value.length === 0) return 0;
    return StepStore.instance.steps$.value.reduce((prev, curr) => prev.orderId < curr.orderId ? curr : prev).orderId + 1;
  }

  addStep = (result: MapboxLocation): void => {
    console.group('Add stop');

    // Neue Location ablegen
    const coords = result.geometry.coordinates;
    const location = new Location(
      result.id,
      result.text_de,
      coords,
      this.locationService.nextOrderID
    );

    // Neuen Step anlegen
    const step = new Step(
      location.id,
      location.locationName,
      location,
      this.nextOrderID
    );


    // Route berechnen
    step.buildRouteTo().then(() => {
      location.save();
      step.save();
    });

    console.groupEnd();
  };

  removeStep = (stepId: string) => {
    const stepToRemove = this.stepStore.getStepById(stepId)!;
    const followingStep = stepToRemove.followingStep;

    // Ggf. vorherige route entfernen
    if (stepToRemove.previousStep) {
      this.deleteEntriesBeforeStep(stepToRemove);
    }

    stepToRemove.location.delete();
    stepToRemove.delete();

    console.log('Following step', followingStep);

    // Gibt es einen Folgestep?
    if (followingStep) {
      followingStep.buildRouteTo();
    }

  }

  // Löscht Locations und Routen von vorherigem bis zum angegebenen Step (aber nicht diese beiden steps und locations selbst)
  deleteEntriesBeforeStep = (step: Step) => {
    const previousLocationOrderId = step.previousStep?.location.orderId!;
    const locationsToDelete = this.locationStore.locations$.value.filter(location =>
      location.orderId > previousLocationOrderId && location.orderId < step.location.orderId
    );
    locationsToDelete.forEach(location => {
      console.log('Delete location and route to', location);
      location.route?.delete();
      location.delete();
    });
    step.location.route?.delete();
  };


  recalculateTimes = () => {

  };
}
