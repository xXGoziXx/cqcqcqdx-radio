import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-all-orders',
  templateUrl: './view-all-orders.component.html',
  styleUrls: ['./view-all-orders.component.scss']
})
export class ViewAllOrdersComponent implements OnInit {
  defaultImage = '../../assets/img/Spinner.svg';

  constructor(public accountService: AccountService, public authService: AuthService) {}
  toString(array) {
    console.log(array);
    return array.toString();
  }
  ngOnInit(): void {}
}
