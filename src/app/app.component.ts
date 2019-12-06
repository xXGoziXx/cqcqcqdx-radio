import { Component, HostBinding, Host } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cqcqcqdx-radio';
  @HostBinding('class.app-root') appRoot: Host = true;

}
