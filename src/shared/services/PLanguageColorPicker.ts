import {Inject, Injectable} from "@angular/core";
import {HashMap} from "../other/HashMap";

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
      const color = Math.random() * 16777215;
      this.colorHash[id] = color.toString(16);
    }
    return this.colorHash[id];
  }

  private generateRandomColor() {

  }
}
