import { Injectable } from '@angular/core';
import { ATYPE_TO_A, AssetType } from '../shared/ttc-types';
import { ElectronService } from './electron.service';
import { Subject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  loaded_project: Map<AssetType, any[]> = new Map<AssetType, any[]>(
    Object.values(AssetType).map((value: string) => { return [value as AssetType, []]})
  );

  assetUpdate: Subject<{type: AssetType, index: number, updates: {property: string, val: any}[]}> = new Subject();

  constructor(
    private electronService: ElectronService
  ) {
    // console.log(JSON.stringify(Object.fromEntries(this.loaded_project)));
  }

  newAsset(assetType: AssetType, title: string): number {
    let assets = this.loaded_project.get(assetType);
    let asset = new (ATYPE_TO_A(assetType) as any)(title, assets.length);
    return assets.push(asset) - 1;
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
    let valid_res = [];
    for(let arg of args) {
      if(arg.property in asset) {
        asset[arg.property] = arg.val;
        valid_res.push(arg);
      }
    }
    this.assetUpdate.next({type: assetType, index: index, updates: valid_res});
  }
}
