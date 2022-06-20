import {Component, OnInit} from '@angular/core';
import {Travel} from '../../classes/travel.class';
import {MapService} from '../../services/map.service';
import {TravelStore} from '../../store/travel.store';

@Component({
  selector: 'app-map-wrapper',
  templateUrl: './map-wrapper.component.html',
  styleUrls: ['./map-wrapper.component.scss']
})
export class MapWrapperComponent implements OnInit {

  constructor(
    private mapService: MapService,
    private travelStore: TravelStore
  ) {
    // TODO Dummy Reise erstellen
    const travel = new Travel(
      'Meine Reise'
    );
    this.travelStore.createTravel(travel).then(travel => {
      this.travelStore.currentTravel = travel;
    });
  }

  ngOnInit(): void {


    this.mapService.initiateMap()

  }

}
