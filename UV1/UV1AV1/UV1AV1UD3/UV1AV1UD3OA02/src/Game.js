
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
        this.TEMPO_INTRO = 4200;
        this.TEMPO_ERRO2 = 17000;
        this.TEMPO_ERRO1 = 8000;
        this.TEMPO_RESUMO = 15500;
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
        this.isWrong = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();

        this.audiosprite = this.add.audioSprite("audiosprite");


        this.createScene();


        this.showIntro();
        /* REMOVE INTRO E INICIA JOGO DIRETO */
        //this.initGame();

        /* HUD */
        this.createBottomHud();
        this.createHud();
        //this.createRepeatButton();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);
    },

    /*********************************************************************************************************************/
    /* -INICIO-   HUD E BOTOES */

    createRepeatButton: function() {
        this.repeat = this.add.button(40,this.world.height-40, 'repeatButton', this.clickRestart, this, 0,0,0);
        this.repeat.input.useHandCursor = true;
        this.repeat.anchor.set(0.5,0.5);

        this.repeat.onInputOver.add(this.onButtonOver, this);
        this.repeat.onInputOut.add(this.onButtonOut, this);
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

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 5500);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 6000).onComplete.add(function() {
            animal.animations.play('idle');

            this.showTextVictory();

            // set as callback to onSucessRegistrarConclusao
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

        for(var i = 0; i < this.texts.length; i++) {
            this.texts[i].destroy();
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

        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {

        this.hideLevel(function() {

            console.log(this.corrects);
            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {

                    this.isWrong = true;
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showNextLevel();
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

        var aux = letter.toUpperCase();

        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", aux, 75);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", aux, 75);

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
            this.spliceLetter[i].push(this.correctItem._frameName);
        }
    }, 

    showCorrectName: function(gotoNext) {

        var itens = [];

        this.removeButtonAction();

        console.log(this.correctItem);
        var _extra = (this.correctItem._frameName == "medalha")? 35 : 0;

        var t = this.add.tween(this.correctItem)
                    .to({x:this.world.centerX-450 + this.corrects*200, y: 250}, 1300, Phaser.Easing.Linear.None)
                    .to({y: 290+_extra}, 200, Phaser.Easing.Quadratic.In);
        t.start();
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
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

        this.add.sprite( -307, -416, 'background');
        this.createAnimation( 775, 291, 'fred', 1,1);
        
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.buttons = [];

        var s1 = this.add.sprite(600, 100, "bolachaTutorial1");

        this.groupIntro.add(s1);

        var name = this.add.bitmapText(300,100, "JandaManateeSolid", "Bolacha", 40);
        
        this.groupIntro.add(name);

        this.buttons.push(s1);
        this.buttons.push(name);


        this.createDelayTime( 4200, function() {
            
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");

            this.groupIntro.add(this.arrow);
            this.arrow.anchor.set(0.5,0.5);
            this.add.tween(this.arrow).to({x:380, y: 150}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);

        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        
        this.add.tween(this.arrow).to({x:650}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttons[1]).to({x:570}, 500, Phaser.Easing.Linear.None, true);


        this.buttons[1].alpha = 0.7;

        this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 2500).onComplete.add(function() {

            this.add.tween(this.buttons[1]).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
            
            this.buttons[0].loadTexture("bolachaTutorial2");
            this.buttons[0].scale.set(0.5,0.5);

            var poeira = this.add.sprite(650, 150, "poeira");
            poeira.anchor.set(0.5,0.5);
            poeira.animations.add("effect", null, 15, false);
            poeira.animations.play("effect");

            this.groupIntro.add(poeira);

            this.add.tween(this.buttons[0].scale).to({x: 1,y:1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[0]).to({x: 380, y: 60}, 500, Phaser.Easing.Linear.None, true);

        }, this);

        // remover tudo
        this.createDelayTime( 15000, function() {

            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

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

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
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
                if(!this.isWrong) {
                    this.sound.play("soundP1");
                }
                this.initLevel(["formiga", "baú", "mochila", "avião"], 1, (this.isWrong)?500:4000);
            break;
            case 2:
                if(!this.isWrong) {
                    this.sound.play("soundP2");
                }
                this.initLevel(["computador", "casa", "caneta", "bola"], 2, (this.isWrong)?500:2000);
            break;
            case 3:
                if(!this.isWrong) {
                    this.sound.play("soundP3");
                }
                this.initLevel(["flor", "mosquito", "sol", "lápis"], 3, (this.isWrong)?500:2000);
            break;
        }
        this.isWrong = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 50, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.isWrong) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },
    hideQuestion: function() {

    },

    initLevel: function(itens, level, time) {

        this.itens = itens;
        // selo, bola, retrato, lapis, boneco

        //var item = this.getRandomUniqueItem(this.itens, 1);
        //var item2 = this.getRandomUniqueItem(this.itens, 1);
        
        //var _letters = [item, item2];
        var _letters = this.createRandomItens(this.itens,2);

        var _wrong = [];
        for(var i = 0; i < this.itens.length; i++) {
            if(_letters.indexOf(this.itens[i]) < 0) {
                _wrong.push(this.itens[i]);
            }
        }

        var _options = [_letters[this.rnd.integerInRange(0,1)], _wrong[this.rnd.integerInRange(0,1)]];
        
        _options.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(level);
            
        this.buttons = [];
        this.texts = [];
        
        
        this.buttons.push( this.createButton(this.world.centerX-250, 570, _options[0], _letters.indexOf(_options[0])>=0, time+300) );
        this.buttons.push( this.createButton(this.world.centerX+ 40, 570, _options[1], _letters.indexOf(_options[1])>=0, time+500) );


        this.texts.push( this.createTextDrag(this.world.centerX-120, 200, _letters[0], _options.indexOf(_letters[0]>= 0), time+600 ) );
        this.texts.push( this.createTextDrag(this.world.centerX+120, 200, _letters[1], _options.indexOf(_letters[1]>= 0), time+600 ) );

    },

    

    initLevel2: function() {

        this.itens = ["computador", "casa", "caneta", "bola"];

        var item = this.getRandomUniqueItem(this.itens, 2);
        
        var _letters = this.createRandomItens(this.errados, 1);
        _letters.push( item );

        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(2);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 540, _letters[0], this.itens.indexOf(_letters[0])>=0, 4500) );
        this.buttons.push( this.createButton(this.world.centerX+120, 540, _letters[1], this.itens.indexOf(_letters[1])>=0, 4500) );


    },

    initLevel3: function() {

        this.itens = ["flor", "mosquito", "sol", "lápis"];

        var item = this.getRandomUniqueItem(this.itens, 3);

        var _letters = this.createRandomItens(this.errados, 1);
        _letters.push( item );


        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(3);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 540, _letters[0], this.itens.indexOf(_letters[0])>=0, 4500) );
        this.buttons.push( this.createButton(this.world.centerX+120, 540, _letters[1], this.itens.indexOf(_letters[1])>=0, 4500) );
    },

    drawPoint:function(cor,x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(cor,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
    },


    onDragWordStart: function(elem) {
        this.initialPos = new Phaser.Point(elem.x, elem.y);

        /*for(var i = 0; i < this.buttons.length; i++) {
            var h2 = (this.buttons[i].children[0].height > 50)?this.buttons[i].children[0].height : 50;
            var p = this.buttons[i].children[0].toGlobal({x:0,y:0});
            var x1 = p.x - this.buttons[i].children[0].width*0.5,
                x2 = p.x + this.buttons[i].children[0].width*0.5,
                //y1 = p.y - (h2+0),
                //y2 = p.y+30;

                y1 = p.y - (h2+20),
                y2 = p.y+20;

                cor=0xff0000; 

                this.drawPoint(cor,x1,y1);
                this.drawPoint(cor,x1,y2);

                cor=0xffff00;

                this.drawPoint(cor,x2,y1);
                this.drawPoint(cor,x2,y2);
        }*/
    },
    onDragWordStop: function(elem) {
        aux = elem.text.toLowerCase();
        if(!elem.isCorrect) {
            console.log("perdeu");
            this.clickWrongButton(elem);
        }

        for(var i = 0; i < this.buttons.length; i++) {

            var h2 = (this.buttons[i].children[0].height > 50)?this.buttons[i].children[0].height : 50;

            var p = this.buttons[i].children[0].toGlobal({x:0,y:0});
            var x1 = p.x - this.buttons[i].children[0].width*0.5,
                x2 = p.x + this.buttons[i].children[0].width*0.5,
                y1 = p.y - (h2+20),
                y2 = p.y+20;



            if(this.input.x > x1 && this.input.x < x2) {
                if(this.input.y > y1 && this.input.y < y2) {

                    console.log(elem.text.toLowerCase(), this.buttons[i].itemName);
                    if(elem.text.toLowerCase() == this.buttons[i].itemName) {
                        console.log("correto");
                        this.clickRightButton(this.buttons[i].x,this.buttons[i].y-this.buttons[i].height-this.buttons[i].children[0].height*0.2, elem);
                    } else {
                        console.log("errado");
                        this.clickWrongButton(elem);
                    }
                }
            }
        }

        this.add.tween(elem).to({x:this.initialPos.x, y: this.initialPos.y}, 200, Phaser.Easing.Linear.None, true);

    },

    playSoundDemo: function(elem) {

        console.log(elem.text);

        if(this.currentAudio == null || !this.currentAudio.isPlaying) {
            this.currentAudio = this.audiosprite.play( elem.text.toUpperCase() );
        }

    },


    createTextDrag: function(x,y, palavra, right, delay) {
        //var aux = palavra.text.toUpperCase();
        var name = this.add.bitmapText(x,y, "JandaManateeSolid", palavra.toUpperCase(), 40);
        name.tint = 0x006276;

        name.inputEnabled = true;

        name.alpha = 0;
        name.x = x-name.width*0.5;
        name.isCorrect = right;

        this.add.tween(name).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, delay).onComplete.add(function() {

            name.input.useHandCursor = true;
            name.input.enableDrag(false, false);
            name.events.onDragStart.add(this.onDragWordStart, this);
            name.events.onDragStop.add(this.onDragWordStop, this);
            name.events.onInputOver.add(this.playSoundDemo, this);

        }, this);

        return name;
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        var _canInteract = false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,900, 'buttonModel', null, this, 0,0,0,0);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,900, 'buttonModel', null, this, 0,0,0,0);

        }


        btn.anchor.set(0.5,1);

        //image = imagem.replace("ú", "u").replace("ã", "a").replace("á", "a");

        var spr = this.add.sprite(0, -110, "sprites", imagem + "1");
        spr.anchor.set(0.5,1);
        if(imagem == "avião") {
            spr.y = -45;
        }
        btn.itemName = imagem;

        btn.addChild(spr);

        if(right) {
            this.currentItem = spr;
        }
        

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({y: y}, 500, Phaser.Easing.Back.Out, true, time).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    // clicar botao correto
    clickRightButton: function(x1,y1,target) {


        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons(true);
        //this.addPoints();
        /* FIXO */

        

        var poeira = this.add.sprite(x1, y1, "poeira");
        poeira.anchor.set(0.5,0.5);
        poeira.animations.add("effect", null, 15, false);

        
        this.currentItem.frameName = (target.text.toLowerCase() + "2");
        poeira.animations.play("effect");


        this.add.tween(this.correctItem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1200);
        this.createDelayTime( 2000, function() {
            this.gotoNextLevel();
        });

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
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.clearButtons(false);
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.sound.play("soundDica");
                this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel(function() {});
                this.showResumo();
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
