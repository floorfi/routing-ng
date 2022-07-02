import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import * as moment from 'moment-timezone';
import {Location} from '../../classes/location.class';
import {Route} from '../../classes/route.class';
import {Step} from '../../classes/step.class';
import {StepService} from '../../services/step.service';
import {RouteStore} from '../../store/route.store';
import {StepStore} from '../../store/step.store';
import {CustomModalComponent} from '../shared/custom-modal/custom-modal.component';
import {CustomModalService} from '../shared/custom-modal/custom-modal.service';

@Component({
  selector: 'app-stop-list-entry',
  templateUrl: './stop-list-entry.component.html',
  styleUrls: ['./stop-list-entry.component.scss']
})
export class StopListEntryComponent implements OnInit {

  @Input() location!: Location;
  @ViewChild('modalContent') modalContent!: ElementRef;
  @ViewChild('modalFooter') modalFooter!: ElementRef;
  modalRef?: CustomModalComponent;
  pinHover: boolean = false;

  constructor(
    private stepService: StepService,
    private stepStore: StepStore,
    private routeStore: RouteStore,
    private customModalService: CustomModalService
  ) {
  }

  ngOnInit(): void {
  }


  get step(): Step | undefined {
    return this.stepStore.getStepById(this.location.id)!;
  }


  get route(): Route {
    return this.routeStore.getRouteById(this.location.id)!;
  }

  get arrivalMoment() {
    return this.location.arriveTime.format('YYYY-MM-DDTHH:mm');
  }


  get travelTime(): string {
    const seconds = this.route.travelTime;
    return moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("H:mm");
  }


  get distance(): string {
    let distanceInKm = this.route.distance / 1000;
    return distanceInKm.toFixed(1);
  }

  set arrivalMoment(dateTime: string) {
    this.location.arriveTime = moment(dateTime);
  }

  get leaveMoment() {
    return this.location.arriveTime.format('YYYY-MM-DDTHH:mm');
  }

  set leaveMoment(dateTime: string) {
    this.location.arriveTime = moment(dateTime);
  }

  removeStep = () => {
    this.modalRef!.close();
    this.stepService.removeStep(this.step!.id);
  };

  openModal = () => {
    this.modalRef = this.customModalService.open(
      {
        title: 'Stopeinstellungen',
        contentComponent: this.modalContent,
        footerComponent: this.modalFooter,
      }
    );

    this.modalRef.buttonEvent.subscribe(() => {
      if (this.step) {
        this.step.save();
      }
      this.location.save();
      this.modalRef!.close();
    });
  };


  togglePinHover = () => {
    this.pinHover = !this.pinHover;

    const pinEl = document.getElementById(this.location.id)!.firstElementChild!;

    if (this.pinHover) {
      pinEl.setAttribute('style', '');
      pinEl.classList.add('text-slate-600');
    } else {
      pinEl.setAttribute('style', 'color: ' + this.location.pin.color);
      pinEl.classList.remove('text-slate-600');
    }
  };
}
