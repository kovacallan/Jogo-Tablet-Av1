
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
        this.TEMPO_INTRO = 14000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 18500;
        this.SOUND_VITORIA = 10500;
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

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();


        this.createScene();

        this.showIntro();

        //this.gameOverMacaco();

        //------D8OA01-----//
        this.groupLevel = [];
        this.posCorretItens = this.world.centerX - 390;
        this.posItens = [];
        this.botoes = [];
        this.countBotoes =0
        this.correctItem = [];
        this.intro = false;

        this.countCorretos = 0;
        //------D8OA01-----//


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);

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

    //fixa
    onButtonOver: function(elem) {
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    //fixa
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            itens.splice(n,1);
        }
        return _itens;
    },

    getRandomUniqueItem: function(list, level) {

        var letters = this.getNonRepeatLetter(list, level); // FRE
        var n = this.rnd.integerInRange(0,letters.length-1);

        this.spliceLetter.push( letters[n] );

        return letters[n];
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

        this.createDelayTime(3000, function() {
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
		
		var tutorialText2 = this.add.sprite( this.world.centerX, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        
        this.groupIntro.add(tutorialText2);

        this.createDelayTime( 3000, function() {
			this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add( function(){
				this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
				this.showLiveTutorial();

				}, this);
        });
		
		this.createDelayTime(13000, function() {
		    this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA+500).onComplete.add(function() {
            animal.animations.play('idle');

            this.showTextVictory();

            this.eventConclusao = new Phaser.Signal();
            this.eventConclusao.addOnce(this.showEndButtons, this);

            this.registrarConclusao();

        }, this);
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
        this.intro = false;
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -160}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function(clearCorrect) {

        for(var i = 0; i < this.buttons.length; i++) {
            if(clearCorrect) {
                this.buttons[i].input.enabled = false;
                if(this.buttons[i].isCorrect == undefined || !this.buttons[i].isCorrect) {
                    this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                        elem.destroy();
                    });
                }
            } else {
                this.buttons[i].input.enabled = false;
                this.add.tween(this.buttons[i]).to({alpha: 0},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
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
        console.log("hideAndShowLevel");
        this.hideLevel(function() {

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {

                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;
                        this.showNextLevel();
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    });

                } else {

                    this.add.tween(this.placar).to({y: -160}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }

            } else {
                this.gameOverMacaco();
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

    //------D8OA01-----//
    resetLevel:function(nivelJogo){

        this.itens  = []; 
        this.errados = []; 
        this.posCorretItens = this.world.centerX - 390;
        this.botoes = [];
        this.correctItem = [];
        this.countCorretos = 0;

        this.createDelayTime(500, function() {
                 this.add.tween(this.groupLevel[nivelJogo]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
                 
                 if(this.groupLevel[this.nivel] != null) {
                    this.groupLevel[this.nivel].removeAll(true);
                 }
            }); 
    },

    calcPosicionamentoItens:function(){
        this.posItens = [this.world.centerX+90,this.world.centerX+290]

        for(var i=0; i<4; i++)
        {

            if(i==0)
            {
                this.posItens[i]  = this.world.centerX-100;
            }
            else
            {
                this.posItens[i] = this.posItens[i-1]+160;
            }
            
        }

        var x = 0;
        var y = 160;
        var aux = 0;

        this.imagens=[];
        
        //this.graphics = this.game.add.graphics(100, 100);
        //this.graphics.lineStyle(2, 0x0000FF, 1);

        for(var i=0; i<8; i++)
        {

            if(i==6){aux = 0; y = 390;}
            if(i==3){aux = 0; y = 280;}
               
            x = this.posItens[aux];
            
            //this.graphics.drawRect(x, y, 160, 100);

            this.imagens[i] = new Array([x+100],[y+100]);

            aux++;
        }

        
    },
    //------D8OA01-----//

    resetRandomLetter: function() {
        this.spliceLetter = [
            
        ];
    },

    getNonRepeatLetter: function(itens, num) {

        var _name = [];

        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }
        
        //console.log(this.spliceLetter);

        for(var i = 0; i < this.spliceLetter.length; i++) {
            var indx = _name.indexOf(this.spliceLetter[i]);
            if(indx >= 0) {
                _name.splice(indx,1);
            }
        }

        if(_name.length < 1) {
            //cosnole.log("1 possible");
            return itens;
        }

        //console.log("possibles",_name);
        return _name;
    },

    limparNomes: function() {

        for(var i = 0; i < this.nameShadows.length; i++) {
            this.nameShadows[i].destroy();            
            this.nameTexts[i].destroy();            
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.groupName = this.add.group();
    },

    showName: function(name) {

        var Ypos = 10;

        this.limparNomes();

        for(var i = 0; i < name.length; i++) {

            var px = this.world.centerX - name.length*25 + i*this.LETTER_SPACING;

            //px = (name[i] == "_")? px + 10 : px;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            this.addLetter(px,py, name[i]);
        }

        //this.nameShadow.x = this.world.centerX - this.nameShadow.width*0.5+4;
        //this.nameText.x = this.world.centerX - this.nameText.width*0.5;
    },
    addLetter: function(x,y, letter) {


        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 75);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 75);

        shadow.x = x+4-shadow.width*0.5;
        name.x = x-name.width*0.5;

        this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        this.groupName.add(shadow);
        this.groupName.add(name);

        return [name,shadow];
    },

    removeButtonAction: function(target) {

        console.log("removeButtonAction");

        target.input.useHandCursor = false;
        this.game.canvas.style.cursor = "default";
        target.input.reset();
        
        target.inputEnabled = false;
        target.onInputOver.removeAll();
        target.onInputOut.removeAll();
        target.onInputUp.removeAll();

        console.log(target);
        
    }, 

    showCorrectName: function(target,gotoNext) {

        console.log('showCorrectName');
        console.log(target);
        
        this.removeButtonAction(target);
        //this.graphics.drawRect(this.posCorretItens, 70, 160, 100);

        var posY=40+100;
        var posX = this.posCorretItens+100;
        var t = this.add.tween(target)
                    .to({x:posX, y: posY}, 2000, Phaser.Easing.Linear.None)
        t.start();

        this.posCorretItens+=190;
        
        if(gotoNext) {
            this.createDelayTime(2000, function() {this.resetLevel(this.currentLevel)});
            this.createDelayTime(3000, this.gotoNextLevel);
        }
    },

    clickEffect: function(target) {
        if(target.letter != null) {
            //target.letter.alpha = 0.7;
        }
    },

    shuffle:function(array,tam) {
          var currentIndex = tam, temporaryValue, randomIndex ;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }

          return array;
    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        var background = this.add.sprite( -120, -300, 'background');
        background.scale.set(0.75,0.82);
        //this.fred = this.createAnimation( 295, 315, 'fred', 1,1);
        //this.createAnimation( 220, 365, 'poly', 1,1);
		
		this.fred = this.add.sprite( 295, 315, 'fred_idle',1);
        this.fred.animations.add('fred_idle');
        this.fred.animations.play('fred_idle', 15, true);

        this.poly = this.add.sprite( 220, 365, 'poly_idle',1);
        this.poly.animations.add('poly_idle');
        this.poly.animations.play('poly_idle', 15, true);

        //this.initGame();

    },
	
	changeFredHappy:function(){
        //console.log('fred!!!');
        this.fred.loadTexture('fred_happy', 0);
        //this.fred.x = 741;
        //this.fred.y = 180;
        var anim  = this.fred.animations.add('fred_happy');
        
        anim.onComplete.add(function() {
            this.changeFredIdlle();
        }, this);

        anim.play(15);


    },

    changePolyHappy:function(){
        //console.log('fred!!!');
        this.poly.loadTexture('poly_happy', 0);
        //this.fred.x = 741;
        //this.fred.y = 180;
        var anim  = this.poly.animations.add('poly_happy');
        
        anim.onComplete.add(function() {
            this.changePolyIdlle();
        }, this);

        anim.play(15);


    },

    changeFredIdlle:function(){
        //this.fred.animations.stop(null, true);
        //console.log('fred!!!');
        this.fred.loadTexture('fred_idle', 0);
        //this.fred.x = 781;
        //this.fred.y = 245;
        this.fred.animations.add('fred_idle');
        this.fred.animations.play('fred_idle', 15, true);
    },

    changePolyIdlle:function(){
        //this.fred.animations.stop(null, true);
        //console.log('fred!!!');
        this.poly.loadTexture('poly_idle', 0);
        //this.fred.x = 781;
        //this.fred.y = 245;
        this.poly.animations.add('fred_idle');
        this.poly.animations.play('fred_idle', 15, true);
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

		this.itens  = ['0']; 
        this.errados = ['6']; 
        this.intro = true;
        //var item_errado = this.getRandomUniqueItem(this.errados, 1);
        
        //this.showQuestion(1);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX+44,329, this.itens[0], false,100));
        this.buttons.push( this.createButton(this.world.centerX+287,416, this.errados[0], false,100));
        this.buttons[0].input.enabled = false;
        this.buttons[1].input.enabled = false;
        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[1]);

        this.createDelayTime( 4200, function() {
            
            this.arrow = this.add.sprite(this.world.centerX-100, this.world.centerY+10, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);
            this.add.tween(this.arrow).to({x:this.world.centerX+130, y: 400}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);

        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        click.animations.play('idle');
		this.buttons[0].scale.set(1.2,1.2);
        //this.buttons[0].alpha = 0.7;

        this.groupIntro.add(click);

        // remover click
        this.createDelayTime( 1400, function() {
            click.alpha = 0;
            click.destroy();
        });

        // remover tudo
        this.createDelayTime( 4000, function() {

            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            //this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        var tutorialText2 = this.add.sprite( this.world.centerX, 110, 'imgResumo2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        /*this.createDelayTime(8000, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
                function(){this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);}
                , this);

        });*/

        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                if(!this.showCallToAction) {
                    this.sound.play("soundP1");
                }
                this.initLevel1();
            break;
            case 2:
                if(!this.showCallToAction) {
                    this.sound.play("soundP2");
                }
                this.initLevel2();
            break;
            case 3:
                if(!this.showCallToAction) {
                    this.sound.play("soundP3");
                }
                this.initLevel3();
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 25, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {

        console.log("--- nivel 1 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);

        this.calcPosicionamentoItens();
        this.groupLevel[this.currentLevel] = this.add.group();
        this.countCorretos = 1;

        this.itens  = ['0']; 
        this.errados = ['6']; 
        //var item_errado = this.getRandomUniqueItem(this.errados, 1);
        
        this.showQuestion(1);
        
        //console.log(this.imagens.join());
        this.shuffle(this.imagens,2);
        //console.log(this.imagens.join());
     
        this.buttons = [];
        this.buttons.push( this.createButton(parseInt(this.imagens[0][0]), parseInt(this.imagens[0][1]), this.itens[0], true, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[1][0]), parseInt(this.imagens[1][1]), this.errados[0], false, (this.showCallToAction)?0:4500) );

        this.groupLevel[this.currentLevel].add(this.buttons[0]);
        this.groupLevel[this.currentLevel].add(this.buttons[1]);
    },

    

    initLevel2: function() {

        console.log("--- nivel 2 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);

        this.calcPosicionamentoItens();
        this.groupLevel[this.currentLevel] = this.add.group();
        this.countCorretos = 2;

        this.itens  = ['0','3']; // chuteira 
        this.errados = ['1','7']; // pipa ou boneca 
        //var item_errado = this.getRandomUniqueItem(this.errados, 1);
        
        this.showQuestion(2);

        //console.log(this.imagens.join());
        this.shuffle(this.imagens,4);
        //console.log(this.imagens.join());
        
        this.buttons = [];

        this.buttons.push( this.createButton(parseInt(this.imagens[3][0]), parseInt(this.imagens[3][1]), this.errados[1], false, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[2][0]), parseInt(this.imagens[2][1]), this.itens[1], true, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[1][0]), parseInt(this.imagens[1][1]), this.errados[0], false, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[0][0]), parseInt(this.imagens[0][1]), this.itens[0], true, (this.showCallToAction)?0:4500) );
        
        this.groupLevel[this.currentLevel].add(this.buttons[0]);
        this.groupLevel[this.currentLevel].add(this.buttons[1]);
        this.groupLevel[this.currentLevel].add(this.buttons[2]);
        this.groupLevel[this.currentLevel].add(this.buttons[3]);
    },

    initLevel3: function() {

        console.log("--- nivel 3 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);

        this.calcPosicionamentoItens();
        this.groupLevel[this.currentLevel] = this.add.group();
        this.countCorretos = 4;

        this.itens  = ['0','3','4','5']; // pares 
        this.errados = ['1','7','8']; // impares
        //var item_errado = this.getRandomUniqueItem(this.errados, 1);
        
        this.showQuestion(3);

        //console.log(this.imagens.join());
        this.shuffle(this.imagens,7);
        //console.log(this.imagens.join());
        
        this.buttons = [];
        this.buttons.push( this.createButton(parseInt(this.imagens[6][0]), parseInt(this.imagens[6][1]), this.itens[3], true, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[5][0]), parseInt(this.imagens[5][1]), this.errados[2], false, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[4][0]), parseInt(this.imagens[4][1]), this.itens[2], true, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[3][0]), parseInt(this.imagens[3][1]), this.errados[1], false, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[2][0]), parseInt(this.imagens[2][1]), this.itens[1], true, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[1][0]), parseInt(this.imagens[1][1]), this.errados[0], false, (this.showCallToAction)?0:4500) );
        this.buttons.push( this.createButton(parseInt(this.imagens[0][0]), parseInt(this.imagens[0][1]), this.itens[0], true, (this.showCallToAction)?0:4500) );

        this.groupLevel[this.currentLevel].add(this.buttons[0]);
        this.groupLevel[this.currentLevel].add(this.buttons[1]);
        this.groupLevel[this.currentLevel].add(this.buttons[2]);
        this.groupLevel[this.currentLevel].add(this.buttons[3]);
        this.groupLevel[this.currentLevel].add(this.buttons[4]);
        this.groupLevel[this.currentLevel].add(this.buttons[5]);
        this.groupLevel[this.currentLevel].add(this.buttons[6]);

    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        console.log("--> imagem "+imagem);
        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;

        if(!this.intro){
            if(right) {

                btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
                btn.isCorrect = true;
                this.correctItem[this.countBotoes] = btn;
                this.countBotoes++;
                //this.correctItem.push(btn);

            } else {
                btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

            }

            //btn.anchor.set(0.5,1);
            btn.alpha = 0;
            btn.scale.set(0.5,0.5);

            if(_canInteract) {

                
                    btn.onInputOver.add(this.onButtonOver, this);
                    btn.onInputOut.add(this.onButtonOut, this);
            
               
            }

            this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, time);
            this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time).onComplete.add(function() {
                if(_canInteract) {
                    //btn.input.useHandCursor = true;
                }
            }, this);
        }
        else{
            btn = this.add.button(x,y, 'sprites',false, this, imagem,imagem,imagem);
        }


        return btn;
        
    },
    // clicar botao correto
    clickRightButton: function(target) {

        if(target.alpha < 1) {
            return;
        }

        if(this.countCorretos>0)
        {
            this.countCorretos--;
            /* FIXO */
            this.sound.play("hitAcerto");
            //this.addPoints();
            /* FIXO */
            this.clickEffect(target);

            if(this.countCorretos==0)
            {
                this.corrects++;
                this.clearButtons(true);
                this.saveCorrect();
				this.changeFredHappy();
                this.changePolyHappy();
                this.showCorrectName(target,true);
            }
            else
            {
                this.showCorrectName(target,false);
            }
        }
       
        
        

    },

    // clicar botao errado
    clickWrongButton: function(target) {
        if(target.alpha < 1) {
            return;
        }

        /* FIXO */
        
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }

        this.clearButtons(false);
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.hideLevel();
                this.resetLevel(this.currentLevel);
                //this.createDelayTime(1000, function() {this.clearButtons(false);});
                this.createDelayTime(1500, function() {this.sound.play("soundDica");});
                this.createDelayTime(5200, function() {this.hideAndShowLevel(true);});
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel();
                this.resetLevel(this.currentLevel);
                //this.createDelayTime(1000, function() {this.clearButtons(false);});
                this.createDelayTime(1500, function() {this.showResumo();});
            break;
            default: // game over
            break;
        }
        this.updateLivesText();
        /* FIXO */

        this.clickEffect(target);
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
