import {Component, Input, OnInit} from '@angular/core';

import * as moment from 'moment-timezone';
import {Location} from '../../classes/location.class';
import {RouteService} from '../../services/route.service';
import {Step} from '../../classes/step.class';
import {LocationStore} from '../../store/location.store';
import {StepService} from '../../services/step.service';
import {Route} from '../../classes/route.class';
import {RouteStore} from '../../store/route.store';

@Component({
  selector: 'app-stop-list-entry',
  templateUrl: './stop-list-entry.component.html',
  styleUrls: ['./stop-list-entry.component.scss']
})
export class StopListEntryComponent implements OnInit {

  @Input() step!: Step;

  constructor(
    private stepService: StepService,
    private locationStore: LocationStore,
    private routeStore: RouteStore
  ) { }

  ngOnInit(): void {
  }

  removeStep = () => {
    this.stepService.removeStep(this.step.id)
  };

  get travelTime (): string {
    const seconds = this.route.travelTime
    return moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("H:mm");
  }

  get location (): Location {
    return this.locationStore.getLocationById(this.step.id)!
  }

  get route (): Route {
    return this.routeStore.getRouteById(this.step.id)!
  }

  get distance (): string {
    let distanceInKm = this.route.distance/1000
    return distanceInKm.toFixed(1);
  }

}
