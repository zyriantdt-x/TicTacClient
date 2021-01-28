import { Component, ElementRef, HostListener, Input, NgZone, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/_services';

import * as PIXI from "pixi.js";

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit, OnDestroy {
  static that: any;
  app!: PIXI.Application;

  assetsLoader!: PIXI.Loader;
  container!: PIXI.Container;
  startGameButtons!: any;

  buttonTextures!: any;
  buttons: any;

  assetsLoaded: boolean = false;

  @Input()
  public devicePixelRatio = window.devicePixelRatio || 1;

  constructor(private gameService: GameService, private elementRef: ElementRef, private ngZone: NgZone) { 
    this.gameService.GameEvents.subscribe(messageObject => {
      if(messageObject == null) return;

      const EVENT = messageObject.Event;
      const BODY = messageObject.Body;

      switch(EVENT) {
        case "UPDATE_BOARD": {
          if(BODY.board_data) break;
          let x = BODY.x;
          let y = BODY.y;
          let type = BODY.new_type;
          let texture = BODY.new_type == 1 ? "O": "X";

          let btn: PIXI.Sprite[] = this.buttons.filter((j: PIXI.Sprite) => (j as any).gameX == x && (j as any).gameY == y);
          
          btn[0].texture = this.buttonTextures[texture]
          break;
        }

        case "ESTABLISH_NEW_GAME": {
          this.ngZone.runOutsideAngular(() => {
            this.resetApp();
          })
        }
      }
    })
  }

  resetApp(): void {
    if(this.app) { this.app.destroy(); }
    if(this.container) this.container.destroy();

    this.app = new PIXI.Application({ width: 640, height:690, backgroundColor: 0xFFFFFF });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    this.startGameButtons = [];
    this.buttons = [];

    BoxComponent.that = this;

    if(!this.assetsLoaded) {
      this.app.loader
      .add('spritesheet', 'assets/sprites.json')
      .load(this.onAssetsLoaded.bind(this));
    } else {
      this.onAssetsLoaded();
    }
  }

  onAssetsLoaded(): void {
    // titlebar:
    let titleBarX = PIXI.Texture.from("TitleBar.png");
    let titleBar = PIXI.Sprite.from(titleBarX);
    titleBar.position.x = 59;
    titleBar.position.y = 30;
    this.container.addChild(titleBar);

    // init button textures:
    this.buttonTextures = {
      blank: PIXI.Texture.from("BlankPiece.png"),
      X: PIXI.Texture.from("XPiece.png"),
      O: PIXI.Texture.from("OPiece.png")
    }

    let x = 0;
    let y = 0;
    // init game board:
    for(let i = 0; i < 9; i++) {
      let hIndex = i % 3;
      let vIndex = Math.floor(i/3);
      let button = new PIXI.Sprite(this.buttonTextures.blank);

      button.interactive = true;
      button.buttonMode = true;
      button.position.x  = (hIndex * (144 + 45)) + 59;
      button.position.y  = (vIndex * (144 + 45)) + 140;

      (button as any).gameX = x;
      (button as any).gameY = y;

      button.on("mousedown", this.onMoveClicked.bind(this));

      if(x < 2) {
        x++;
      } else {
        x = 0;
        y += 1;
      }

      this.container.addChild(button);
      this.buttons.push(button);
    }
    
    const childElements = this.elementRef.nativeElement.children;
    for (let child of childElements) {
      this.elementRef.nativeElement.removeChild(child);
    }
    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  onMoveClicked(event: any) {
    if(!this.gameService.isInGame) return;
    let x = event.target.gameX;
    let y = event.target.gameY
    this.gameService.UpdateBoard(x, y);
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.app.destroy();
  }
}
