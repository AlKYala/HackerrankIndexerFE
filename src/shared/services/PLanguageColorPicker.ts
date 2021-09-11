import {Inject, Injectable} from "@angular/core";
import {HashMap} from "../other/HashMap";

/* OBSOLETE
@Injectable({
  providedIn: 'root',
})
export class PLanguageColorPickerService {
  private colorHash: HashMap;

  constructor() {
    this.colorHash = {};
  }

  public getColorForLanguage(id: number): string {
    if(this.colorHash[id] == undefined) {
      this.generateRandomColor(id);
    }
    return this.colorHash[id];
  }

  private generateRandomColor(id: number) {
    const color = Math.round(Math.random() * 16777215);
    this.colorHash[id] = color.toString(16);
  }
}*/
