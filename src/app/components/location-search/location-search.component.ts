import { Component, OnInit } from '@angular/core';
import {MapboxApiService} from '../../api/mapbox.api.service';
import {MapboxLocation} from '../../interfaces/mapbox-location.interface';
import {StepService} from '../../services/step.service';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {

  showSearchResults: boolean = false;
  searchQuery?: string;
  queryTimeout?: number;
  searchResult?: MapboxLocation[];

  constructor(
    private mapboxApiService: MapboxApiService,
    private stepService: StepService
  ) { }

  ngOnInit(): void {
  }

  toggleSearchResults = () => {
    this.showSearchResults = !this.showSearchResults;
  };

  search = (): void => {
    if(this.queryTimeout) {
      clearTimeout(this.queryTimeout);
    }

    this.searchResult = undefined;
    this.queryTimeout = window.setTimeout(async () => {
      if (this.searchQuery) {
        this.mapboxApiService.getSearchResults(this.searchQuery).subscribe(result => {
          this.searchResult = result.features
        })
      }
    }, 750);
  };

  selectResult = (selectedLocation: MapboxLocation): void => {
    this.stepService.addStep(selectedLocation)
  };

  closeSearchResults = () => {
    this.showSearchResults = false;
  };

}
