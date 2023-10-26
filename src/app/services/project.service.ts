import { Injectable } from '@angular/core';
import { ATYPE_TO_A, AssetType } from '../shared/ttc-types';
import { ElectronService } from './electron.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // private loaded_project: Project = new Project;
  private loaded_project: Map<AssetType, any[]> = new Map<AssetType, any[]>(
    Object.values(AssetType).map((value: string) => { return [value as AssetType, []]})
  );

  constructor(
    private electronService: ElectronService
  ) {
    this.loaded_project.set
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
}
