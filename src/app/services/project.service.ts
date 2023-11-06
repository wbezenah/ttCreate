import { Injectable } from '@angular/core';
import { ATYPE_TO_A, AssetType } from '../shared/ttc-types';
import { ElectronService } from './electron.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public loaded_project: Map<AssetType, any[]> = new Map<AssetType, any[]>(
    Object.values(AssetType).map((value: string) => { return [value as AssetType, []]})
  );

  constructor(
    private electronService: ElectronService
  ) {
    // console.log(JSON.stringify(Object.fromEntries(this.loaded_project)));
  }

  newAsset(assetType: AssetType, title: string): number {
    let asset = new (ATYPE_TO_A(assetType) as any)(title);
    return this.loaded_project.get(assetType).push(asset) - 1;
  }

  getAsset(assetType: AssetType, index: number) {
    return this.loaded_project.get(assetType)[index];
  }

  loadProject() {
    //[] allows all file types. need to change to project file extension
    this.electronService.openFile([], true);

    firstValueFrom(this.electronService.fileResults).then((value: Buffer[]) => {
      // console.log(value[0].toString());
      //handle project file contents
    });
  }

  updateAsset(assetType: AssetType, index: number, ...args: {property: string, val: any}[]) {
    if(index >= this.loaded_project.get(assetType).length) { return; }
    let asset = this.loaded_project.get(assetType)[index];
    for(let arg of args) {
      if(arg.property in asset) {
        asset[arg.property] = arg.val;
      }
    }
  }
}
