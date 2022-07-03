import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment-timezone';
import {Travel} from '../../classes/travel.class';
import {TravelStore} from '../../store/travel.store';
import {CustomModalService} from '../shared/custom-modal/custom-modal.service';

@Component({
  selector: 'app-travel-config',
  templateUrl: './travel-config.component.html',
  styleUrls: ['./travel-config.component.scss']
})
export class TravelConfigComponent implements OnInit {

  travel?: Travel;
  @ViewChild('modalContent') modalContent!: ElementRef;

  constructor(
    private travelStore: TravelStore,
    private customModalService: CustomModalService
  ) {
  }

  ngOnInit(): void {
  }

  // Getter+Setter für Typenumwandlung String <--> Moment
  get maxDrivingTime() {
    return moment.utc(this.travel!.maxDrivingTime.asMilliseconds()).format("HH:mm");
  }

  set maxDrivingTime(dateTime: string) {
    this.travel!.maxDrivingTime = moment.duration(dateTime);
  }

  get standardLocationDuration() {
    return moment.utc(this.travel!.standardLocationDuration.asMilliseconds()).format("HH:mm");
  }

  set standardLocationDuration(dateTime: string) {
    this.travel!.standardLocationDuration = moment.duration(dateTime);
  }

  get startMoment() {
    return this.travel!.start.format('YYYY-MM-DDTHH:mm');
  }

  set startMoment(dateTime: string) {
    this.travel!.start = moment(dateTime);
  }

  openModal = () => {
    this.travel = this.travelStore.getTravelById('black')!;

    const modalRef = this.customModalService.open(
      {
        title: 'Reiseeinstellungen',
        contentComponent: this.modalContent
      }
    );

    modalRef.buttonEvent.subscribe(() => {
      this.save();
      modalRef.close();
    });
  };

  save = () => {
    TravelStore.instance.updateTravel(this.travel!);
    TravelStore.instance.currentTravel = this.travel;
  };

}
