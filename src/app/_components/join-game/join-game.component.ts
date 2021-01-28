import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/_services';

@Component({
  selector: 'app-join-game',
})
export class JoinGameComponent implements OnInit {

  constructor(private gameService: GameService, private activatedRoute: ActivatedRoute, private router: Router) { 
    this.activatedRoute.paramMap.subscribe(map => {
      let gameId = map.get("id");
      if(!gameId) router.navigate(["/"]);
      gameService.JoinGame(gameId || "");
    })
  }

  ngOnInit(): void {
  }

}
