import { Injectable } from '@angular/core';
declare let gtag: (
  type: string,
  typeName: string,
  typeValues: { eventCategory: string; eventLabel: string; eventAction: string; eventValue: number }
) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor() {}
  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ) {
    gtag('event', eventName, {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }
}
