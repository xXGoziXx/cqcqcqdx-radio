import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-all-orders',
  templateUrl: './view-all-orders.component.html',
  styleUrls: ['./view-all-orders.component.scss']
})
export class ViewAllOrdersComponent implements OnInit {
  constructor(public accountService: AccountService, public authService: AuthService) {}

  ngOnInit(): void {}
}
