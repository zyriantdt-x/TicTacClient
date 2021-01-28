import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

export interface MessageObject {
  Event: string,
  Body: any
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private server: WebSocketSubject<any>;
  public IncomingMessages: BehaviorSubject<any>;

  constructor() {
    this.server = new WebSocketSubject<any>(environment.WS_URL);
    this.server.subscribe(
      (data) => this.handleIncoming(data),
      (err) => console.error(err),
      () => console.log("Disconnected from server!")
    );

    this.IncomingMessages = new BehaviorSubject(null);
  }

  public SendData(event: string, body: any = {}) {
    this.server.next({
      "Event": event,
      "Body": body
    })
  }

  public SendRawData(data: string) {
    this.server.next(JSON.parse(data));
  }

  private handleIncoming(data: string) {
    console.log(data);
    this.IncomingMessages.next(data);
  }
}
