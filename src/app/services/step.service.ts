import { Injectable } from '@angular/core';
import {Step} from '../classes/step.class';
import {StepStore} from '../store/step.store';
import {MapboxLocation} from '../interfaces/mapbox-location.interface';
import {Location} from '../classes/location.class';
import {Route} from '../classes/route.class';
import {TravelConfigService} from './travelConfig.service';
import {LocationStore} from '../store/location.store';
import {RouteService} from './route.service';
import {MapService} from './map.service';
import {RouteStore} from '../store/route.store';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  static instance: StepService

  constructor(
    private travelConfigService: TravelConfigService,
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
      this.travelConfigService.config.start,
      this.travelConfigService.config.start
    )

    // Neuen Step anlegen
    const step = new Step(
      location.id,
      location.label
    )

    // Ggf. vorhandenen vorherigen Step holen
    const previousStep = step.getPreviousStep()

    // Wenn es eine vorhergehende Location gibt: Route berechnen
    if(previousStep) {
      const previousLocation = this.locationStore.getLocationById(previousStep.id)!
      this.routeService.getRouteBetweenLocations(previousLocation, location).then((route: Route) => {
        route.save()

        location.arriveTime = route.endTime
        location.leaveTime = route.endTime
      })
    }

    step.save()
    location.save()

    console.groupEnd()
  };


  removeStep = (stepID: string) => {
    // const stepToRemove: Step = this.stepService.steps.find((step: Step) => step.id === stepID)!;
    // const indexToRemove: number = this.stepService.steps.findIndex((step: Step) => step.id === stepID);
    // let previousStep: Step|null = null;
    // let followingStep: Step|null = null;
    //
    // // Vorherige routeTo entfernen
    // this.routeService.removeRoute(stepID);
    // this.mapService.removeLayer(stepID);
    //
    // // Gibt es einen vorherigen Step?
    // if(this.stepService.steps[indexToRemove-1]) {
    //   previousStep = this.stepService.steps[indexToRemove-1];
    // }
    //
    // // Gibt es einen Folgestep?
    // if(this.stepService.steps[indexToRemove+1]) {
    //   followingStep = this.stepService.steps[indexToRemove+1];
    //   this.routeService.removeRoute(followingStep!.id);
    //   this.mapService.removeLayer(followingStep!.id);
    // }
    //
    // // Recalculate route (if more than one step left)
    // if(previousStep && followingStep){
    //   const previousLocation = this.locationService.getlocationByID(previousStep.id)!
    //   const followingLocation = this.locationService.getlocationByID(followingStep.id)!
    //   this.routeService.getRouteBetweenLocations(previousLocation, followingLocation).then((route: GeoRoute) => {
    //     this.routeService.addRoute(route);
    //   })
    // }
    //
    // // Remove objects
    // const locationToRemove = this.locationService.getlocationByID(stepToRemove.id)
    // this.mapService.removeMarker(locationToRemove!.marker)
    // this.locationService.removeLocation(stepID);
    // this.stepStore.deleteStep(stepToRemove);
    //
    //
    // // Reindex arrays
    // this.locationService.reindex()
    // this.routeService.reindex()
  };

}
