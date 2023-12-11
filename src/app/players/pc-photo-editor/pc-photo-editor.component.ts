import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Player } from 'src/app/_models/player';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { CampaignService } from 'src/app/_services/campaign.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pc-photo-editor',
  templateUrl: './pc-photo-editor.component.html',
  styleUrls: ['./pc-photo-editor.component.css']
})
export class PcPhotoEditorComponent implements OnInit{  
  @Input() player : Player | undefined;
  uploader: FileUploader| undefined;
  hasBaseDropZoneOver = false; //hasBaseDropZoneOver
  baseUrl= environment.apiUrl;
  user:User| undefined;

  constructor(private campaignService:CampaignService,private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user
      }
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e:any){
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'player/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload:false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onBuildItemForm = (file: any, form: any) => {
      form.append('characterId', this.player?.id);
    };

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item,response,status,headers) => {
      if(response){
        const photo = JSON.parse(response);
        this.player?.characterPhotos.push(photo);
      }
    }
  }


}
