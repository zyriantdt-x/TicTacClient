import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/_services';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameId!: string | null

  constructor(public gameService: GameService, private router: Router) {
    gameService.GameId.subscribe(result => this.gameId = result);
    if(!gameService.isInGame) router.navigate([ '/' ]);
  }

  ngOnInit(): void {

  }

}
