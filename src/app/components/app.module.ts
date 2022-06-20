import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faCarSide,
  faGear,
  faLocationDot,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LocationSearchComponent} from './location-search/location-search.component';
import {MapWrapperComponent} from './map-wrapper/map-wrapper.component';
import {CustomModalModule} from './shared/custom-modal/custom-modal.module';
import {LoaderComponent} from './shared/loader/loader.component';
import {TModalComponent} from './shared/t-modal/t-modal.component';
import {StopListEntryComponent} from './stop-list-entry/stop-list-entry.component';
import {StopListComponent} from './stop-list/stop-list.component';
import {TravelConfigComponent} from './travel-config/travel-config.component';

@NgModule({
  declarations: [
    AppComponent,
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
    FontAwesomeModule,
    CustomModalModule
  ],
  providers: [],
  exports: [],
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
