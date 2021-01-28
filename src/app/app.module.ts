import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameComponent } from './_components/game/game.component';
import { BoxComponent } from './_components/box/box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JoinGameComponent } from './_components/join-game/join-game.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoxComponent,
    JoinGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
