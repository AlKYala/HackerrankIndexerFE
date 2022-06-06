import {Component, OnChanges, OnInit} from '@angular/core';
import {UserDataFlat} from "../../shared/datamodels/User/model/UserDataFlat";
import {UserDataFlatService} from "../../shared/datamodels/User/service/UserDataFlatService";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-user-data-selector',
  templateUrl: './user-data-selector.component.html',
  styleUrls: ['./user-data-selector.component.css']
})
export class UserDataSelectorComponent implements OnChanges, OnInit {

  userDataList: UserDataFlat[] = [];

  userData0Exists: boolean = false;
  userData1Exists: boolean = false;
  userData2Exists: boolean = false;

  constructor(private userDataFlatService: UserDataFlatService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.initData();
  }

  ngOnChanges() {
    this.initData()
  }

  private initData(): void {
    this.loadData();
    this.toggleDataSlots(this.userDataList);
  }

  private async loadData() {
    const userDataList = this.localStorageService.retrieve("userDataFlatList");
    if(userDataList != null && userDataList.length > 0) {
      this.userDataList = userDataList;
      return;
    }
    await this.userDataFlatService.getUserDataFlatArr().then((userDataArr: UserDataFlat[]) => {
      this.userDataList = userDataArr;
      this.localStorageService.store("userDataFlatList", userDataArr);
    });
  }

  private toggleDataSlots(flatData: UserDataFlat[]): void {
    const len = flatData.length;
    this.userData0Exists = (len > 0) ? true : false;
    this.userData1Exists = (len > 1) ? true : false;
    this.userData2Exists = (len > 2) ? true : false;
  }

  public async removeData(index: number) {
    await this.userDataFlatService.removeEntry(index).then(() => {
      this.localStorageService.clear("userDataFlatList");
    })
    await this.loadData().then();
  }
}
