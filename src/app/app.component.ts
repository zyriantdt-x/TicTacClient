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
  nicknameForm: FormGroup

  @ViewChild("chatBox")
  chatbox!: ElementRef

  constructor(public gameService: GameService, private forms: FormBuilder) {
    gameService.GameId.subscribe(result => this.gameId = result);
    
    this.form = forms.group({
      gameId: ['', Validators.required]
    })

    this.chatBoxForm = forms.group({
      input: ['', Validators.required]
    })

    this.nicknameForm = forms.group({
      nickname: [gameService.nickname, Validators.required]
    })

    gameService.GameEvents.subscribe(messageObject => {
      if(messageObject == null) return;

      const EVENT = messageObject.Event;
      const BODY = messageObject.Body;

      switch(EVENT) {
        case "ESTABLISH_NEW_GAME": {
          this.gameError = undefined;
          break;
        }
        case "ERROR": {
          //this.gameError = BODY.message
          if(this.gameId)
            this.chatbox.nativeElement.innerHTML = this.chatbox.nativeElement.innerHTML + "\n[ERROR] - " + BODY.message;
          else
            this.gameError = BODY.message
          break;
        }
        case "RECEIVE_MESSAGE": {
          this.chatbox.nativeElement.innerHTML = this.chatbox.nativeElement.innerHTML + "\n(" + BODY.time + ") [" + BODY.nickname + "] - " + BODY.message;
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

  chatBoxSubmit() {
    this.gameService.SendMessage(this.chatBoxForm.value.input);
    this.chatBoxForm.reset();
  }

  nicknameFormSubmit() {
    //console.log(this.nicknameForm.value.nickname);
    this.gameService.UpdateNickname(this.nicknameForm.value.nickname);
  }
}
