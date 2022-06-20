import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[modalContentComponent]',
})
export class CustomModalDirective {
  constructor(
    public viewContainerRef: ViewContainerRef
  ) {
  }
}
