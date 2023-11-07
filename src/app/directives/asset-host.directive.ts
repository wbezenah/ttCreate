import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[assetHost]'
})
export class AssetHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
