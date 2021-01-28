import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public GameEvents: BehaviorSubject<any>;
  public GameId: BehaviorSubject<any | null>;
  public isInGame: boolean = false;
  public playerWon: string | undefined;

  constructor(private wsService: WebSocketService, private router: Router) {
    this.GameEvents = new BehaviorSubject(null);
    this.GameId = new BehaviorSubject(null);
    wsService.IncomingMessages.subscribe(messageObject => {
      if(messageObject == null) return;

      const EVENT = messageObject.Event;
      const BODY = messageObject.Body;

      this.GameEvents.next(messageObject);

      switch(EVENT) {
        case "ESTABLISH_NEW_GAME": {
          this.GameId.next(BODY.uuid);
          this.isInGame = true;
          this.router.navigate([ "/game" ]);
          break;
        }
        case "ERROR": {
          console.error(BODY.message);
          break;
        }
        case "PLAYER_WON": {
          this.isInGame = false;
          this.playerWon = BODY.player;
          this.GameId.next(null);
          //router.navigate(['/']);
          break;
        }
      }
    })
  }

  NewGame() {
    this.wsService.SendData("NEW_GAME");
  }

  JoinGame(gameId: string) {
    this.wsService.SendData("JOIN_GAME", { uuid: gameId });
  }

  UpdateBoard(x: number, y: number) {
    if(!this.isInGame) return;
    this.wsService.SendData("MODIFY_BOX", { "x": x, "y": y})
  }
}
