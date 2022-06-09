import { Injectable } from '@angular/core';
import {MapboxLocation} from '../interfaces/mapbox-location.interface';
import {LocationService} from './location.service';
import {MapService} from './map.service';
import {Moment} from 'moment';
import * as moment from 'moment-timezone';
import {TravelConfigService} from './travelConfig.service';
import {GeoLocation} from '../interfaces/location.interface';
import {RouteService} from './route.service';
import {GeoRoute} from '../interfaces/route.interface';
import {Step} from '../interfaces/step.interface';
import {StepService} from './step.service';

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(
    private travelConfigService: TravelConfigService,
    private stepService: StepService,
    private locationService: LocationService,
    private routeService: RouteService,
    private mapService: MapService
  ) { }

  addStop = (result: MapboxLocation): void => {
    // Ggf. vorhandene vorherige Location holen
    let previousLocation: GeoLocation|undefined;
    if(this.locationService.locations.length > 0) {
      previousLocation = this.locationService.locations[this.locationService.locations.length - 1];
    }

    // Neue Location ablegen + Marker setzen
    const coords = this.mapService.convertNumbersToCoords(result.geometry.coordinates)
    const marker = this.mapService.addMarker(coords, true)

    let startMoment: Moment = moment();
    if(!previousLocation) {
      startMoment = this.travelConfigService.config.start
    }

    const location: GeoLocation = {
      id: result.id,
      label: result.text_de,
      coords: coords,
      marker: marker,
      arriveTime: startMoment,
      leaveTime: startMoment
    }

    console.log(location.leaveTime);


    // Wenn es eine vorhergehende Location gibt: Route berechnen
    if(previousLocation) {
      this.routeService.getRouteBetweenLocations(previousLocation, location).then((route: GeoRoute) => {
        this.routeService.addRoute(route);

        location.arriveTime = route.endTime
        location.leaveTime = route.endTime
      })
    }


    const step: Step = {
      id: location.id,
      label: location.label,
      nights: 0
    }

    this.stepService.addStep(step);
    this.locationService.addLocation(location);

  };


  removeStop = (stepID: string) => {
    const stepToRemove: Step = this.stepService.steps.find((step: Step) => step.id === stepID)!;
    const indexToRemove: number = this.stepService.steps.findIndex((step: Step) => step.id === stepID);
    let previousStep: Step|null = null;
    let followingStep: Step|null = null;

    // Vorherige routeTo entfernen
    this.routeService.removeRoute(stepID);
    this.mapService.removeLayer(stepID);

    // Gibt es einen vorherigen Step?
    if(this.stepService.steps[indexToRemove-1]) {
      previousStep = this.stepService.steps[indexToRemove-1];
    }

    // Gibt es einen Folgestep?
    if(this.stepService.steps[indexToRemove+1]) {
      followingStep = this.stepService.steps[indexToRemove+1];
      this.routeService.removeRoute(followingStep!.id);
      this.mapService.removeLayer(followingStep!.id);
    }

    // Recalculate route (if more than one step left)
    if(previousStep && followingStep){
      const previousLocation = this.locationService.getlocationByID(previousStep.id)!
      const followingLocation = this.locationService.getlocationByID(followingStep.id)!
      this.routeService.getRouteBetweenLocations(previousLocation, followingLocation).then((route: GeoRoute) => {
        this.routeService.addRoute(route);
      })
    }

    // Remove objects
    const locationToRemove = this.locationService.getlocationByID(stepToRemove.id)
    this.mapService.removeMarker(locationToRemove!.marker)
    this.locationService.removeLocation(stepID);
    this.stepService.removeStep(stepID);


    // Reindex arrays
    this.locationService.reindex()
    this.routeService.reindex()
  };

}
