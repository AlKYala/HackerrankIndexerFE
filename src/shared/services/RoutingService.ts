import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class RoutingService {


  constructor(private router: Router) {
  }

  public route(path: string, event?: Event) {
    if(event != undefined) {
      event.preventDefault();
    }
    this.router.navigate([path]);
  }
}
