import { Component, ElementRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TicTacToeClient';

  gameError: string | undefined;
  gameId!: string | null;

  form: FormGroup
  chatBoxForm: FormGroup

  constructor(public gameService: GameService, private forms: FormBuilder) {
    gameService.GameId.subscribe(result => this.gameId = result);
    
    this.form = forms.group({
      gameId: ['', Validators.required]
    })

    this.chatBoxForm = forms.group({
      input: ['', Validators.required]
    })

    gameService.GameEvents.subscribe(messageObject => {
      if(messageObject == null) return;

      const EVENT = messageObject.Event;
      const BODY = messageObject.Body;

      switch(EVENT) {
        case "ERROR": {
          this.gameError = BODY.message
          break;
        }
      }
    })
  }

  newGame() {
    this.gameService.NewGame();
  }

  joinGame() {
    this.gameService.JoinGame(this.form.value.gameId);
  }
}
