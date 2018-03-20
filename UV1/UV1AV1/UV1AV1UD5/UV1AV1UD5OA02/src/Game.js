
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
        this.TEMPO_INTRO = 22000;
        this.TEMPO_ERRO1 = 10000;
        this.TEMPO_RESUMO = 20000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 60;
        this.UNDERLINE_SPACING = 10;
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
        this.isWrong = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();


        this.createScene();

        this.showIntro();
        //this.gameOverMacaco();

        /* REMOVE INTRO E INICIA JOGO DIRETO */
        //this.initGame();


        /*
        this.input.onTap.add(function() {
            console.log(this.input.x, this.input.y);
        }, this);
        */


        /* HUD */
        this.createHud();
        this.createBottomHud();
        //this.createRepeatButton();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);

    },


    /*********************************************************************************************************************/
    /* -INICIO-   HUD E BOTOES */


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

        var tutorialText2 = this.add.sprite( this.world.centerX+60, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        this.groupIntro.add(tutorialText2);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( 10000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);
            this.animation1 = this.add.sprite(this.world.centerX-400, this.world.centerY+20, 'introExemplo');
            var _intervalo = [];
            var _intervalo2 = [];
            for(var i=0; i<20; i++){
                _intervalo.push(i);
            }
            for(var i=21; i<182; i++){
                _intervalo2.push(i);
            }

            this.groupIntro.add(this.animation1);
            this.animation1.animations.add('idle', _intervalo, 18, false);
            this.animation1.animations.play('idle');
            this.animation1.scale.set( 1, 1);
                    
            this.createDelayTime(8500, function() {
                this.animation1.animations.add('idle', _intervalo2, 18, false);
                this.animation1.animations.play('idle');
                this.animation1.scale.set( 1, 1);
            });

            this.createDelayTime(19000, function() {
                this.add.tween(this.animation1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
                this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
                this.placar.anchor.set(0.5,0);
                this.createDelayTime(2000, function() {
                    this.initGame();
                });
            });
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

        //_name = "fredWin";

        var animal = this.createAnimation( this.world.centerX,pos[n], _name, 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,1);
        animal.alpha = 0;

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 15000);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 15500).onComplete.add(function() {
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
        var texts = [
            ["textoVitoria11"],
            ["textoVitoria21"],
            ["textoVitoria31","textoVitoria32"],
            ["textoVitoria41"],
            ["textoVitoria51","textoVitoria52"]
        ];
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

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
        this.add.tween(this.placar).to({y: -110}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function() {
        this.add.tween(this.bicho1).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.bicho2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.bicho3).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
        if(this.bicho4) this.add.tween(this.bicho4).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
        if(this.bicho5) this.add.tween(this.bicho5).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
    },

    // level-fixa
    gotoNextLevel: function() {

        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        this.hideLevel(function() {
            console.log(this.corrects);
            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                        //this.gameOverMacaco();
                   
                    });
                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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

    resetRandomLetter: function() {
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },

    getNonRepeatLetter: function(itens, num) {

        var _name = [];

        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }

        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            if(_name.indexOf(this.spliceLetter[num]) >= 0) {
                _name.splice(i,1);
            }
        }

        if(_name.length < 1) {
            return itens;
        }
        return _name;
    },

    removeButtonAction: function() {
        this.correctItem.input.useHandCursor = false;
        this.game.canvas.style.cursor = "default";
        this.correctItem.input.reset();
        
        this.correctItem.inputEnabled = false;
        this.correctItem.onInputOver.removeAll();
        this.correctItem.onInputOut.removeAll();
        this.correctItem.onInputUp.removeAll();

        console.log(this.correctItem);
        for(var i = 1; i < this.spliceLetter.length; i++) {
            this.spliceLetter[i].push(this.correctItem._frameName);
        }
    },

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
        this.add.sprite( 0, 0, 'background');
        this.createBase();
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.hideResumo, this);
        });
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        this.contPortaJ = 0;
        this.contPortaM = 0;
        this.contPortaN = 0;

        switch(this.currentLevel) {
            case 1:
                if(!this.isWrong) {
                    this.sound.play("soundP1");
                }
                this.initLevelModelF(["J1","J2","J3"], ["M1","M2","M3"], ["N1","N2","N3"], 3, 12000);
            break;
            case 2:
                if(!this.isWrong) {
                    this.sound.play("soundP2");
                }
                this.initLevelModelMD([["J4","J5","J6","J7","J8","J9"],["M4","M5","M6","M7","M8","M9"],["N4","N5","N6","N7","N8","N9"]], 4, 9000);
            break;
            case 3:
                if(!this.isWrong) {
                    this.sound.play("soundP3");
                }
                this.initLevelModelMD([["J4","J5","J6","J7","J8","J9"],["M4","M5","M6","M7","M8","M9"],["N4","N5","N6","N7","N8","N9"]], 5, 4000);
        }
        this.isWrong = false;
    },

    //inicia as perguntas
    initLevelModelF: function(primeiro, segundo, terceiro, jogadas, delay) {
        //variáveis para verificar se já tem bicho na base
        if(!this.jogadasAtuais || this.jogadasAtuais == 0){
            this.jogadasAtuais = jogadas;
        }
        else if(this.lives<2){
            this.jogadasAtuais = jogadas
        }
        if(!this.acertosTotais || this.acertosTotais == 0){
            this.acertosTotais = jogadas;
        }

        this.noEmptyBase1 = false;
        this.noEmptyBase2 = false;
        this.noEmptyBase3 = false;
        
        this.primeiroAtual = this.createRandomItens(primeiro, 1);
        this.segundoAtual = this.createRandomItens(segundo, 1);
        this.terceiroAtual = this.createRandomItens(terceiro, 1);

        var _letters = [];
        _letters.push(this.primeiroAtual);
        _letters.push(this.segundoAtual);
        _letters.push(this.terceiroAtual);
        

        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(this.currentLevel);
        this.createDelayTime( delay, function() {
            this.createNumberRuler(_letters);
        });
    },

    initLevelModelMD: function(primeiro, jogadas, delay) {
        //variáveis para verificar se já tem bicho na base
        if(!this.jogadasAtuais || this.jogadasAtuais == 0){
            this.jogadasAtuais = jogadas;
        }
        if(!this.acertosTotais || this.acertosTotais == 0){
            this.acertosTotais = jogadas;
        }

        this.noEmptyBase1 = false;
        this.noEmptyBase2 = false;
        this.noEmptyBase3 = false;
        
        var p1 = this.createRandomItens(primeiro[0], 1);
        var p2 = this.createRandomItens(primeiro[1], 1);
        var p3 = this.createRandomItens(primeiro[2], 1);

        this.palavras = p1.concat(p2, p3);

        for(var i = 3; i < jogadas; i++) {
            var n = this.rnd.integerInRange(0,2);
            this.palavras = this.palavras.concat( this.createRandomItens(primeiro[n], 1) )
        }

        console.log(this.palavras);

        var _letters = this.palavras;
        //_letters.push(this.palavras);

        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(this.currentLevel);
        this.createDelayTime( delay, function() {
            this.createNumberRuler(_letters);
        });
    },

    drawPoint:function(cor,x,y){ 
        console.log("*** drawPoint ***");
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(cor,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
    },

    onStopDragBicho: function(elem) {
        var _portaCorreta = String(elem.key).substr(0,1);
        var alturaPorta = 410;

        if(this.currentLevel==0){
            x1 = elem.x-(elem.width+20);
            laguraX =x1+(elem.width+30);

            y1 = elem.y-(elem.height+20);
            laguraY = y1+(elem.height+30);

            cor = 0xff0000;
        
            this.drawPoint(cor,x1,y1);
            this.drawPoint(cor,laguraX,y1);

            cor = 0x0000ff;

            this.drawPoint(cor,x1,laguraY);
            this.drawPoint(cor,laguraX,laguraY);
        }


        x1 = elem.x-(elem.width+20);
        laguraX =elem.width+30;

        y1 = elem.y-(elem.height+20);
        laguraY = elem.height+30;



        //if(Phaser.Rectangle.intersects(this.base1Rect, new Phaser.Rectangle(this.input.x,this.input.y,100,100))) {
        if(Phaser.Rectangle.intersects(this.base1Rect, new Phaser.Rectangle(x1,y1,laguraX,laguraY))) {
            if(!(this.noEmptyBase1)) {
                if(_portaCorreta == "J"){
                    this.acertosTotais--;
                    this.sound.play("hitAcerto");
                    console.log("certo");
                    console.log(this.jogadasAtuais);
                    if(this.lives<2){

                    }
                    
                } else {
                    this.sound.play("hitErro");
                    console.log("errado");
                    console.log(this.jogadasAtuais);
                    this.clickWrongButton();
                }

                this.contPortaJ++;
                alturaPorta = (alturaPorta - (40 * this.contPortaJ));
                this.add.tween(elem).to({x: 230, y: alturaPorta}, 300, Phaser.Easing.Linear.None, true);
                elem.inputEnabled = false;
                this.jogadasAtuais--;
                if(this.currentLevel == 1){
                    this.noEmptyBase1 = true;
                }
            }else{
               this.sound.play("hitErro");
               this.moveBack(elem);
            }
        }else if(Phaser.Rectangle.intersects(this.base2Rect, new Phaser.Rectangle(x1,y1,laguraX,laguraY))){//if(Phaser.Rectangle.intersects(this.base2Rect, new Phaser.Rectangle(this.input.x,this.input.y,50,50))){
            if(!(this.noEmptyBase2)) {
                if(_portaCorreta == "M"){
                    this.acertosTotais--;
                    this.sound.play("hitAcerto");
                    console.log("certo");
                    console.log(this.jogadasAtuais);
                    //gotoNextLevel
                } else {
                    this.sound.play("hitErro");
                    console.log("errado");
                    console.log(this.jogadasAtuais);
                    this.clickWrongButton();
                    this.acertosTotais--; 
                    
                    
            



                }

                this.contPortaM++;
                alturaPorta = (alturaPorta - (40 * this.contPortaM));
                this.add.tween(elem).to({x: 530, y: alturaPorta}, 300, Phaser.Easing.Linear.None, true);
                elem.inputEnabled = false;
                this.jogadasAtuais--;
                if(this.currentLevel == 1){
                    this.noEmptyBase2 = true;
                }                
            }else{
                this.sound.play("hitErro");
                this.moveBack(elem);
            }
        }else if(Phaser.Rectangle.intersects(this.base3Rect, new Phaser.Rectangle(x1,y1,laguraX,laguraY))){//if(Phaser.Rectangle.intersects(this.base3Rect, new Phaser.Rectangle(this.input.x,this.input.y,50,50))){
            if(!(this.noEmptyBase3)) {
                if(_portaCorreta == "N"){
                    this.acertosTotais--;
                    this.sound.play("hitAcerto");
                    console.log("certo");
                    console.log(this.jogadasAtuais);
                } else {
                    this.sound.play("hitErro");
                    console.log(this.jogadasAtuais);
                    console.log("errado");
                    this.clickWrongButton();


                }

                this.contPortaN++;
                alturaPorta = (alturaPorta - (40 * this.contPortaN));
                this.add.tween(elem).to({x: 770, y: alturaPorta}, 300, Phaser.Easing.Linear.None, true);
                elem.inputEnabled = false;
                this.jogadasAtuais--;
                if(this.currentLevel == 1){
                    this.noEmptyBase3 = true;
                }
            }else{
                this.sound.play("hitErro");
                this.moveBack(elem);
            }
        }else{
            this.sound.play("hitErro");
            this.moveBack(elem);
        }

        if(this.jogadasAtuais == 0){
            if(this.acertosTotais == 0){ //acertou todas 
                this.clickRightButton();
            }else{
                this.clickWrongButton();
            }
        }
    },
    

    moveBack: function(elem) {
        this.add.tween(elem).to({
            x: this.initialLetterPos.x, y: this.initialLetterPos.y
        }, 200, Phaser.Easing.Linear.None, true);
    },

    createNumberRuler: function(list) {
        for(var i = 0; i <= list.length-1; i++) {
            if(i == 0){
                var mov = this.add.sprite(this.world.centerX+15, this.world.centerY+180, list[i]);
                this.bicho1 = mov;
            }else if(i == 1){
                var mov = this.add.sprite(this.world.centerX+15, this.world.centerY+180, list[i]);
                mov.x = this.world.centerX-((this.bicho1.width * 0.5)+(mov.width - 10));
                this.bicho2 = mov;
            }else if(i == 2){
                var mov = this.add.sprite(this.world.centerX+15, this.world.centerY+180, list[i]);
                mov.x = this.world.centerX+((this.bicho1.width * 0.5)+(mov.width + 50));
                this.bicho3 = mov;
            }else if(i == 3){
                var mov = this.add.sprite(this.world.centerX+15, this.world.centerY+230, list[i]);
                mov.x = this.world.centerX+((this.bicho1.width * 0.5)+(mov.width - 5));
                this.bicho4 = mov;
            }else{
                var mov = this.add.sprite(this.world.centerX+15, this.world.centerY+230, list[i]);
                mov.x = this.world.centerX-((this.bicho1.width * 0.5)+(mov.width - 30));
                this.bicho5 = mov;
            }

            mov.anchor.set(1,1);
            mov.scale.set(1,1);

            mov.inputEnabled = true;
            mov.input.enableDrag(false, true);
            mov.events.onDragStart.add(this.onStartDragNumber, this);
            mov.events.onDragStop.add(this.onStopDragBicho, this);
        }
    },


    onStartDragNumber: function(elem) {
        this.initialLetterPos = new Phaser.Point(elem.x, elem.y);
    },


    createBase: function() {
        this.base1 = this.add.sprite(this.world.centerX-380, 20, 'base1');
        this.base2 = this.add.sprite(this.world.centerX-120, 20, 'base2');
        this.base3 = this.add.sprite(this.world.centerX+170, 10, 'base3');

        this.base1Rect = new Phaser.Rectangle(180, 190, 140, 190);

        this.base2Rect = new Phaser.Rectangle(460, 210, 150, 180);

        this.base3Rect = new Phaser.Rectangle(730, 200, 140, 190);

        this.elementsPosition = {
            "base1":   [314,390,239,409,213,381],
            "base2":   [524,404,433,408,433,384],
            "base3":   [756,396,650,411,645,382],
        };
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.isWrong) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    // clicar botao correto
    clickRightButton: function(target) {
        this.acertosTotais = 0;
        this.jogadasAtuais = 0;

        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        //this.sound.play("hitAcerto");
        //this.addPoints();
        this.currentLevel++;
        this.clearButtons();
        this.hideAndShowLevel(false);
        /* FIXO */
    },

    // clicar botao errado
    clickWrongButton: function() {
        this.numCorrects = 0;
        this.acertosTotais = 0;
        this.jogadasAtuais = 0;

        /* FIXO */
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        
        this.lives--;
        //this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.clearButtons();
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.sound.play("soundDica");
                this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.showResumo();
                this.hideLevel(function() {});
            break;
            default: // game over
            break;
        }
        this.updateLivesText();
        /* FIXO */
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
