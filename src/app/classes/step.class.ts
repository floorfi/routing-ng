import {RouteService} from '../services/route.service';
import {StepService} from '../services/step.service';
import {LocationStore} from '../store/location.store';
import {StepStore} from '../store/step.store';
import {TravelStore} from '../store/travel.store';
import {Location} from './location.class';
import {Route} from './route.class';

export class Step {

  id: string;
  label: string;
  orderId: number;
  location: Location;

  constructor(
    id: string,
    label: string,
    location: Location,
    orderId: number,
  ) {
    this.id = id;
    this.label = label;
    this.orderId = orderId;
    this.location = location;
  }


  get previousStep(): Step | null {
    if (StepStore.instance.steps$.value.length === 0) return null;
    return StepStore.instance.steps$.value.find(step => step.orderId === this.orderId - 1)!;
  }


  get followingStep(): Step | null {
    const followingStep = StepStore.instance.steps$.value.find(step => step.orderId === this.orderId + 1);
    return followingStep ? followingStep : null;
  }


  buildRouteTo = (): Promise<true> => {
    if (this.location && this.previousStep) {
      return new Promise<true>(resolve => {
        console.log('Build route to step');

        // Alle items von vorherigem bis zu diesem Step löschen
        StepService.instance.deleteEntriesBeforeStep(this);


        let previousLocation = this.previousStep?.location!;

        // Es wird eine sehr detailierte Route geholt, um die Zwischenstops berechnen zu können
        RouteService.instance.getRouteBetweenLocations(previousLocation, this.location!, true).then((route: Route) => {

          // Route zu lang? Zwischenstops einbauen!
          if (route.travelTime > TravelStore.instance.currentTravel!.maxDrivingTime) {
            console.log('Route too long');
            console.group('Add auto stops');
            RouteService.instance.addAutoStops(previousLocation, this.location!, route).then(() => {
              resolve(true);
              console.groupEnd();
            });
          }
          // Route so okay -> speichern
          else {
            // TODO: Es wurde eine Komplexe Route geholt, diese noch vereinfachen: https://mourner.github.io/simplify-js/

            route.save();
            this.location!.calculateTimes()
            this.location!.save();
            resolve(true);
          }
        });
      });
    }

    return Promise.resolve(true);
  };


  save = (): void => {
    if (StepStore.instance.getStepById(this.id)) {
      StepStore.instance.updateStep(this);
    } else {
      StepStore.instance.createStep(this);
    }
  };


  delete = (): void => {
    StepStore.instance.deleteStep(this);

    // orderIDs der folgenden Steps anpassen
    StepStore.instance.steps$.value.forEach(step => {
      if (step.orderId >= this.orderId) {
        step.orderId = step.orderId - 1;
        step.save();
      }
    });
  };
}
