import { Component, OnInit } from '@angular/core';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-map-wrapper',
  templateUrl: './map-wrapper.component.html',
  styleUrls: ['./map-wrapper.component.scss']
})
export class MapWrapperComponent implements OnInit {

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.mapService.initiateMap()
  }

}
