
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator


    

};

BasicGame.Game.prototype = {


	create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TOTAL_LEVEL = 3;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 7000;
		this.TEMPO_INTRO2 = 13500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 5000;
        this.TEMPO_RESUMO = 26500;
        this.SOUND_VITORIA = 5500;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 60;
        this.UNDERLINE_SPACING = 20;
        /**************************** CONSTANTES JOGO ATUAL ************************************************/

        /* FUTURO XML */
        this.corrects = 0;
        this.errors = 0;
        this.currentLevel = BasicGame.InitialLevel;
        this.listCorrects = [-1,-1,-1];
        this.listCompleted = [false,false,false];
        /* FUTURO XML */
        this.conclusaoEnviada = false;

        this.lives = 2;
		this.errorThreshold = 0;
		;this.points = 0;
        this.showCallToAction = false;

		this.selectedLetter;

		this.background;
		this.soundWord;
		this.groupWords = [];
		this.letterGroup;
		this.checkClick = false;
		this.clickPermission = true;
		
		this.randomLetter;
		this.tutorialText;
		this.buttonWord = [];
		this.displayButton = false;
		this.actualButton = 0;
		
		this.levelAudio;

        this.createScene();

        this.showIntro();

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);
		//this.music.loop = true;

	},



    /*********************************************************************************************************************/
    /* HUD  E BOTOES - INICIO */


    clickRestart:function() {
        this.tweens.removeAll();
        this.sound.stopAll();
        this.time.events.removeAll();
        this.state.start('Game');
    },

    createBottomHud: function() {
        this.groupBottom = this.add.group();

        var bg = this.groupBottom.create(0, this.game.height, "hud", "hudBottom");
        bg.anchor.set(0,1);

        this.soundButton = this.add.button(80,this.world.height-60, "hud", this.switchSound, this, 'soundOn','soundOn','soundOn','soundOn', this.groupBottom);

        var sTool = this.add.sprite(3,-35, "hud", "soundText");
        sTool.alpha = 0;
        this.soundButton.addChild(sTool);
        this.soundButton.input.useHandCursor = true;

        this.soundButton.events.onInputOver.add(this.onOverItem, this);
        this.soundButton.events.onInputOut.add(this.onOutItem, this);

        var back = this.add.button(10,this.world.height-110, "hud", this.backButton, this, 'backButton','backButton','backButton', 'backButton', this.groupBottom);
        back.input.useHandCursor = true;

        var sTool = this.add.sprite(8,-40, "hud", "backText");
        sTool.alpha = 0;
        back.addChild(sTool);

        back.events.onInputOver.add(this.onOverItem, this);
        back.events.onInputOut.add(this.onOutItem, this);
    },
    onOverItem: function(elem) {
        elem.getChildAt(0).alpha = 1;
    },
    onOutItem: function(elem) {
        elem.getChildAt(0).alpha = 0;
    },

    backButton: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(function() {

            this.time.events.removeAll();
            this.tweens.removeAll();
            this.tweenBack();
            
        }, this);

        this.registrarConclusao(true);
    },
    
    tweenBack: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + "MAPA/index.html";
        }, this);
    },

    switchSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        var _frame = (this.game.sound.mute)? "soundOff" : "soundOn";
        this.soundButton.setFrames(_frame,_frame,_frame, _frame);
    },

    createHud: function() {

        this.add.sprite(0,0, "hud");

        this.livesTextShadow = this.add.bitmapText(111,36, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.livesText = this.add.bitmapText(110,35, "JandaManateeSolid", this.lives.toString(), 18);

        this.pointsTextShadow = this.add.bitmapText(51,102, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.pointsText = this.add.bitmapText(50,101, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);

        var _cVal = 0;// this.rnd.integerInRange(100,999);
        var coin = this.add.bitmapText(31,191, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        this.add.bitmapText(30,190, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
    },

    /* -FINAL-    HUD E BOTOES */
    /*********************************************************************************************************************/


    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES AUXILIARES GAMEPLAY */

    openLevel: function() {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }
        if(this.listCorrects[this.currentLevel-1] < 0) {
            this.listCorrects[this.currentLevel-1] = 0;
        }
    },

    saveCorrect: function(porc, completed) {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }

        var _completed = (completed==undefined || completed)?true:false;
        var _porc = porc || 100;

        if(_porc > this.listCorrects[this.currentLevel-1]) {
            this.listCorrects[this.currentLevel-1] = _porc;
        }

        if(!this.listCompleted[this.currentLevel-1]) {
            this.listCompleted[this.currentLevel-1] = _completed;
        }

        console.log("saveCorrect", this.listCorrects, this.listCompleted );
    },

    //fixa
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
    }, 

    // 
	onGameButtonClick: function(elem) {
    	if(this.clickPermission){
			this.selectedLetter = elem;
			console.log("click!");
			this.checkClick = true;
		}
	},

	drawFront: function(bool){
		if(bool){
			this.groupFront.add(this.selectedLetter);	
		} else {
			this.groupLevel.add(this.selectedLetter);
			this.selectedLetter.inputEnabled = true;
		}
	},
	
    createDelayTime: function(time, callback) {
        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */
	
	// Intro * INICIO *
	showIntro: function() {
        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);
	
        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },
	
	 showTextoIntro: function() {

        this.tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },
	
	showKim: function() {
        var kim = this.add.sprite(this.world.centerX-320, 0, 'kim');

        var fIntro = Phaser.Animation.generateFrameNames("kim_", 0, 14, "", 3);
        var fLoop = Phaser.Animation.generateFrameNames("kim_", 15, 84, "", 3);

        kim.animations.add('intro', fIntro, 18, false);
        kim.animations.add('loop', fLoop, 18, true);

        kim.animations.play('intro').onComplete.add(function() {
            kim.animations.play('loop');
        }, this);

        this.groupIntro.add(kim);

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },
	
    skipIntro: function() {
        this.time.events.removeAll();
        this.tweens.removeAll();

        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }

        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
	
	// Intro * FINAL *
	// Resumo * INICIO *
	showResumo: function() {

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
		this.add.tween(this.groupLevel).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ this.groupLevel.removeAll(); }, this);
		this.add.tween(this.groupFront).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ this.groupFront.removeAll(); }, this);
    },
	
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },


   
    updateLivesText: function() {
        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },
	
	// Contadores - Vida e Pontos - * FINAL *
	// Gameover * INICIO *
    gameOverMacaco: function() {
		
        BasicGame.OfflineAPI.setCookieVictory();

        this.sound.play("soundFinal");

        var bg = this.add.sprite(this.world.centerX, this.world.centerY, "backgroundWin");
        bg.anchor.set(0.5,0.5);
        bg.alpha = 0;

        var _animals = ["bumbaWin", "fredWin", "polyWin", "juniorWin"];


        var n = this.rnd.integerInRange(0, _animals.length-1);

        var pos = [510,550,520,525];

        var _name = _animals[n];


        var animal = this.createAnimation( this.world.centerX,pos[n], _name, 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,1);
        animal.alpha = 0;
		
		this.createDelayTime(1500,function(){
			if(this.groupFront != null){this.groupFront.removeAll();}
			if(this.groupLevel != null){this.groupLevel.removeAll();}
			this.add.tween(bg).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA);
			this.add.tween(animal).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA+500).onComplete.add(function() {
				animal.animations.play('idle');
	
				this.showTextVictory();
	
				this.eventConclusao = new Phaser.Signal();
                this.eventConclusao.addOnce(this.showEndButtons, this);

                this.registrarConclusao();
	
			}, this);
		});
    },

    registrarConclusao: function(forcedOnError) {
        if(this.conclusaoEnviada) {
            return;
        }
        this.conclusaoEnviada = true;

        var _this = this;

        var _hasError = true;
        for(var i = 0; i < this.listCorrects.length; i++) {
            if(this.listCorrects[i] > 0) {
                _hasError = false;
            }
        }
        if(_hasError) {
            this.eventConclusao.dispatch();
            return;
        }

        if(BasicGame.isOnline) {
            BasicGame.OnlineAPI.registrarConclusao(this.listCorrects, this.listCompleted, function(data) {            
                if(_this.eventConclusao) {
                    _this.eventConclusao.dispatch(data);
                }
            }, function(error) {
                console.log(error)
            });
        } else {
            
            _this.eventConclusao.dispatch();
        }
    },

    showTextVictory: function() {

        var pos = [
            [513,368],
            [505,420],
            [530,407],
            [500,360],
            [525,405]
        ];
        var _angle = [1,1,0,1,1];

        var _curr = this.rnd.integerInRange(0,4);

        if(_curr == 1) {
            _curr = 2;
        }

        this.sound.play("soundVitoria" + (_curr+1));

        
        var animal = this.createAnimation( pos[_curr][0], pos[_curr][1], "textoVitoria" + (_curr+1), 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,0.5);
        animal.animations.play('idle', 18, false);
        
    },

    createEndButton: function(x,y,scale) {
        var b = this.add.sprite(x, y, "hudVitoria", "botaoVitoria");
        b.anchor.set(0.5,0.5);
        b.scale.set(0.2,0.2);
        b.scaleBase = scale;
        b.alpha = 0;
        b.inputEnabled = true;
        b.input.useHandCursor = true;
        b.events.onInputOver.add(this.onOverEndButton, this);
        b.events.onInputOut.add(this.onOutEndButton, this);

        return b;
    },

    showEndButtons: function(resposta) {

        var _moedas = (resposta != null) ? resposta.moedas : 0;
        var _xp = (resposta != null) ? resposta.xp : 0;

        /************************ b1 ******************************/
        var b1 = this.createEndButton(70,540,1);

        var i1 = this.add.sprite(0,-10,"hudVitoria", "vitoriaSetaCima");
        i1.anchor.set(0.5,0.5);
        i1.alpha = 0;
        b1.addChild(i1);
        this.add.tween(i1).to({alpha: 1, y: -40}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);

        var t1 = this.add.bitmapText(0,0, "JandaManateeSolid", _moedas.toString(), 40);
        t1.x = -t1.width*0.5;
        t1.y = -t1.height*0.5;
        b1.addChild(t1);

        var tt1 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn1");
        tt1.anchor.set(0.3,1);
        tt1.alpha = 0;
        b1.tooltip = tt1;
        b1.addChild(tt1);

        /************************ b2 ******************************/
        var b2 = this.createEndButton(180, 540, 1);

        var i2 = this.add.sprite(0,-20,"hudVitoria", "vitoriaGemasIcone");
        i2.anchor.set(0.5,0.5);
        b2.addChild(i2);

        var t2 = this.add.bitmapText(0,0, "JandaManateeSolid", _xp.toString(), 40);
        t2.x = -t2.width*0.5;
        t2.y = -t2.height*0.5;
        b2.addChild(t2);

        var tt2 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn2");
        tt2.anchor.set(0.5,1);
        tt2.alpha = 0;
        b2.tooltip = tt2;
        b2.addChild(tt2);

        /************************ b4 ******************************/
        var b4 = this.createEndButton(940, 550, 0.65);
        b4.events.onInputUp.add(this.clickRestart, this);

        var i4 = this.add.sprite(0,0,"hudVitoria", "vitoriaRepetir");
        i4.anchor.set(0.5,0.5);
        b4.addChild(i4);

        var tt4 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn4");
        tt4.anchor.set(0.6,1);
        b4.addChild(tt4);
        tt4.alpha = 0;
        b4.tooltip = tt4;
        tt4.scale.set(1.4);



        this.add.tween(b1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(b1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 500);


        this.add.tween(b2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 700);
        this.add.tween(b2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 700);

        this.add.tween(b4).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(b4.scale).to({x:0.65,y:0.65}, 500, Phaser.Easing.Linear.None, true, 1100);



        this.createDelayTime(5000, this.tweenBack);
    },

    onOverEndButton: function(elem) {
        var sc = elem.scaleBase * 1.1;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true);
    },
    onOutEndButton: function(elem) {
        var sc = elem.scaleBase;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 0}, 150, Phaser.Easing.Linear.None, true);
    },
	
	 gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },
	// Gameover * FINAL *
	
    // GAMESTART
    initGame: function() {
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
	
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
		
		this.groupbuttonWord = this.add.group();
		
		this.createDelayTime(500, function(){
			this.showNextLevel();
		});
    },
	
	// Auxiliares de level - passar, voltar, etc.

	gotoNextLevel: function() {

        this.currentLevel++;
		this.actualButton = 0;
        this.hideAndShowLevel(false);
    },
	
	hideAndShowLevel: function(isWrong) {

		if(this.corrects < this.TOTAL_LEVEL) {
			if(isWrong) {
				
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.groupLevel.removeAll()}, this);
				this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.groupFront.removeAll()}, this);
				this.createDelayTime( 6800, function(){
					this.showNextLevel();
				});

			} else {
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
				this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
			}

		} else {
			this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
			this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
			this.gameOverMacaco();
		}
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },
	
	bubblesMovement:function(obj) {
		this.randomAnim = this.rnd.integerInRange(1200,2000);
		this.add.tween(obj).to({y: obj.animUp}, this.randomAnim, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.bubblesMovementDown(obj)},this);
	},
	
	bubblesMovementDown:function(obj) {
			this.randomAnim = this.rnd.integerInRange(1200,2000);
			this.add.tween(obj).to({y: obj.animDown}, this.randomAnim, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.bubblesMovement(obj)},this);
	},

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.background = this.add.sprite( -360, -140, 'background');
        this.background.height = 800;
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		
		this.tutorialText = this.add.sprite( this.world.centerX, 110, 'initialText2');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
		
        this.buttons = [];
		
		this.buttons.push(this.createButton( 500, this.world.centerY + 50, "words", 100, false, 16));
		this.buttons.push(this.createButton( 400, this.world.centerY + 200, "B_letter", 100, true, null));
		this.buttons.push(this.createButton( 600, this.world.centerY + 200, "P_letter", 100, true, null));	
		this.buttons[1].alpha = 0;
		this.buttons[2].alpha = 0;
		
		this.groupIntro.add(this.buttons[0]);
		this.groupIntro.add(this.buttons[1]);
		this.groupIntro.add(this.buttons[2]);
        
		this.createDelayTime( 3800, function() {
            this.showFinishedLiveTutorial();
        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		
		this.createDelayTime( 4000, function(){
			this.add.tween(this.buttons[1]).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
		},this);
		
		this.createDelayTime( 6000, function(){
			this.add.tween(this.buttons[2]).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
		},this);
		
		this.createDelayTime( 9500, function(){
			this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
			this.arrow.anchor.set(0.5,0.5);
			this.groupIntro.add(this.arrow);
			this.add.tween(this.arrow).to({x: this.buttons[2].x, y: this.buttons[2].y}, 1200, Phaser.Easing.Linear.None, true);
		},this);

        //this.buttons[0].alpha = 0.7;
		
        // remover click
		
		this.createDelayTime( 12000, function(){
			
			var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
			click.animations.add('idle', null, 18, true);
			click.animations.play('idle');
			this.groupIntro.add(click);
			
			this.createDelayTime( 2400, function() {
				click.alpha = 0;
				click.destroy();
			});
		});
		
        this.createDelayTime( 17000, function() {

            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
		this.sound.stopAll();
        this.tutorialText = this.add.sprite( this.world.centerX, 90, 'textResumo');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(this.tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

    },
	
	livesCondition: function(){
		this.lives--;
		switch(this.lives) {
            case 1: // mostra dica 1
				if(this.currentLevel >= 2){ 
					this.currentLevel--;
					console.log("level atual: "+this.currentLevel);
				}
				this.sound.play('hitErro');
				this.updateLivesText();
                this.sound.play("soundDica");
				this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
				this.sound.play('hitErro');
				this.updateLivesText();
                this.showResumo();
            break;
            default: // game over
            break;
        }
	},

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
		// Cria os botoes principais
        this.initLevel();
     
    },


    initLevel: function() {
		console.log("current level: "+this.currentLevel);
		this.createDelayTime( 1000, function(){
			this.groupLevel = this.add.group();
			
			for( var i = 0; i <= 5; i++){
				this.groupWords[i] = i;	
				console.log("Group refeito["+i+"]: "+this.groupWords[i]);
			}
			
			this.randomVerse = this.rnd.integerInRange(0,5);
			if(this.randomVerse <= 2){
				this.letterGroup = "B";	
			} else {
				this.letterGroup = "P";		
			}
			console.log(" O número retirado foi: "+this.randomVerse);
			
			this.buttonWord = [];
			
			if(this.currentLevel == 2){ 
				this.buttonWord.push(this.createButton( 500, this.world.centerY, "words", 100, false, this.groupWords[this.randomVerse] + 6));	
				console.log(" O número real: "+(this.randomVerse + 6));	
			} else if (this.currentLevel == 3){
				this.buttonWord.push(this.createButton( 500, this.world.centerY, "words", 100, false, this.groupWords[this.randomVerse] + 12));
				console.log(" O número real: "+(this.randomVerse + 12));
			} else {
				this.buttonWord.push(this.createButton( 500, this.world.centerY, "words", 100, false, this.groupWords[this.randomVerse]));
				console.log(" O número real: "+this.randomVerse);
			}
			
			this.buttonWord[0].valueName = this.randomVerse;
			this.buttonWord[0].group = this.letterGroup;
			this.buttonWord[0].alpha = 0;
			this.buttonWord[0].name = "P"+this.currentLevel+"_"+this.letterGroup+"_"+this.randomVerse;
			
			if( this.letterGroup == "P" ){
				this.randomVerse = this.rnd.integerInRange(0, 2);
				this.letterGroup = "B";	
			} else {
				this.randomVerse = this.rnd.integerInRange(3, 5);
				this.letterGroup = "P";		
			}
			console.log(" O número retirado foi: "+this.randomVerse);
			
			if(this.currentLevel == 2){ 
				this.buttonWord.push(this.createButton( 500, this.world.centerY, "words", 100, false, this.groupWords[this.randomVerse] + 6));
				console.log(" O número real: "+(this.randomVerse + 6));
			} else if (this.currentLevel == 3){
				this.buttonWord.push(this.createButton( 500, this.world.centerY, "words", 100, false, this.groupWords[this.randomVerse] + 12));
				console.log(" O número real: "+(this.randomVerse + 12));
			} else {
				this.buttonWord.push(this.createButton( 500, this.world.centerY, "words", 100, false, this.groupWords[this.randomVerse]));
				console.log(" O número real: "+this.randomVerse);
			}
			
			this.buttonWord[1].group = this.letterGroup;
			this.buttonWord[1].valueName = this.randomVerse;
			this.buttonWord[1].alpha = 0;
			this.buttonWord[1].name = "P"+this.currentLevel+"_"+this.letterGroup+"_"+this.randomVerse;
			
			this.buttonLetters = [];
			this.buttonLetters.push(this.createButton( 400, this.world.centerY + 200, "B_letter", 100, true, null));
			this.buttonLetters.push(this.createButton( 600, this.world.centerY + 200, "P_letter", 100, true, null));
			this.buttonLetters[0].group = 'B';
			this.buttonLetters[0].alpha = 1;
			this.buttonLetters[0].origX = 400;
			this.buttonLetters[0].origY = this.world.centerY + 200;
			this.buttonLetters[1].group = 'P';
			this.buttonLetters[1].alpha = 1;
			this.buttonLetters[1].origX = 600;
			this.buttonLetters[1].origY = this.world.centerY + 200;
			
			this.groupLevel.add(this.buttonLetters[0]);
			this.groupLevel.add(this.buttonLetters[1]);
			this.groupLevel.add(this.buttonWord[0]);
			this.groupLevel.add(this.buttonWord[1]);
			
			this.groupFront = this.add.group();
			
			this.actualButton = 0;
			this.displayButton = true;
			
			this.createDelayTime( 1000, function(){
				this.clickPermission = true;
			},this);
		});
    },
	//criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, time, canInteract, frame) {
		
        var btn;
		
		btn = this.add.button(x,y, imagem, null, this)
		
		if(frame != null || frame != undefined){
			btn.frame = frame;
		}
	
        btn.anchor.set(0.5,1);
        btn.alpha = 1;
        btn.scale.set(1.0,1.0);
		
        if(canInteract) {
			btn.onInputDown.add(this.onGameButtonClick, this);
			btn.input.useHandCursor = true;
			btn.name = ""+imagem;
		}
       // this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time);

        return btn;
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {		
		
		if(this.clickPermission != null) console.log("click permission status: "+this.clickPermission);
		
		if(this.displayButton){
			if(this.actualButton == 0){
					this.add.tween(this.buttonWord[0]).to({alpha: 1}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.soundWord = this.sound.play(this.buttonWord[0].name);
						this.clickPermission = true;
					},this);
					this.add.tween(this.buttonWord[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
				
			}else if(this.actualButton == 1){
				this.add.tween(this.buttonWord[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
					this.add.tween(this.buttonWord[1]).to({alpha: 1}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.soundWord = this.sound.play(this.buttonWord[1].name);
						this.clickPermission = true;
					},this);
				},this);
			}else{
				this.add.tween(this.buttonWord[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonWord[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
					this.corrects++;
                    this.saveCorrect();
					this.gotoNextLevel();
				},this);
			}
			this.displayButton = false;
		}
		
		if(this.buttonWord[0] != null && this.buttonWord[1]!=null && this.selectedLetter!=null && this.checkClick){
			console.log("actualButton: "+this.actualButton);
			if(this.actualButton == 0){
				console.log("entrou1");
				if(this.buttonWord[0].group == this.selectedLetter.group){
					this.clickPermission = false;
					console.log('Acerto');
					this.sound.play('hitAcerto');
					this.selectedLetter = null;
					this.displayButton = true;
					this.actualButton += 1;
				} else {
					this.clickPermission = false;
					this.sound.play('hitErro');
					this.livesCondition();
				}
			} else {
				console.log("entrou2");
				if(this.buttonWord[1].group == this.selectedLetter.group){
					this.clickPermission = false;
					console.log('Acerto');
					this.sound.play('hitAcerto');
					this.selectedLetter = null;
					this.actualButton += 1;
					this.displayButton = true;
				} else {
					this.clickPermission = false;
					this.sound.play('hitErro');
					this.livesCondition();
				}
			}
			this.checkClick = false;
		}
	}
};
