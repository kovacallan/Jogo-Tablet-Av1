
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

};

BasicGame.Game.prototype = {


    create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TOTAL_LEVEL = 3;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 30000;
        this.TEMPO_ERRO1 = 8000;
        this.TEMPO_RESUMO = 14000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 30;
        this.UNDERLINE_SPACING = 5;
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
		this.clickable = true;


        this.createScene();

        this.showIntro();
        //this.gameOverMacaco();

        /* REMOVE INTRO E INICIA JOGO DIRETO */
        //this.initGame();

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
        if(elem.key == "amarelo"){
            this.outButton = this.add.sprite(this.world.centerX+140, this.world.centerY-15, 'amareloHover', 0, this.groupButtons);
        }else if(elem.key == "azul"){
            this.outButton = this.add.sprite(this.world.centerX+140, this.world.centerY+80, 'azulHover', 0, this.groupButtons);
        }else if(elem.key == "verde"){
            this.outButton = this.add.sprite(this.world.centerX-140, this.world.centerY-12, 'verdeHover', 0, this.groupButtons);
        }else if(elem.key == "vermelho"){
            this.outButton = this.add.sprite(this.world.centerX-142, this.world.centerY+83, 'vermelhoHover', 0, this.groupButtons);
        }

        this.add.tween("this."+elem.key).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        this.outButton.anchor.set(0.5, 0.5);
    },

    //fixa
    onButtonOut: function(elem) {
        this.add.tween("this."+elem.key).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.outButton).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
    },

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            if(this.currentLevel == 2 || this.currentLevel == 3){
                if(i == 2){
                    //adiciona dois itens da mesma cor
                    _itens.push(itens[n]);
                }
            }
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

        this.createDelayTime( 6500, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        var tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        var tutorialText2 = this.add.sprite( this.world.centerX, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        this.groupIntro.add(tutorialText2);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( 6500, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

            this.createDelayTime( 10000, function() {
                this.animation1 = this.add.sprite(this.world.centerX-283, this.world.centerY-50, 'introExemplo');

                this.groupIntro.add(this.animation1);
                this.animation1.animations.add('idle', null, 18, false);
                this.animation1.animations.play('idle');
                this.animation1.scale.set( 1, 1);
            });
        });

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.animation1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {

                this.initGame();

            }, this);
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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 4000);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 4500).onComplete.add(function() {
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
        this.showNextLevel();
    },

    // botoes auxiliar-fixa
    clearButtons: function() {
        for(var i = 0; i < this.buttons.length; i++) {
            this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                elem.destroy();
            })
        }
    },

    // level-fixa
    gotoNextLevel: function() {
        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        //this.hideLevel(function() {
        console.log(this.corrects);
        if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
            if(isWrong) {
                this.isWrong = true;
                this.createDelayTime( this.TEMPO_ERRO1, function() {
                    this.showNextLevel();
                });
            } else {
                this.showNextLevel();
            }
        } else {
            this.gameOverMacaco();
        }
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
        this.add.sprite( 0, 0, 'background');
        this.juninhoFixo = this.createAnimation( 20, 280, 'juninhoFixo', 1,1);

        this.groupButtons = this.add.group();

        this.polyFixo = this.createAnimation( 750, 310, 'polyFixo', 1,1);
    },

    comemoracaoPersonagens: function() {
        this.add.tween(this.juninhoFixo).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
        this.add.tween(this.polyFixo).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);

        this.juninhoCom = this.createAnimation( 20, 280, 'juninhoCom', 1,1);
        this.polyCom = this.createAnimation( 750, 310, 'polyCom', 1,1);

        this.createDelayTime(2500, function() {
            this.add.tween(this.juninhoCom).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.add.tween(this.polyCom).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.juninhoFixo = this.createAnimation( 20, 280, 'juninhoFixo', 1,1);
            this.polyFixo = this.createAnimation( 750, 310, 'polyFixo', 1,1);
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
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.hideResumo, this);
        });
    },


    showCorApagada: function() {
        this.amarelo = this.add.sprite( this.world.centerX+140, this.world.centerY-15, 'amarelo', 0, this.groupButtons);
        this.azul = this.add.sprite( this.world.centerX+140, this.world.centerY+80, 'azul', 0, this.groupButtons);
        this.verde = this.add.sprite( this.world.centerX-140, this.world.centerY-12, 'verde', 0, this.groupButtons);
        this.vermelho = this.add.sprite( this.world.centerX-142, this.world.centerY+83, 'vermelho', 0, this.groupButtons);
        
        this.amarelo.anchor.set(0.5, 0.5);
        this.azul.anchor.set(0.5, 0.5);
        this.vermelho.anchor.set(0.5, 0.5);
        this.verde.anchor.set(0.5, 0.5);
    },

    ocultaCoresApagadas: function(){
        this.add.tween(this.amarelo).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.azul).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.verde).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.vermelho).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
    },

    tocaSom: function(som) {
        this.currentSound = this.sound.play(som);
        var corAtual = "";

        if(som == "azulHover"){
            corAtual = this.add.sprite( this.world.centerX+140, this.world.centerY+80, som, 0, this.groupButtons);
        }else if(som == "amareloHover"){
            corAtual = this.add.sprite( this.world.centerX+140, this.world.centerY-15, som, 0, this.groupButtons);
        }else if(som == "verdeHover"){
            corAtual = this.add.sprite( this.world.centerX-140, this.world.centerY-12, som, 0, this.groupButtons);
        }else if(som == "vermelhoHover"){
            corAtual = this.add.sprite( this.world.centerX-142, this.world.centerY+83, som, 0, this.groupButtons);
        }

        corAtual.anchor.set(0.5, 0.5);

        this.createDelayTime(1000, function() {
            this.add.tween(corAtual).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        });
    },


    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        this.showCorApagada();

        switch(this.currentLevel) {
            case 1:
                if(!this.tocaDica || this.tocaDica == 0) {
                    this.currentSound = this.sound.play("soundP");
                    this.initLevel1((this.isWrong)?500:6300);
                }else{
                    this.initLevel1((this.isWrong)?500:2000);
                }
                
            break;
            case 2:
                this.initLevel2((this.isWrong)?500:2000);
            break;
            case 3:
                this.initLevel3((this.isWrong)?500:2000);
            break;
        }
        this.isWrong = false;
    },

    initLevel1: function(delay) {
        this.qtdJogadas = 2; //1 a menos, pois começa a contar do zero

        this.todasCores = ['azulHover','amareloHover','verdeHover','vermelhoHover'];
        this.coresLevel = this.createRandomItens(this.todasCores, 3);

        this.createDelayTime(delay, function() {
            this.tocaSom(this.coresLevel[0]);
            this.createDelayTime(1500, function() {
                this.tocaSom(this.coresLevel[1]);
                this.createDelayTime(1500, function() {
                    this.tocaSom(this.coresLevel[2]);
                });
            });
        });
        
        this.createDelayTime(8500, function() {
            this.ocultaCoresApagadas();
            this.qtdClique = 0;

            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX+140, this.world.centerY-15, "amarelo", 100));
            this.buttons.push(this.createButton(this.world.centerX+140, this.world.centerY+80, "azul", 100));
            this.buttons.push(this.createButton(this.world.centerX-140, this.world.centerY-12, "verde", 100));
            this.buttons.push(this.createButton(this.world.centerX-142, this.world.centerY+83, "vermelho", 100));
        });
    },

    initLevel2: function(delay) {
        this.qtdJogadas = 3; //1 a menos, pois começa a contar do zero

        this.todasCores = ['azulHover','amareloHover','verdeHover','vermelhoHover'];
        this.coresLevel = this.createRandomItens(this.todasCores, 3);
        
        this.createDelayTime(delay, function() {
            this.tocaSom(this.coresLevel[0]);
            this.createDelayTime(1500, function() {
                this.tocaSom(this.coresLevel[1]);
                this.createDelayTime(1500, function() {
                    this.tocaSom(this.coresLevel[2]);
                    this.createDelayTime(1500, function() {
                        this.tocaSom(this.coresLevel[3]);
                    });
                });
            });
        });
        
        this.createDelayTime(1000, function() {
            this.ocultaCoresApagadas();
            this.qtdClique = 0;

            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX+140, this.world.centerY-15, "amarelo", 100));
            this.buttons.push(this.createButton(this.world.centerX+140, this.world.centerY+80, "azul", 100));
            this.buttons.push(this.createButton(this.world.centerX-140, this.world.centerY-12, "verde", 100));
            this.buttons.push(this.createButton(this.world.centerX-142, this.world.centerY+83, "vermelho", 100));
        });
    },

    initLevel3: function(delay) {
        this.qtdJogadas = 4; //1 a menos, pois começa a contar do zero

        this.todasCores = ['azulHover','amareloHover','verdeHover','vermelhoHover'];
        this.coresLevel = this.createRandomItens(this.todasCores, 4);
        
        this.createDelayTime(delay, function() {
            this.tocaSom(this.coresLevel[0]);
            this.createDelayTime(1500, function() {
                this.tocaSom(this.coresLevel[1]);
                this.createDelayTime(1500, function() {
                    this.tocaSom(this.coresLevel[2]);
                    this.createDelayTime(1500, function() {
                        this.tocaSom(this.coresLevel[3]);
                        this.createDelayTime(1500, function() {
                            this.tocaSom(this.coresLevel[4]);
                        });
                    });
                });
            });
        });
        
        this.createDelayTime(12000, function() {
            this.ocultaCoresApagadas();
            this.qtdClique = 0;

            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX+140, this.world.centerY-15, "amarelo", 100));
            this.buttons.push(this.createButton(this.world.centerX+140, this.world.centerY+80, "azul", 100));
            this.buttons.push(this.createButton(this.world.centerX-140, this.world.centerY-12, "verde", 100));
            this.buttons.push(this.createButton(this.world.centerX-142, this.world.centerY+83, "vermelho", 100));
        });
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, time, canInteract) {
        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;

        var btn;
        btn = this.add.button(x,y, imagem, (_canInteract)?this.verificaClick:null, this, 0,0,0,0, this.groupButtons);
        
        btn.anchor.set(0.5,0.5);
        btn.alpha = 0;
        btn.scale.set(1,1);

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, time).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },


    verificaClick: function(botao){
		if(this.clickable && !this.liberaClick){
			if((String(botao.key).substr(0,4)) == (String(this.coresLevel[this.qtdClique]).substr(0,4)) && this.clickable ){
				this.sound.play("hitAcerto");
				if(this.qtdClique == this.qtdJogadas){ //quantidade de jogadas em cada nível
					this.clickRightButton();
				}
				this.clickable = false;
			}else{
				this.clickWrongButton();
			}
			this.qtdClique++;
			this.clickable = false;
			this.liberaClick = true;
		}
    },


    // clicar botao correto
    clickRightButton: function(botao) {
        this.showCorApagada();
        /* FIXO */
        this.corrects++;
        this.saveCorrect();

        this.sound.play("hitAcerto");
        this.clearButtons();
        //this.addPoints();
        /* FIXO */

        this.comemoracaoPersonagens();
        this.createDelayTime(3000, function() {
            this.gotoNextLevel();
        });
    },

    // clicar botao errado
    clickWrongButton: function(target) {
        this.showCorApagada();
        /* FIXO */
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;

        this.sound.play("hitErro");
        this.clearButtons();
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.sound.play("soundDica");
                this.tocaDica = 1;
                this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.showResumo();
            break;
            default: // game over
            break;
        }
        this.updateLivesText();
        /* /FIXO */
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        


    update: function () {
	
		if(this.liberaClick && !this.clickable){
			this.createDelayTime(500,function(){
				this.clickable = true;
			},this);
			this.liberaClick = false;
		}
		
    }
};
