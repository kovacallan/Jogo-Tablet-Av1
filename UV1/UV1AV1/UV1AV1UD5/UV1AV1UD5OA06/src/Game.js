
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
        this.TEMPO_INTRO = 41000;
        this.TEMPO_ERRO1 = 10000;
        this.TEMPO_RESUMO = 25000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
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

    showKim: function(delay) {
        var kim = this.add.sprite(this.world.centerX-320, 0, 'kim');

        var fIntro = Phaser.Animation.generateFrameNames("kim_", 0, 14, "", 3);
        var fLoop = Phaser.Animation.generateFrameNames("kim_", 15, 84, "", 3);

        kim.animations.add('intro', fIntro, 18, false);
        kim.animations.add('loop', fLoop, 18, true);

        kim.animations.play('intro').onComplete.add(function() {

            kim.animations.play('loop');
        }, this);

        this.groupIntro.add(kim);

         this.createDelayTime( 8000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });

        return kim;
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

        this.createDelayTime( 8000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            
            this.animation1 = this.add.sprite(this.world.centerX-230, 20, 'introExemplo');
            var _intervalo = [];
            var _intervalo2 = [];
            for(var i=0; i<99; i++){
                _intervalo.push(i);
            }
            for(var i=100; i<264; i++){
                _intervalo2.push(i);
            }

            this.add.tween(this.tutorialPlacar).to({y: -10}, 1000, Phaser.Easing.Linear.None, true, 500);
            this.groupIntro.add(this.animation1);
            this.animation1.animations.add('anim1', [0], 18, false);
            this.animation1.animations.add('anim2', _intervalo, 18, false);
            this.animation1.animations.add('anim3', _intervalo2, 18, false);
            this.animation1.animations.play('anim1');

            this.createDelayTime(8000, function() {
                this.animation1.animations.play('anim2');
            });          

            this.createDelayTime(21000, function() {
                
                this.animation1.animations.play('anim3');
                this.animation1.scale.set( 1, 1);
            }); 
        });

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);
            this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
            this.placar.anchor.set(0.5,0);
            this.add.tween(this.animation1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.initGame();
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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 11000);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 11500).onComplete.add(function() {
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
        this.add.tween(this.placar).to({y: -80}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // limpar tela
    clearTela: function() {
        for(var i = 0; i < this.itensTela.length; i++) {
            this.add.tween(this.itensTela[i]).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
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
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                        this.isWrong = true;
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

    limparNomes: function() {
        for(var i = 0; i < this.nameShadows.length; i++) {
            //if(this.nameShadows[i] != null){
                this.nameShadows[i].destroy();
                //}
            if(this.nameTexts[i] != null){
            this.nameTexts[i].destroy();}
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.groupName = this.add.group();
    },    

    addLetter: function(x,y, letter) {
        var shadow = "";
        //var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 36);
        //shadow.tint = 0x003568;
        //this.load.bitmapFont('JandaManateeSolid', '../../../../GLOBAL/font/janda.png', "../../../../GLOBAL/font/janda.fnt");
        var name = this.add.bitmapText(x,y, "Janda", letter, 36);
        name.tint = 0x003568;

        //shadow.x = x+4-shadow.width*0.5;
        name.x = x-name.width*0.5;

        //this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        //this.groupName.add(shadow);
        this.groupName.add(name);

        this.itensTela.push(name);

        return [name,shadow];
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

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        this.itensTela = [];
        this.jogadasAtuais=2;
        this.acertosTotais=2;

        switch(this.currentLevel) {
            case 1:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP1");
                }
                this.initLevel1((this.isWrong)?500:10000);
            break;
            case 2:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP2");
                }
                this.initLevel2((this.isWrong)?500:8500);
            break;
            case 3:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP3");
                }
                this.initLevel3((this.isWrong)?500:4000);
            break;
        }
        this.isWrong = false;
    },

    

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 25, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.isWrong) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    preparaPalavra: function(palavra) {
        this.letMaiu = palavra.substr(0,1);
        var remove1 = this.rnd.integerInRange(0,this.letMaiu.length-1);
        
        var name = palavra.replace(this.letMaiu[remove1], "_");

        return name;
    },

    preparaPalavra2: function(palavra) {
        this.letMin = palavra.substr(0,1);
        var remove1 = this.rnd.integerInRange(0,this.letMin.length-1);
        
        var name = palavra.replace(this.letMin[remove1], "_");
        
        //this.spliceLetter[2].push(this.letMin[remove1]);
        return name;
    },

    preparaPalavraErro: function(palavra) {
        var letra = palavra.substr(0,1);
        var remove1 = this.rnd.integerInRange(0,letra.length-1);
        
        var name = palavra.replace(letra[remove1], "_");
        
        //this.spliceLetter[2].push(letra[remove1]);
        return name;
    },

    montaPalavra: function(palavra, letra) {
        var name = palavra.replace("_", letra);
        return name;
    },

    showName: function(name, valX, valY) {
        this.LETTER_SPACING = 24;
        this.UNDERLINE_SPACING = 18;

        for(var i = 0; i < name.length; i++) {
            var px = valX + i*this.LETTER_SPACING;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            var lastLetter = this.addLetter(px,py+valY, name[i]);
            var nSize = lastLetter[0].width;
            if(name[i] == "_") {
                this.nameCorrectPos = px+260;
                var lSize = this.add.bitmapText(0,0, "Janda", this.maiuscula[i], 100);
                nSize = lSize.width;
                lSize.destroy();
                lastLetter[0].x += nSize*0.5 - lastLetter[0].width*1.5;
                lastLetter[1].x += nSize*0.5 - lastLetter[1].width*1.5;
            }
        }
    },

    showBgPalavra: function(valX, valY) {
        
    },

    initLevel1: function(delay) {
        this.itMaisc = ['Polly','Fred','Juninho'];

        this.maiuscula = String(this.createRandomItens(this.itMaisc, 1));

        if(this.maiuscula == "Polly"){
            this.minuscula = "pente";
        }else if(this.maiuscula == "Fred"){
            this.minuscula = "folha";
        }else if(this.maiuscula == "Juninho"){
            this.minuscula = "janela";
        }
        
        this.base1 = this.add.sprite(900, 350, 'bgPalavra');
        this.base1.anchor.set(1,1);

        this.base2 = this.add.sprite(480, 350, 'bgPalavra');
        this.base2.anchor.set(1,1);

        this.limparNomes();

        this.name1 = this.preparaPalavra(this.maiuscula);
        this.name2 = this.preparaPalavra2(this.minuscula);

        this.showQuestion(1);
        this.itensTela.push(this.base1);
        this.itensTela.push(this.base2);

        this.showName(this.name1, 595, 265);
        this.showName(this.name2, 210, 265);

        this.createDelayTime( delay, function() {
            this.createNumberRuler();
        });
    },

    initLevel2: function(delay) {
        this.itMaisc = ['Bumba','Caburé','Mocho'];

        this.maiuscula = String(this.createRandomItens(this.itMaisc, 1));

        if(this.maiuscula == "Bumba"){
            this.minuscula = "balão";
            this.itErrado = "ponte";
        }else if(this.maiuscula == "Caburé"){
            this.minuscula = "coruja";
            this.itErrado = "queijo";
        }else if(this.maiuscula == "Mocho"){
            this.minuscula = "música";
            this.itErrado = "neve";
        }

        this.base1 = this.add.sprite(900, 350, 'bgPalavra');
        this.base1.anchor.set(1,1);

        this.base2 = this.add.sprite(480, 350, 'bgPalavra');
        this.base2.anchor.set(1,1);
        
        this.base3 = this.add.sprite(900, 480, 'bgPalavra');
        this.base3.anchor.set(1,1);
        
        this.limparNomes();

        this.name1 = this.preparaPalavra(this.maiuscula);
        this.name2 = this.preparaPalavra2(this.minuscula);
        this.name3 = this.preparaPalavraErro(this.itErrado);

        this.showQuestion(2);

        this.showName(this.name1, 595, 265);
        this.showName(this.name2, 210, 265);
        this.showName(this.name3, 595, 395);

        this.itensTela.push(this.base1);
        this.itensTela.push(this.base2);
        this.itensTela.push(this.base3);

        this.createDelayTime( delay, function() {
            this.createNumberRuler();
        });
    },

    initLevel3: function(delay) {
        this.itMaisc = ['Inglaterra','Argentina','Brasil'];

        this.maiuscula = String(this.createRandomItens(this.itMaisc, 1));

        if(this.maiuscula == "Inglaterra"){
            this.minuscula = "ilha";
            this.itErrado = 'avião';
            this.itErrado2 = 'escola';
        }else if(this.maiuscula == "Argentina"){
            this.minuscula = "abacaxi";
            this.itErrado = 'escova';
            this.itErrado2 = 'urso';
        }else if(this.maiuscula == "Brasil"){
            this.minuscula = "boneca";
            this.itErrado = 'palito';
            this.itErrado2 = 'flor';
        }
        
        this.base1 = this.add.sprite(900, 350, 'bgPalavra');
        this.base1.anchor.set(1,1);

        this.base2 = this.add.sprite(480, 350, 'bgPalavra');
        this.base2.anchor.set(1,1);
        
        this.base3 = this.add.sprite(900, 480, 'bgPalavra');
        this.base3.anchor.set(1,1);

        this.base4 = this.add.sprite(480, 480, 'bgPalavra');
        this.base4.anchor.set(1,1);

        this.limparNomes();

        this.name1 = this.preparaPalavra(this.maiuscula);
        this.name2 = this.preparaPalavra2(this.minuscula);
        this.name3 = this.preparaPalavraErro(this.itErrado);
        this.name4 = this.preparaPalavraErro(this.itErrado2);

        this.showQuestion(3);

        this.showName(this.name1, 595, 265);
        this.showName(this.name2, 210, 265);
        this.showName(this.name3, 595, 395);
        this.showName(this.name4, 210, 395);

        this.itensTela.push(this.base1);
        this.itensTela.push(this.base2);
        this.itensTela.push(this.base3);
        this.itensTela.push(this.base4);

        this.createDelayTime( delay, function() {
            this.createNumberRuler();
        });
    },

    createLetterRuler: function(x,y,letter) {
        
        var spr = this.add.sprite(x,y);

        var shadow = this.add.bitmapText(0,0, "Janda", letter, 60);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(2,2, "Janda", letter, 60);
        name.tint = 0x0058b0;

        //name.x = x-name.width*0.5+2;
        //shadow.x = x-shadow.width*0.5;
        spr.addChild(shadow);
        spr.addChild(name);
        spr.letra = letter;

        var over = this.add.bitmapText(spr.width*0.5,spr.height*0.5, "Janda", letter, 60);
        over.alpha = 0;
        spr.addChild(over);

        this.itensTela.push(spr);

        spr.inputEnabled = true; 
        spr.input.useHandCursor = true;
        spr.input.enableDrag(false, true);
        spr.events.onDragStart.add(this.onStartDragNumber, this);
        spr.events.onDragStop.add(this.onStopDragBicho, this);

        return spr;
    },

    createNumberRuler: function() {

        console.log(this.letMaiu, this.letMin);
        //var bt1 = this.add.sprite(this.world.centerX-280, this.world.centerY+285, this.letMaiu);
        var bt1 = this.createLetterRuler(this.world.centerX-280, this.world.centerY+200, this.letMaiu);
        
        //var bt2 = this.add.sprite(this.world.centerX-200, this.world.centerY+285, this.letMin);
        var bt2 = this.createLetterRuler(this.world.centerX-200, this.world.centerY+200, this.letMin);
        

    },

    onStartDragNumber: function(elem) {
        this.initialLetterPos = new Phaser.Point(elem.x, elem.y);
    },

    onStopDragBicho: function(elem) {
            if(this.currentLevel == 3){
                if(this.base3.overlap(elem)){
                    this.clickWrongButton();
                }
            }
            if(this.currentLevel == 4){
                if(this.base3.overlap(elem) || this.base4.overlap(elem)){
                    this.clickWrongButton();
                }
            }


            if(this.base1.overlap(elem) && this.letMaiu === elem.letra){
                this.jogadasAtuais--;
                this.acertosTotais--;
                this.sound.play("hitAcerto");

                this.showName(this.maiuscula, 595, 265);
                elem.destroy();
            }else if(this.base2.overlap(elem) && this.letMin === elem.letra){
                this.jogadasAtuais--;
                this.acertosTotais--;
                this.sound.play("hitAcerto");
                this.showName(this.minuscula, 210, 265);
                elem.destroy();
            }else{
                //this.clickWrongButton();
                //elem.destroy();
                this.sound.play("hitErro");
                this.moveBack(elem);
            }

            if(this.jogadasAtuais == 0){
                if(this.acertosTotais == 0){
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

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {
        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn, btn2;
        if(right) {
            btn = this.add.button(x,y, imagem, (_canInteract)?this.clickRightButton:null, this, 0,0,0);
            btn.isCorrect = true;
            this.correctItem = btn;
        } else {
            btn = this.add.button(x,y, imagem, (_canInteract)?this.clickWrongButton:null, this, 0,0,0);
        }

        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.95,0.95);

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

    showCorrectName: function(name) {
        var itens = [];

        for(var i = 0; i < name.length; i++) {
            if(this.nameTexts[i].text == "_") {
                itens = this.addLetter(this.nameCorrectPos, 0, name[i]);
            }
        }

        for(var i = 0; i < itens.length; i++) {
            itens[i].alpha = 0;
            this.add.tween(itens[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
    },

    // clicar botao correto
    clickRightButton: function(botao) {
        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        //this.sound.play("hitAcerto");

        this.createDelayTime(1000, function() {
            this.clearTela();
        });

        //this.addPoints();
        /* FIXO */

        //this.clickEffect(target);

        this.gotoNextLevel();
    },

    // clicar botao errado
    clickWrongButton: function(target) {
        /* FIXO */
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.createDelayTime(500, function() {
            this.clearTela();
        });
        
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
        /* /FIXO */
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        


    update: function () {

    }
};
