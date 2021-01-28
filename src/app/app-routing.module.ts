import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './_components/game/game.component';
import { JoinGameComponent } from './_components/join-game/join-game.component';

const routes: Routes = [
  { path: "game", component: GameComponent },
  { path: "join/:id", component: JoinGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
