import { Component } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { firstValueFrom } from 'rxjs';
import { FileTypeSet } from '../../../../shared/ttc-types';
import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-token-tools',
  templateUrl: './token-tools.component.html',
  styleUrls: ['./token-tools.component.css', '../token.css', '../../editors.css']
})
export class TokenToolsComponent {
  constructor(private electronService: ElectronService, private projectService: ProjectService) { }

  onNewImage() {
    this.electronService.openFile([FileTypeSet.imageTypes], false);
    firstValueFrom(this.electronService.fileResults).then((value: Buffer[]) => {
      // console.log(value);
      if(value.length === 1){
        const fileReader = new FileReader;
        fileReader.onload = () => {
          this.projectService;
        }
        fileReader.readAsDataURL(new Blob(value));
      }
    });
  }
}
