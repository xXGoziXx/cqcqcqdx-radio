import { AccountService } from './account.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export class UploadAdapterService {
  loader: any;
  allPercentage: Observable<any>;
  constructor(loader, private storage?: AngularFireStorage, private accountService?: AccountService) {
    // The file loader instance to use during the upload. It sounds scary but do not
    // worry — the loader will be passed into the adapter later on in this guide.
    this.loader = loader;
  }

  // Starts the upload process.
  upload = async () => {
    // console.log('Loader: ', this.loader);
    this.accountService.uploadingImages = true;
    const file = await this.loader.file;
    const path = `images/${new Date().getTime()}_${file.name}`;
    try {
      const ref = this.storage.ref(path);
    } catch (err) {
      console.log('Error: ', err);
    }
    const task = await this.storage.upload(path, file);
    const url = await task.ref.getDownloadURL();
    // console.log(url);
    this.accountService.uploadingImages = false;
    return { default: url };
  };
}
