
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
        this.TEMPO_INTRO = 5800;
		this.TEMPO_INTRO2 = 13500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 5000;
        this.TEMPO_RESUMO = 22500;
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
        this.points = 0;
        this.showCallToAction = false;

		this.dragElem;
		this.dragOn = false;

        this.nameShadows = [];
        this.nameTexts = [];
		this.background;
		this.soundLetter;
		this.soundWord;
		this.letters = [];
		this.words = [];
		this.wordsCount = 0;
		this.clearResult = false;
		this.changingLevel = false;
		this.clickable = true;
		
		this.randomLetter;
		
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

    //fixa
	onButtonClick: function(elem) {
		if(this.clickable){
			this.dragElem = elem;
			this.dragOrigX = elem.x;
			this.dragOrigY = elem.Y;
			this.levelAudio.stop();
			this.dragOn = true;
			this.drawFront(true);
		}
	},
	onButtonOver: function(elem) {
		if(this.soundLetter == null && this.clickable || (!this.dragOn && !this.soundLetter.isPlaying)){
			this.soundLetter = this.sound.play(elem.name+"_sound");
		}
	},
	drawFront: function(bool){
		if(bool){
			this.groupFront.add(this.dragElem);	
		} else {
			this.groupLevel.add(this.dragElem);
			this.clickable = true;
			this.dragElem.input.enabled = true;
			this.dragElem = null;	
		}
	},
	
    createDelayTime: function(time, callback) {
        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */

    skipIntro: function() {
        this.time.events.removeAll();
        this.tweens.removeAll();

        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }

        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
	
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    // intro-fixa
    showIntro: function() {
        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    // intro-fixa
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

    // intro-fixa
    showTextoIntro: function() {

        var tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },

    
    // resumo-fixa
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

    // resumo-fixa
    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },


    // vidas-fixa
    updateLivesText: function() {
        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },

    // game over-fixa
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
		
		this.createDelayTime(2500,function(){
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

    // level-fixa
    initGame: function() {
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
	
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function(clearCorrect) {

        for(var i = 0; i < this.buttons.length; i++) {
            if(clearCorrect) {
                if(this.buttons[i].isCorrect == undefined || !this.buttons[i].isCorrect) {
                    this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                        elem.destroy();
                    });
                }
            } else {
                this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                    elem.destroy();
                });
            }
        }
    },

    // level-fixa
    gotoNextLevel: function() {

        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function(isWrong) {

        this.hideLevel(function() {

            if(this.corrects < this.TOTAL_LEVEL) {
                if(isWrong) {
					
					this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.groupLevel.removeAll()}, this);
					this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.groupFront.removeAll()}, this);
					this.createDelayTime( 4800, function(){
						this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
					});

                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
					this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
					this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
                }

            } else {
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
					this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(this.gameOverMacaco, this);
            }
        });
    },

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
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

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.background = this.add.sprite( -560, -120, 'background');
        this.background.height = 800;
    },
	
	resetWords: function(time){
		this.createDelayTime( time, function(){
			this.clearResult = false;
			if( this.letters[0] != null) this.letters[0].input.enabled = true;
			if( this.letters[1] != null) this.letters[1].input.enabled = true;
			if( this.letters[2] != null) this.letters[2].input.enabled = true;
			this.letters[0] = null;
			this.letters[1] = null;
			this.letters[2] = null;
		});
	},

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		this.add.tween(this.tutorialPlacar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500)
		
        this.buttons = [];
        this.buttons.push( this.createButton(-100, this.world.centerY+120, "CO", 100, false) );
		this.buttons.push( this.createButton(+1100, this.world.centerY+105, "GA", 100, false) );
		this.buttons.push( this.createButton(-100, this.world.centerY+90, "ES", 100, false) );
		this.buttons.push( this.createButton(-100, this.world.centerY+105, "SA", 100, false) );
		this.buttons.push( this.createButton(+1100, this.world.centerY+120, "LA", 100, false) );
		this.placeHolder = this.add.sprite(-285, this.world.centerY+150, "three_holder");
		this.placeHolder.alpha = 0;
		
		this.groupIntro.add(this.placeHolder);
		this.groupIntro.add(this.buttons[1]);
        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[2]);
		this.groupIntro.add(this.buttons[3]);
		this.groupIntro.add(this.buttons[4]);
		
		this.createDelayTime( 200, function() {
         
		 this.add.tween(this.placeHolder).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);
		 this.add.tween(this.buttons[0]).to({x: this.world.centerX-160, y: this.world.centerY+120}, 800, Phaser.Easing.Linear.None, true);
         this.add.tween(this.buttons[1]).to({x: this.world.centerX-80, y: this.world.centerY+105}, 720, Phaser.Easing.Linear.None, true);
         this.add.tween(this.buttons[2]).to({x: this.world.centerX, y: this.world.centerY+90}, 750, Phaser.Easing.Linear.None, true);
		 this.add.tween(this.buttons[3]).to({x: this.world.centerX+80, y: this.world.centerY+105}, 700, Phaser.Easing.Linear.None, true);
         this.add.tween(this.buttons[4]).to({x: this.world.centerX+160, y: this.world.centerY+120}, 800, Phaser.Easing.Linear.None, true);

        }, this);
		
		this.createDelayTime( 2200, function() {
            
			this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+150, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);
            this.add.tween(this.arrow).to({x: this.world.centerX+10, y: this.world.centerY+45}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);

        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        click.animations.play('idle');

        //this.buttons[0].alpha = 0.7;

        this.groupIntro.add(click);

        // remover click
        this.createDelayTime( 1400, function() {
            click.alpha = 0;
            click.destroy();
        });
		
		this.createDelayTime( 1800, function() {
            this.add.tween(this.buttons[2]).to({x: this.world.centerX - 142, y: this.world.centerY+215}, 750, Phaser.Easing.Linear.None, true);
			this.add.tween(this.arrow).to({x: this.world.centerX - 134, y: this.world.centerY+175}, 750, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime( 2500, function() {
           this.add.tween(this.arrow).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
        });

		this.createDelayTime( 4000, function() {
           this.add.tween(this.buttons[0]).to({x: this.world.centerX - 12, y: this.world.centerY+215}, 750, Phaser.Easing.Linear.None, true);
        });
		this.createDelayTime( 4800, function() {
           this.add.tween(this.buttons[4]).to({x: this.world.centerX + 115, y: this.world.centerY+215}, 750, Phaser.Easing.Linear.None, true);
        });
		this.createDelayTime( 7500, function() {
           this.buttons[0].frame = 1;
		   this.buttons[2].frame = 1;
		   this.buttons[4].frame = 1;
        });
        // remover tudo
        this.createDelayTime( 9500, function() {

            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(this.buttons[3]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[4]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(this.placeHolder).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 90, 'imgResumo2');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

    },
	
	wordValidate: function(soundName, wordNumber){
		if( this.currentLevel == 1 || this.currentLevel == 2 ){
			this.soundWord = this.sound.play(soundName);
			this.sound.play('hitAcerto');
			this.clickable = false;
			this.letters[0].frame = 1;
			this.letters[1].frame = 1;
			this.letters[0].input.enabled = false;
			this.letters[1].input.enabled = false;
				this.createDelayTime( 900, function(){
					this.letters[0].frame = 0;
					this.letters[1].frame = 0;
					this.add.tween(this.letters[0]).to({x: this.letters[0].OrigX, y: this.letters[0].OrigY}, 200, Phaser.Easing.Linear.None, true);
					this.add.tween(this.letters[1]).to({x: this.letters[1].OrigX, y: this.letters[1].OrigY}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.clickable = true;
					},this);
				});
				this.resetWords(1410);
			if(this.words[wordNumber]==null){
				this.wordsCount++;
				this.words[wordNumber] = 1;
			}
			this.clearResult = true;
			this.groupLevel.add(this.letters[0]);
			this.groupLevel.add(this.letters[1]);
		} else {
			this.soundWord = this.sound.play(soundName);
			this.sound.play('hitAcerto');
			this.letters[0].frame = 1;
			this.letters[1].frame = 1;
			this.letters[2].frame = 1;
			this.letters[0].input.enabled = false;
			this.letters[1].input.enabled = false;
			this.letters[2].input.enabled = false;
			this.clickable = false;
				this.createDelayTime( 900, function(){
					this.letters[0].frame = 0;
					this.letters[1].frame = 0;
					this.letters[2].frame = 0;
					this.add.tween(this.letters[0]).to({x: this.letters[0].OrigX, y: this.letters[0].OrigY}, 500, Phaser.Easing.Linear.None, true);
					this.add.tween(this.letters[1]).to({x: this.letters[1].OrigX, y: this.letters[1].OrigY}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.clickable = true;
					},this);
					this.add.tween(this.letters[2]).to({x: this.letters[2].OrigX, y: this.letters[2].OrigY}, 500, Phaser.Easing.Linear.None, true);
				});
				this.resetWords(1410);
				
			if(this.words[wordNumber]==null){
				this.wordsCount++;
				this.words[wordNumber] = 1;
			}
			this.clearResult = true;
			this.groupLevel.add(this.letters[0]);
			this.groupLevel.add(this.letters[1]);
			this.groupLevel.add(this.letters[2]);
		}
	},
	
	checkWords: function(){
		if(this.currentLevel == 1 || this.currentLevel == 2){
			if(this.game.input.activePointer.isDown && this.dragElem != null && this.dragOn){ 
				this.dragElem.x = this.input.mousePointer.x;
				this.dragElem.y = this.input.mousePointer.y + 50;	
				
			} else if( this.input.mousePointer.x >= 420 && this.input.mousePointer.x <= 500 && this.input.mousePointer.y >= 440 && this.input.mousePointer.y <= 490 && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				
				if(this.letters[0] != null){
					this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.drawFront(false);	
					},this);
					this.dragOn = false;
				} else {
					this.letters[0] = this.dragElem;
					this.clickable = false;
					this.letters[0].input.enabled = false;
					this.add.tween(this.dragElem).to({x: 445, y: 516}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.clickable = true;
						console.log("Desativado");
					},this)
					this.dragOn = false;
					this.letters[0].holder = 1;
				}
				
			} else if( this.input.mousePointer.x >= 540 && this.input.mousePointer.x <= 620 && this.input.mousePointer.y >= 440 && this.input.mousePointer.y <= 490 && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				
				if(this.letters[1] != null){
					this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.drawFront(false);	
					},this);
					this.dragOn = false;
				} else {
					this.letters[1] = this.dragElem;
					this.clickable = false;
					this.letters[1].input.enabled = false;
					this.add.tween(this.dragElem).to({x: 575, y: 516}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						console.log("Desativado");
						this.clickable = true;
					},this);
					this.dragOn = false;
					this.letters[1].holder = 2;	
				}
				
			} else if( this.dragOn && this.dragElem != null) {
				this.dragElem.input.enabled = false;
				this.clickable = false;
				this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
						this.dragElem.inputEnabled = false;
						this.drawFront(false);
					}, this);
				this.dragOn = false;
				
			}
		} else {
			if(this.game.input.activePointer.isDown && this.dragElem != null && this.dragOn){ 
				this.dragElem.x = this.input.mousePointer.x;
				this.dragElem.y = this.input.mousePointer.y + 50;	
				
			} else if( this.input.mousePointer.x >= 340 && this.input.mousePointer.x <= 420 && this.input.mousePointer.y >= 440 && this.input.mousePointer.y <= 490 && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				
				if(this.letters[0] != null){
					this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.drawFront(false);	
					},this);
					this.dragOn = false;
				} else {
					this.letters[0] = this.dragElem;
					this.clickable = false;
					this.letters[0].input.enabled = false;
					this.add.tween(this.dragElem).to({x: 387, y: 517}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						console.log("Desativado");
						this.clickable = true;
					},this)
					this.dragOn = false;
					this.letters[0].holder = 1;
				}
				
			} else if( this.input.mousePointer.x >= 480 && this.input.mousePointer.x <= 560 && this.input.mousePointer.y >= 440 && this.input.mousePointer.y <= 490 && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				
				if(this.letters[1] != null){
					this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.drawFront(false);	
					},this);
					this.dragOn = false;
				} else {
					this.letters[1] = this.dragElem;
					this.clickable = false;			
					this.letters[1].input.enabled = false;		
					this.add.tween(this.dragElem).to({x: 517, y: 517}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						console.log("Desativado");
						this.clickable = true;
					},this);
					this.dragOn = false;
					this.letters[1].holder = 2;	
				}
				
			} else if( this.input.mousePointer.x >= 600 && this.input.mousePointer.x <= 680 && this.input.mousePointer.y >= 440 && this.input.mousePointer.y <= 490 && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				
				if(this.letters[2] != null){
					this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						this.drawFront(false);	
					},this);
					this.dragOn = false;
				} else {
					this.letters[2] = this.dragElem;
					this.clickable = false;
					this.letters[2].input.enabled = false;
					this.add.tween(this.dragElem).to({x: 647, y: 517}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
						console.log("Desativado");
						this.clickable = true;
					},this);
					this.dragOn = false;
					this.letters[2].holder = 3;
				}
				
			} else if( this.dragOn && this.dragElem != null) {
				
				this.dragElem.input.enabled = false;
				this.clickable = false;
				this.add.tween(this.dragElem).to({x: this.dragElem.OrigX, y: this.dragElem.OrigY}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
						this.drawFront(false);
					}, this);
				this.dragOn = false;
				
			}
		}
	},
	
	livesCondition: function(){
		this.changingLevel = true;
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
				this.sound.stopAll();
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
            default: // game over
            break;
        }
			this.add.tween(this.letters[0]).to({x: this.letters[0].OrigX, y: this.letters[0].OrigY}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(this.letters[1]).to({x: this.letters[1].OrigX, y: this.letters[1].OrigY}, 500, Phaser.Easing.Linear.None, true);
			this.resetWords(510);
			this.clearResult = true;
			this.groupLevel.add(this.letters[0]);
			this.groupLevel.add(this.letters[1]);
			if(this.currentLevel == 3){
				this.groupLevel.add(this.letters[2]);
				this.add.tween(this.letters[2]).to({x: this.letters[2].OrigX, y: this.letters[2].OrigY}, 500, Phaser.Easing.Linear.None, true);
			}
	},

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                if(!this.showCallToAction) {
					console.log("corrects: "+this.corrects);
                  this.levelAudio = this.sound.play("soundP1");
                }
                this.initLevel1();
            break;
            case 2:
                if(!this.showCallToAction) {
					console.log("corrects: "+this.corrects);
                   this.levelAudio = this.sound.play("soundP2");
				   this.groupLevel.removeAll();
				   this.groupFront.removeAll();
                }
                this.initLevel2();
            break;
            case 3:
                if(!this.showCallToAction) {
					console.log("corrects: "+this.corrects);
                    this.levelAudio = this.sound.play("soundP3");
					this.groupLevel.removeAll();
					this.groupFront.removeAll();
                }
                this.initLevel3();
            break;
        }
		this.changingLevel = false;
		this.clickable = true;
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {
		this.showQuestion(1);
		this.createDelayTime( 9000, function(){
			this.groupLevel = this.add.group();
			
			// fixo - criar sistema de botoes dentro do array
			this.buttonsLvl1 = [];
			this.buttonsLvl1.push( this.createButton(+1100, this.world.centerY+120, "CA", 100, true, this.world.centerX-80, this.world.centerY+120) );
			this.buttonsLvl1.push( this.createButton(-100, this.world.centerY+105, "MA", 100, true, this.world.centerX, this.world.centerY+105) );
			this.buttonsLvl1.push( this.createButton(-100, this.world.centerY+90, "LA", 100, true, this.world.centerX+80, this.world.centerY+120) );
			this.placeHolderLvl1 = this.add.sprite(-255, this.world.centerY+150, "two_holder");
			this.placeHolderLvl1.alpha = 0;
			
			this.groupLevel.add(this.placeHolderLvl1);	
			this.groupLevel.add(this.buttonsLvl1[1]);
			this.groupLevel.add(this.buttonsLvl1[0]);
			this.groupLevel.add(this.buttonsLvl1[2]);
			
			this.createDelayTime( 200, function() {
			 
				this.add.tween(this.placeHolderLvl1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[0]).to({x: this.buttonsLvl1[0].OrigX, y: this.buttonsLvl1[0].OrigY}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[1]).to({x: this.buttonsLvl1[1].OrigX, y: this.buttonsLvl1[1].OrigY}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[2]).to({x: this.buttonsLvl1[2].OrigX, y: this.buttonsLvl1[2].OrigY}, 750, Phaser.Easing.Linear.None, true);
	
			}, this);
			this.groupFront = this.add.group();
		});
    },

    

    initLevel2: function() {
		this.showQuestion(2);
		this.createDelayTime( 9000, function(){
			this.groupLevel = this.add.group();
			
			// fixo - criar sistema de botoes dentro do array
			this.buttonsLvl1 = [];
			this.buttonsLvl1.push( this.createButton(-100, this.world.centerY+120, "FI", 100, true, this.world.centerX-80, this.world.centerY+120) );
			this.buttonsLvl1.push( this.createButton(+1100, this.world.centerY+105, "TA", 100, true, this.world.centerX, this.world.centerY+105) );
			this.buttonsLvl1.push( this.createButton(-100, this.world.centerY+90, "LA", 100, true, this.world.centerX+80, this.world.centerY+120) );
			this.placeHolderLvl1 = this.add.sprite(-255, this.world.centerY+150, "two_holder");
			this.placeHolderLvl1.alpha = 0;
			
			this.groupLevel.add(this.placeHolderLvl1);	
			this.groupLevel.add(this.buttonsLvl1[1]);
			this.groupLevel.add(this.buttonsLvl1[0]);
			this.groupLevel.add(this.buttonsLvl1[2]);
			
			this.createDelayTime( 200, function() {
			 
				this.add.tween(this.placeHolderLvl1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[0]).to({x: this.buttonsLvl1[0].OrigX, y: this.buttonsLvl1[0].OrigY}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[1]).to({x: this.buttonsLvl1[1].OrigX, y: this.buttonsLvl1[1].OrigY}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[2]).to({x: this.buttonsLvl1[2].OrigX, y: this.buttonsLvl1[2].OrigY}, 750, Phaser.Easing.Linear.None, true);
	
			}, this);
			this.groupFront = this.add.group();
		});
    },

    initLevel3: function() {
		this.showQuestion(3);
		this.createDelayTime( 9000, function(){
			this.groupLevel = this.add.group();
			
			this.randomLetter = this.rnd.integerInRange(0,2);
			
			// fixo - criar sistema de botoes dentro do array
			this.buttonsLvl1 = [];
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+120, "ES", 100, true, this.world.centerX-240, this.world.centerY+135) );
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+105, "PA", 100, true, this.world.centerX-160, this.world.centerY+120) );
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+90, "SA", 100, true, this.world.centerX-80, this.world.centerY+105) );
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+105, "TO", 100, true, this.world.centerX, this.world.centerY+90) );
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+90, "TE", 100, true, this.world.centerX+80, this.world.centerY+105) );
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+90, "CO", 100, true, this.world.centerX+160, this.world.centerY+120) );
			this.buttonsLvl1.push( this.createButton(+100, this.world.centerY+90, "LA", 100, true, this.world.centerX+240, this.world.centerY+135) );
			this.placeHolderLvl1 = this.add.sprite(-255, this.world.centerY+150, "three_holder");
			this.placeHolderLvl1.alpha = 0;
			
			
			
			this.groupLevel.add(this.placeHolderLvl1);	
			this.groupLevel.add(this.buttonsLvl1[1]);
			this.groupLevel.add(this.buttonsLvl1[0]);
			this.groupLevel.add(this.buttonsLvl1[2]);
			this.groupLevel.add(this.buttonsLvl1[4]);
			this.groupLevel.add(this.buttonsLvl1[3]);
			this.groupLevel.add(this.buttonsLvl1[5]);
			this.groupLevel.add(this.buttonsLvl1[6]);
			
			this.groupFront = this.add.group();
			
			this.createDelayTime( 200, function() {
			 
				this.add.tween(this.placeHolderLvl1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
				if(this.randomLetter == 0){
					this.add.tween(this.buttonsLvl1[0]).to({x: 387, y: 517}, 500, Phaser.Easing.Linear.None, true);
					this.buttonsLvl1[0].input.enabled = false;
				} else {
					this.add.tween(this.buttonsLvl1[0]).to({x: this.buttonsLvl1[0].OrigX, y: this.buttonsLvl1[0].OrigY}, 800, Phaser.Easing.Linear.None, true);
				}
				if(this.randomLetter == 1){
					this.add.tween(this.buttonsLvl1[1]).to({x: 387, y: 517}, 500, Phaser.Easing.Linear.None, true);
					this.buttonsLvl1[1].input.enabled = false;
				} else {
				this.add.tween(this.buttonsLvl1[1]).to({x: this.buttonsLvl1[1].OrigX, y: this.buttonsLvl1[1].OrigY}, 720, Phaser.Easing.Linear.None, true);
				}
				if(this.randomLetter == 2){
					this.buttonsLvl1[2].input.enabled = false;
					this.add.tween(this.buttonsLvl1[2]).to({x: 387, y: 517}, 500, Phaser.Easing.Linear.None, true);
				} else {
					this.add.tween(this.buttonsLvl1[2]).to({x: this.buttonsLvl1[2].OrigX, y: this.buttonsLvl1[2].OrigY}, 750, Phaser.Easing.Linear.None, true);
				}
				this.add.tween(this.buttonsLvl1[3]).to({x: this.buttonsLvl1[3].OrigX, y: this.buttonsLvl1[3].OrigY}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[4]).to({x: this.buttonsLvl1[4].OrigX, y: this.buttonsLvl1[4].OrigY}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[5]).to({x: this.buttonsLvl1[5].OrigX, y: this.buttonsLvl1[5].OrigY}, 750, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[6]).to({x: this.buttonsLvl1[6].OrigX, y: this.buttonsLvl1[6].OrigY}, 750, Phaser.Easing.Linear.None, true);
			}, this);
			
			this.createDelayTime(2200,function(){
				this.letters[0] = this.buttonsLvl1[this.randomLetter]; 
				this.buttonsLvl1[this.randomLetter].input.enabled = false;
				this.letters[0].input.enabled = false;
				this.groupFront.add(this.letters[0]);
			});
		});
    },
	//criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, time, canInteract, xFinal, yFinal) {
		
        var btn;
        btn = this.add.button(x,y, imagem, null, this);

        btn.anchor.set(0.5,1);
        btn.alpha = 1;
        btn.scale.set(1,1);
		
        if(canInteract) {
			btn.onInputDown.add(this.onButtonClick, this);
			btn.onInputOver.add(this.onButtonOver, this);
			btn.input.useHandCursor = true;
			btn.OrigX = xFinal;
        	btn.OrigY = yFinal;
			btn.name = ""+imagem;
			btn.holder = 0;
		}
       // this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time);

        return btn;
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {
		
		this.checkWords();
		
		if( this.changingLevel ){
			console.log("parouparouparou");
			this.clickable = false;
			if(this.soundLetter != null)this.soundLetter.stop();	
		}
		
		if( this.currentLevel <= 1 ){
			if( this.letters[0] != null && this.letters[1] !=null && !this.clearResult){
				if( this.letters[0].name+""+this.letters[1].name == "CAMA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 0);
				} else if( this.letters[0].name +""+ this.letters[1].name == "MACA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 1);
				} else if( this.letters[0].name +""+ this.letters[1].name == "LAMA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 2);
				} else if( this.letters[0].name +""+ this.letters[1].name == "MALA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 3);
				} else if( this.letters[0].name + this.letters[1].name == "CALA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 4);
				} else if( this.letters[0].name == this.letters[1].name ) {
					this.letters[this.letters[0].holder-1] = this.letters[0];
				} else {
					this.lives--;
					this.livesCondition();	
				}
	
				if(this.wordsCount == 1){
					for( i = 0; i < 4;i++ ){
						this.words[i] = null;	
					}
					this.corrects++;
                    this.saveCorrect();
					this.wordsCount = 0;
					this.changingLevel = true;
					this.gotoNextLevel();
				}
				
			}
		}
		
		if( this.currentLevel == 2 ){
			if( this.letters[0] != null && this.letters[1] !=null && !this.clearResult){
				if( this.letters[0].name+""+this.letters[1].name == "FITA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 0);
				} else if( this.letters[0].name +""+ this.letters[1].name == "LATA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 1);
				} else if( this.letters[0].name +""+ this.letters[1].name == "FILA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 2);
				} else if( this.letters[0].name +""+ this.letters[1].name == "TALA" ){
					this.wordValidate(this.letters[0].name +""+ this.letters[1].name, 3);
				} else if( this.letters[0].name == this.letters[1].name ) {
					this.letters[this.letters[0].holder-1] = this.letters[0];
				} else {
					this.lives--;
					this.livesCondition();
				}
	
				if(this.wordsCount == 2){
					for( i = 0; i < 4;i++ ){
						this.words[i] = null;	
					}
					this.corrects++;
                    this.saveCorrect();
					this.wordsCount = 0;
					this.changingLevel = true;
					this.gotoNextLevel();
				} else {
                    this.saveCorrect(50, false);
                }
				
			}
		}
		
		if( this.currentLevel == 3 ){
			
			if(this.letters[0] != null && this.buttonsLvl1[4] != null){
				console.log("corrects: "+this.corrects);
				this.letters[0].input.enabled = false;
				console.log("input do letter[0]: "+this.letters[0].input.enabled);
				console.log("input do button[4]: "+this.buttonsLvl1[4].input.enabled);	
			}
			
			if( this.letters[0] != null && this.letters[1] !=null && this.letters[2] && !this.clearResult){
				if( this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name == "ESCOLA" ){
					this.wordValidate(this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name, 0);
				} else if( this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name == "PACOTE" ){
					this.wordValidate(this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name, 1);
				} else if( this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name == "SAPATO" ){
					this.wordValidate(this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name, 2);
				} else if ( this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name == "ESTOLA" ){
					this.wordValidate(this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name, 3);
				} else if ( this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name == "PATOLA" ){
					this.wordValidate(this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name, 4);
				} else if ( this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name == "SACOLA" ){
					this.wordValidate(this.letters[0].name+""+this.letters[1].name+""+this.letters[2].name, 5);
				} else if( this.letters[0].name == this.letters[1].name ) {
					this.letters[this.letters[0].holder-1] = this.letters[0];
				} else if( this.letters[1].name == this.letters[2].name ) {
					this.letters[this.letters[1].holder-1] = this.letters[1];
				}  else if( this.letters[0].name == this.letters[2].name ) {
					this.letters[this.letters[0].holder-1] = this.letters[0];
				} else {
					this.lives--;
					this.livesCondition();
				}
	
				if(this.wordsCount == 2){
					for( i = 0; i < 4;i++ ){
						this.words[i] = null;	
					}
					this.corrects++;
                    this.saveCorrect();
					this.wordsCount = 0;
					this.changingLevel = true;
					this.gotoNextLevel();
				} else {
                    this.saveCorrect(50, false);
                }
				
			}
		}
	}
};
