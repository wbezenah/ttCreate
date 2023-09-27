import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAssetsHost]'
})
export class AssetsHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
