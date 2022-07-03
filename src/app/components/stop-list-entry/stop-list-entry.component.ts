import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import * as moment from 'moment-timezone';
import {Location} from '../../classes/location.class';
import {Route} from '../../classes/route.class';
import {Step} from '../../classes/step.class';
import {StepService} from '../../services/step.service';
import {LocationStore} from '../../store/location.store';
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
    private locationStore: LocationStore,
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


  get travelTime(): string {
    const seconds = this.route.travelTime;
    return moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("H:mm");
  }


  get distance(): string {
    let distanceInKm = this.route.distance / 1000;
    return distanceInKm.toFixed(1);
  }

  get arrivalMoment() {
    return this.location.arriveTime.format('YYYY-MM-DDTHH:mm');
  }


  set arrivalMoment(dateTime: string) {
    this.location.arriveTime = moment(dateTime);
  }


  get leaveMoment() {
    return this.location.leaveTime.format('YYYY-MM-DDTHH:mm');
  }


  set leaveMoment(dateTime: string) {
    this.location.leaveTime = moment(dateTime);
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
      this.save();
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


  save = () => {
    const locationStoreEquivalent = this.locationStore.locations$.value.find(location => location.id === this.location.id)!
    console.log('Location store equivalent', locationStoreEquivalent.leaveTime.format())
    console.log('Location current', this.location.leaveTime.format())
    // if(this.location.arriveTime !== locationStoreEquivalent.arriveTime || this.location.leaveTime !== locationStoreEquivalent.leaveTime) {
      this.stepService.recalculateTimes();
    // }

    if (this.step) {
      this.step.save();
    }
    this.location.save();
  }
}
