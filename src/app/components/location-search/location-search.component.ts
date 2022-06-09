import { Component, OnInit } from '@angular/core';
import {MapboxApiService} from '../../api/mapbox.api.service';
import {MapboxLocation} from '../../interfaces/mapbox-location.interface';
import {TravelService} from '../../services/travel.service';

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
    private travelService: TravelService
  ) { }

  ngOnInit(): void {
  }

  toggleSearchResults = () => {
    this.showSearchResults = !this.showSearchResults;
  };

  search = (): void => {
    console.log('search')
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

  selectResult = (result: MapboxLocation): void => {
    this.travelService.addStop(result)
  };

  closeSearchResults = () => {
    this.showSearchResults = false;
  };

}
