import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TButtonComponent } from './shared/t-button/t-button.component';
import { TModalComponent } from './shared/t-modal/t-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapWrapperComponent } from './map-wrapper/map-wrapper.component';
import { TravelConfigComponent } from './travel-config/travel-config.component';
import { StopListComponent } from './stop-list/stop-list.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { LoaderComponent } from './shared/loader/loader.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { StopListEntryComponent } from './stop-list-entry/stop-list-entry.component';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faCarSide,
  faGear, faLocationDot,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    TButtonComponent,
    TModalComponent,
    MapWrapperComponent,
    TravelConfigComponent,
    StopListComponent,
    LocationSearchComponent,
    LoaderComponent,
    StopListEntryComponent
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,
      FontAwesomeModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faGear,
      faArrowRightToBracket,
      faArrowRightFromBracket,
      faCarSide,
      faSearch,
      faLocationDot
    );
  }
}
