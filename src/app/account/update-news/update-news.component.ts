import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AccountService } from '../../services/account.service';
import { UploadAdapterService } from '../../services/uploadAdapter.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-update-news',
  templateUrl: './update-news.component.html',
  styleUrls: ['./update-news.component.scss']
})
export class UpdateNewsComponent implements OnInit, AfterViewChecked {
  @ViewChild('editor') editorComponent: CKEditorComponent;
  Editor = ClassicEditor;
  editorData = 'Test';
  isDirty = false;
  pendingActions = [];
  adapterUploaded = false;
  constructor(public afs: AngularFirestore, public storage: AngularFireStorage, public accountService: AccountService) {
    this.restoreNews();
  }
  restoreNews = async () => {
    this.pendingActions.push('Saving changes');
    const adminList = await this.afs.doc('users/adminList').ref.get();
    this.pendingActions.pop();
    console.log(adminList.data().news);
    this.editorData = adminList.data().news;
  };

  onReady = editor => {
    console.log('Editor: ', this.editorComponent);
    this.handleSaveButton(editor);
    this.handleBeforeunload(editor);
  };
  // Handle clicking the "Save" button by sending the data to a
  // fake HTTP server (emulated here with setTimeout()).
  handleSaveButton = editor => {
    const saveButton = $('#save');

    saveButton.on('click', async evt => {
      const data = this.editorData;
      console.log(data);
      // Register the action of saving the data as a "pending action".
      // All asynchronous actions related to the editor are tracked like this,
      // so later on you only need to check `pendingActions.hasAny` to check
      // whether the editor is busy or not.
      this.pendingActions.push('Saving changes');

      evt.preventDefault();

      try {
        await this.afs.doc('users/adminList').update({
          news: data
        });
        $('.callout.success').show();
      } catch (err) {
        $('.callout.alert').show();
        $('span.error').html(err);
        console.error(err);
      }
      this.pendingActions.pop();
      // Reset this.isDirty only if the data did not change in the meantime.
      if (data === this.editorData) {
        this.isDirty = false;
      }
    });
  };

  // Listen to new changes (to enable the "Save" button) and to
  // pending actions (to show the spinner animation when the editor is busy).
  onStatusChange = () => {
    console.log(this.editorData);
    this.isDirty = true;
  };

  // If the user tries to leave the page before the data is saved, ask
  // them whether they are sure they want to proceed.
  handleBeforeunload = editor => {
    window.addEventListener('beforeunload', evt => {
      if (this.pendingActions.length || this.accountService.uploadingImages || this.isDirty) {
        evt.preventDefault();
      }
    });
  };
  ngOnInit(): void {}
  ngAfterViewChecked() {
    if (this.accountService.collection === 'news' && !this.adapterUploaded && this.editorComponent.editorInstance) {
      console.log(this.editorComponent.editorInstance);
      this.editorComponent.editorInstance.plugins.get('FileRepository').createUploadAdapter = loader => {
        // Configure the URL to the upload script in your back-end here!
        return new UploadAdapterService(loader, this.storage, this.accountService);
      };
      this.adapterUploaded = true;
    }
  }
}
