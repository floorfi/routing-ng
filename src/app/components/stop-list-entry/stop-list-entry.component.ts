import {Component, Input, OnInit} from '@angular/core';
import {Step} from '../../interfaces/step.interface';

@Component({
  selector: 'app-stop-list-entry',
  templateUrl: './stop-list-entry.component.html',
  styleUrls: ['./stop-list-entry.component.scss']
})
export class StopListEntryComponent implements OnInit {

  @Input() step!: Step;

  constructor() { }

  ngOnInit(): void {
  }

  removeStep = () => {
    travelService.removeStop(props.step.id)
  };

  travelTime = (): string => {
    const seconds = route.value!.travelTime
    return moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("H:mm");
  }

  location = (): string => {
    return locationService.getlocationByID(props.step.id)
  }

  distance = (): string => {
    let distanceInKm = route.value!.distance/1000
    return distanceInKm.toFixed(1);
  }

}
