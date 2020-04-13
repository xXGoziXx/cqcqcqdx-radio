import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-all-members',
  templateUrl: './view-all-members.component.html',
  styleUrls: ['./view-all-members.component.scss']
})
export class ViewAllMembersComponent implements OnInit {
  dateIfRecorded = record => {
    return record ? this.datePipe.transform(record.toMillis(), 'dd/MM/yyyy h:mm:ss a') : 'not yet recorded';
  };
  constructor(public accountService: AccountService, public authService: AuthService, private datePipe: DatePipe) {}

  ngOnInit(): void {}
}
