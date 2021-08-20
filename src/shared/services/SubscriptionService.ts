import {Injectable} from "@angular/core";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  public unsubscribeParam(subscriptions: Subscription[]) {
    for(let i = 0; i < subscriptions.length; i++) {
      subscriptions[i].unsubscribe();
    }
  }
}
