
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
        this.TEMPO_INTRO = 28000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 19000;
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

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();

        // D7OA03
        this.groupLevel =[];
        this.errou = false;
        this.nivelErros = 0;
        this.subLevel =1;

        // fim D7OA03

        this.createScene();
		//this.showResumo();
        this.showIntro();

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

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
        //this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.groupIntro.remove(this.tutorialPlacar);
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(
            function() {
                this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
            }, this);

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

        this.createDelayTime( 6000, function() {
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

        var tutorialText2 = this.add.sprite( this.world.centerX+10, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime(6000, function() {
             this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
             this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500)
             }, this);
        });

        this.createDelayTime(15000, function() {
            this.add.tween(tutorialText2).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showLiveTutorial, this);
            //this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });

        //this.createDelayTime( this.TEMPO_INTRO, function() {
            //this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            //this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        //});
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

        console.log("gotoNextLevel");
        console.log("nivel "+this.currentLevel );

        if(this.currentLevel==3 && this.subLevel==1)
        {
           console.log(" --  nivel "+this.currentLevel + " --> " + this.subLevel);
           this.subLevel=2;
        }
        else
        {
            console.log(" ++ nivel "+this.currentLevel + " --> " + this.subLevel);
            this.currentLevel++;
        }

       
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
                    console.log("isWrong");
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;
                        this.showNextLevel();
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    });

                } else {
                    console.log("showNextLevel");
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }

            } else {
                console.log("gameOverMacaco");
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
            //this.spliceLetter.push(this.correctItem._frameName);
        }
    }, 

    showCorrectName: function(gotoNext) {

        var itens = [];

        this.removeButtonAction();
        console.log("============  showCorrectName =============");
        //console.log(this.correctItem);
        var _extra = (this.correctItem._frameName == "medalha")? 35 : 0;

        var t = this.add.tween(this.correctItem)
                    .to({x:this.world.centerX, y: 250}, 2000, Phaser.Easing.Linear.None)
                    .to({y: 290+_extra}, 200, Phaser.Easing.Quadratic.In);
        t.start();
        
        this.createDelayTime(2000, function() {this.resetLevel(this.currentLevel)});
        if(gotoNext) {
            this.createDelayTime(4000, this.gotoNextLevel);
        }
        //this.resetLevel(this.currentLevel);
    },

    clickEffect: function(target) {
        if(target.letter != null) {
            //target.letter.alpha = 0.7;
        }
    },

    // ------------ D7OA03 ------------
    createSoma:function(nivel,id,x,y){

        var sprite  = this.add.sprite(x, y, 'pacotes',id);
        sprite.scale.set(0.7,0.7);
        if(nivel==0)
        {
            this.groupIntro.add(sprite);
        }
        else
        {
            this.groupLevel[nivel].add(sprite);
        }

        return sprite;

    },

    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },

    resetLevel:function(nivelJogo){

        this.createDelayTime(500, function() {
                 this.add.tween(this.groupLevel[nivelJogo]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
                 
                 if(this.groupLevel[this.nivel] != null) {
                    this.groupLevel[this.nivel].removeAll(true);
                 }
            }); 
    },


    // ------------ FIM D7OA03 --------

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.add.sprite( -450, -270, 'background');
        
        this.createAnimation( 739,291, 'walter', 1,1);
        this.createAnimation( 837, 304, 'poly', 1,1);
        //this.add.sprite(749,291, 'walter');

        //this.initGame();
        
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        var tutorialText3 = this.add.sprite( this.world.centerX,70, 'initialText3');
        tutorialText3.alpha = 1;
        tutorialText3.anchor.set(0.5, 0.5);


        //tutorialText3.scale.set(0.7, 0.7);

        this.groupIntro.add(tutorialText3);

        this.createDelayTime(1000, function() {
            var numero1= this.createSoma(0,10,300,120); // 1
            numero1.scale.set(0.6, 0.6);
            var plus = this.add.sprite(490,140, 'plus');
            plus.scale.set(0.6, 0.6); 
            var numero2 = this.createSoma(0,8,600,120); // 3
            numero2.scale.set(0.6, 0.6);

            this.groupIntro.add(plus);
        });

       

        this.itens = [11,10,9]; // numeros par aresultado = 2,,3,4
        this.itensOrdem = [];
        itemCorreto = 11;

        this.buttons = [];
        var validar = false;

        this.posicao = new Array(
                            [4,354],
                            [180,422],
                            [337,336]
                        )
        this.itensOrdem =  this.itens.slice();
        
        this.createDelayTime(2000, function() {
            for(var i=0; i<this.itensOrdem.length; i++){
                if(this.itensOrdem[i]==itemCorreto)
                {
                    validar = true;
                }
                else
                {
                    validar = false;
                }//createButton: function( x, y, imagem, right, time, canInteract) {
                this.buttons.push( this.createButton( this.world.centerX -this.posicao[i][0], this.posicao[i][1],this.itensOrdem[i], validar,100,false));
                this.groupIntro.add(this.buttons[i]);
            
            }

            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);
        });

        this.createDelayTime(9000, function() {
               
                this.add.tween(this.arrow).to({x:this.world.centerX+120, y:436}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);
         });
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        

        this.buttons[0].alpha = 0.7;

        this.groupIntro.add(click);

        this.createDelayTime( 1400, function() {
            click.animations.play('idle');
        });

        // remover click
        this.createDelayTime( 2400, function() {
            click.alpha = 0;
            click.destroy();
        });

        // remover tudo
        this.createDelayTime( 4000, function() {

            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.createDelayTime(1000, function() {
                this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
            });
        });
    },

    // resumo inicial
    showTextResumo: function() {
        this.tutorialText = this.add.sprite( this.world.centerX-130, 110, 'pacotes',9);
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);
		this.tutorialText.scale.set(0.7, 0.7);

        this.groupIntro.add(this.tutorialText);
		
		this.tutorialText1 = this.add.sprite( this.world.centerX+40, 110, 'pacotes',10);
        this.tutorialText1.alpha = 0;
        this.tutorialText1.anchor.set(0.5, 0.5);
		this.tutorialText1.scale.set(0.7, 0.7);

        this.groupIntro.add(this.tutorialText1);
		
		this.plus = this.add.sprite( this.world.centerX-40, 110, 'plus');
        this.plus.alpha = 0;
        this.plus.anchor.set(0.5, 0.5);
		this.plus.scale.set(0.7, 0.7);

        this.groupIntro.add(this.plus);
		
		this.equal = this.add.sprite( this.world.centerX+120, 110, 'equal');
        this.equal.alpha = 0;
        this.equal.anchor.set(0.5, 0.5);
		this.equal.scale.set(0.7, 0.7);

        this.groupIntro.add(this.equal);
		
		this.cinco = this.add.sprite( this.world.centerX+150, 110, 'cinco');
        this.cinco.alpha = 0;
        this.cinco.anchor.set(0.5, 0.5);
		this.cinco.scale.set(0.7, 0.7);

        this.groupIntro.add(this.cinco);

        //this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");
		
		// pacote 1 
		
		this.createDelayTime(1000, function() {

			
            this.add.tween(this.tutorialText).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
				function() {
					this.add.tween(this.plus).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true)
				}, this);

        });
		
		this.createDelayTime(3000, function() {

            this.add.tween(this.tutorialText1).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
				function() {
					this.add.tween(this.equal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true)
				}, this);

        });
		
		this.createDelayTime(7500, function() {
			this.tutorialText.x -= 30;
			this.tutorialText1.x -= 30;
			this.plus.x-=30;
			this.equal.x-=30;
			this.createDelayTime(100, function() {
				this.add.tween(this.cinco).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
			});

        });
		
		this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(this.groupIntro).to({alpha: 0},500, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

        // tempo para mostrar o tutorial das letras
        

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        console.log("****  showNextLevel *** "+ this.currentLevel)
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
		this.clickable = true;
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

                    if(this.subLevel==1)
                    {
                        this.sound.play("soundP3");
                    }
                    if(this.subLevel==2)
                    {
                        this.sound.play("soundP4");
                    }
                    
                }
                this.initLevel3();
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 50, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {

        console.log("***** NIVEL 1 *****");
        this.showQuestion(1);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nivelErros =1;

        var numero1= this.createSoma(this.currentLevel,8,260,20); // 1
        var plus = this.add.sprite(470,70, 'plus');
        this.groupLevel[this.currentLevel].add(plus);
        var numero2 = this.createSoma(this.currentLevel,9,600,20); // 2

        numero1.alpha = 0;
        numero2.alpha = 0;
        plus.alpha=0;

        this.itens = [9,10,11]; // numeros par aresultado = 2,,3,4
        this.itensOrdem = [];

        this.temp_array =  this.itens.slice();
        //this.itensOrdem = [];
        
        for(var i=0; i<this.itens.length; i++){

            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
            this.retirarArrayElemento(item); 
            this.itensOrdem.push(item);
            
        }

        var itemCorreto = 10; // numero 3
        console.log(this.itensOrdem);

        this.buttons = [];
        var validar = false;

        this.posicao = new Array(
                            [4,354],
                            [180,422],
                            [337,336]
                        )
         var tempo = 500;
         if(!this.errou)
         {
            tempo = 5000;
         }  
         else
         {
            tempo = 500;
         } 
         this.errou = false;

                
        console.log("tempo: "+ tempo);
        
        this.createDelayTime(tempo, function() {
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        numero1.alpha = 1;
                        numero2.alpha = 1;
                        plus.alpha=1;
                        for(var i=0; i<this.itensOrdem.length; i++){
                            if(this.itensOrdem[i]==itemCorreto)
                            {
                                validar = true;
                            }
                            else
                            {
                                validar = false;
                            }//createButton: function( x, y, imagem, right, time, canInteract) {
                            this.buttons.push( this.createButton( this.world.centerX -this.posicao[i][0], this.posicao[i][1],this.itensOrdem[i], validar,(this.showCallToAction)?0:4500));
                            this.groupLevel[this.currentLevel].add(this.buttons[i]);
                        }
         
                    }, this);
                
            }, this);

        });  
    },

    initLevel2: function() {

        
        console.log("***** NIVEL 2 *****");
        this.showQuestion(2);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nivelErros =1;


        var numero1= this.createSoma(this.currentLevel,13,260,20); // 2
        var plus = this.add.sprite(470,70, 'plus');
        this.groupLevel[this.currentLevel].add(plus);
        var numero2 = this.createSoma(this.currentLevel,13,600,20); // 2

        numero1.alpha = 0;
        numero2.alpha = 0;
        plus.alpha=0;

        this.itens = [12,14,15]; // numeros par aresultado = 2,,3,4
        this.itensOrdem = [];

        this.temp_array =  this.itens.slice();
        //this.itensOrdem = [];
        
        for(var i=0; i<this.itens.length; i++){

            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
            this.retirarArrayElemento(item); 
            this.itensOrdem.push(item);
            
        }

        var itemCorreto = 15; // numero 3
        console.log(this.itensOrdem);

        this.buttons = [];
        var validar = false;

        this.posicao = new Array(
                            [4,354],
                            [180,422],
                            [337,336]
                        )
         var tempo = 500;
         if(!this.errou)
         {
            tempo = 5000;
         }  
         else
         {
            tempo = 500;
         } 
         this.errou = false;
         
        console.log("tempo: "+ tempo);

        this.createDelayTime(tempo, function() {
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    numero1.alpha = 1;
                    numero2.alpha = 1;
                    plus.alpha=1;
                    for(var i=0; i<this.itensOrdem.length; i++){
                        if(this.itensOrdem[i]==itemCorreto)
                        {
                            validar = true;
                        }
                        else
                        {
                            validar = false;
                        }//createButton: function( x, y, imagem, right, time, canInteract) {
                        this.buttons.push( this.createButton( this.world.centerX -this.posicao[i][0], this.posicao[i][1],this.itensOrdem[i], validar,(this.showCallToAction)?0:4500));
                        this.groupLevel[this.currentLevel].add(this.buttons[i]);
                    }
         
                }, this);
            }, this);

        }); 
    },

    initLevel3: function() {

        console.log("***** NIVEL 3 *****");
        console.log("*****SUB*****> "+this.subLevel);
        
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nivelErros =2;

        if(this.subLevel==1)
        {
            this.showQuestion(3);
            var numero1= this.createSoma(this.currentLevel,4,260,20); // 2
            var plus = this.add.sprite(470,70, 'plus');
            this.groupLevel[this.currentLevel].add(plus);
            var numero2 = this.createSoma(this.currentLevel,5,600,20); // 3
            this.itens = [4,6,7]; // numeros par aresultado = 2,4,5
            var itemCorreto = 7; // numero 3
            console.log(this.itensOrdem);

        }
        if(this.subLevel==2)
        {
            this.showQuestion(4);
            var numero1= this.createSoma(this.currentLevel,16,260,20); // 1
            var plus = this.add.sprite(470,70, 'plus');
            this.groupLevel[this.currentLevel].add(plus);
            var numero2 = this.createSoma(this.currentLevel,2,600,20); // 4
            this.itens = [0,2,3]; // numeros par aresultado = 2,,3,4
            var itemCorreto = 3; // numero 5
            console.log(this.itensOrdem);
        }
        

        numero1.alpha = 0;
        numero2.alpha = 0;
        plus.alpha=0;

        
        this.itensOrdem = [];

        this.temp_array =  this.itens.slice();
        //this.itensOrdem = [];
        
        for(var i=0; i<this.itens.length; i++){

            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
            this.retirarArrayElemento(item); 
            this.itensOrdem.push(item);
            
        }

       

        this.buttons = [];
        var validar = false;

        this.posicao = new Array(
                            [4,354],
                            [180,422],
                            [337,336]
                        )
         var tempo = 500;
         if(!this.errou)
         {
            tempo = 5000;
         }  
         else
         {
            tempo = 500;
         } 
         this.errou = false;
         
        console.log("tempo: "+ tempo);

        this.createDelayTime(tempo, function() {
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                numero1.alpha = 1;
                numero2.alpha = 1;
                plus.alpha=1;
                for(var i=0; i<this.itensOrdem.length; i++){
                    if(this.itensOrdem[i]==itemCorreto)
                    {
                        validar = true;
                    }
                    else
                    {
                        validar = false;
                    }//createButton: function( x, y, imagem, right, time, canInteract) {
                    this.buttons.push( this.createButton( this.world.centerX -this.posicao[i][0], this.posicao[i][1],this.itensOrdem[i], validar,(this.showCallToAction)?0:4500));
                    this.groupLevel[this.currentLevel].add(this.buttons[i]);
                }
            }, this);

        }); 
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'pacotes', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'pacotes', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

        }

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, time);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    // clicar botao correto
    clickRightButton: function(target) {
		
		if(this.clickable){
			this.clickable = false;
			if(target.alpha < 1) {
				return;
			}
	
			console.log("clickRightButton");
			console.log("nivel--> "+this.currentLevel);
			console.log("Subnivel--> "+this.subLevel);
			/* FIXO */
			if(this.currentLevel==3 && this.subLevel==1)
			{
			   this.corrects--;
			}
			else
			{
				 this.corrects++;
                 this.saveCorrect();
				 //this.addPoints();
			}
			//this.sound.stopAll();
			this.sound.play("hitAcerto");
			this.clearButtons(true);
			
			
			//resetLevel:function(nivelJogo){
			/* FIXO */
			 //this.createDelayTime(100, this.clickEffect(target));
			 //this.createDelayTime(100, this.showCorrectName(true));
			this.clickEffect(target);
			this.showCorrectName(true);

		}

    },

    // clicar botao errado
    clickWrongButton: function(target) {
		
		if(this.clickable){
			this.clickable = false;
			if(target.alpha < 1) {
				return;
			}
	
			/* FIXO */
			var nivel = this.currentLevel;
			//if(this.currentLevel > 1 ) {
				//this.currentLevel--;
			//}
	
			if(this.currentLevel==2)
			{
				this.currentLevel--;
			}
	
			if(this.currentLevel==3)
			{
				console.log("-> "+ this.currentLevel);
				if(this.subLevel==1)
				{
					console.log("-> this.subLevel = 1 "+ this.currentLevel);
					this.subLevel = 2;
					this.createDelayTime(500, function() {this.hideLevel();}); 
					this.createDelayTime(1000, function() {this.sound.play("soundDica");}); 
					this.createDelayTime(5000, function() {this.hideAndShowLevel(false);}); 
				}
				else
				{
					console.log("-> this.subLevel = 2 "+ this.currentLevel);
					this.currentLevel--;
					this.lives--;
					this.errors--; 
					this.errou = true;
				}
			}
			else
			{
				this.lives--;
				this.errors--; 
				this.errou = true;
			}
			
			
	
			
			
			//this.sound.stopAll();
			this.sound.play("hitErro");
			
			
			
			this.createDelayTime(1500, function() {
				this.resetLevel(nivel);
				this.clearButtons(false);
			}); 
	
			switch(this.lives) {
				case 1: // mostra dica 1
	
				this.createDelayTime(1500, function() {
					this.createDelayTime(500, function() {this.hideLevel();}); 
					this.createDelayTime(1000, function() {this.sound.play("soundDica");}); 
					this.createDelayTime(4000, function() {this.hideAndShowLevel(true);}); 
				});
					
				break;
				case 0: // toca som de resumo
					this.lives = 0;
					this.createDelayTime(1500, function() {
						this.hideLevel();
						this.showResumo();
					});
				break;
				default: // game over
				break;
			}
			this.updateLivesText();
			/* FIXO */
	
			this.clickEffect(target);
			
		}
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
