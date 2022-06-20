import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {TButtonComponent} from '../t-button/t-button.component';
import {CustomModalComponent} from "./custom-modal.component";
import {CustomModalDirective} from "./custom-modal.directive";
import {CustomModalService} from "./custom-modal.service";

@NgModule({
  declarations: [
    CustomModalComponent,
    CustomModalDirective,
    TButtonComponent
  ],
  exports: [
    CustomModalComponent,
    TButtonComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    CustomModalService
  ]
})
export class CustomModalModule {
}
