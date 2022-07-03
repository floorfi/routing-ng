import {Component, OnInit} from '@angular/core';
import {Location} from '../../classes/location.class';
import {LocationStore} from '../../store/location.store';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss']
})
export class StopListComponent implements OnInit {

  locations: Location[] = [];

  constructor(
    private locationStore: LocationStore
  ) { }

  ngOnInit(): void {
    this.locationStore.locations$.subscribe(locations => {
      console.log('location change')
      this.locations = locations.sort((a, b) => a.orderId > b.orderId ? 1 : -1);
    });
  }

}
