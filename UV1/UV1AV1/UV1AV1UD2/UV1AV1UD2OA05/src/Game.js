

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
        this.TEMPO_ERRO2 = 15000;
        this.TEMPO_ERRO1 = 3000;
        this.TEMPO_RESUMO = 14000;
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

        this.pointsByLevel = [0,200,300,500,500];

        this.lives = 2;
        this.points = 0;
        this.isWrong = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();
        this.timeSound = 0;
        this.mov=[];


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

        this.registrarConclusao();
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

        this.createDelayTime( 11000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        var tutorialText = this.add.sprite( this.world.centerX-160, 40, 'initialText');
        
        var tutorialText2 = this.add.sprite( this.world.centerX+20, 120, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        this.groupIntro.add(tutorialText2);

        var intro = this.add.sprite(this.world.centerX-300, this.world.centerY-100, 'introExemplo');
        intro.alpha = 0;

        this.groupIntro.add(intro);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( 11000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
            //cria a animação dos bichinhos
            this.createDelayTime( 4000, function() {
                this.add.tween(intro).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
                this.add.sprite(this.world.centerX-300, this.world.centerY-100, 'introExemplo');
                intro.animations.add('idle', null, 18, false);
                intro.animations.play('idle');
                intro.scale.set( 1, 1);
            });
        });

        //Oculta tudo da tela
        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
            this.add.tween(intro).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true);
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
        this.soundResumo = this.sound.play("soundResumo");
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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 12000);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 12500).onComplete.add(function() {
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

    showEndButtons: function() {

        /************************ b1 ******************************/
        var b1 = this.createEndButton(70,540,1);

        var i1 = this.add.sprite(0,-10,"hudVitoria", "vitoriaSetaCima");
        i1.anchor.set(0.5,0.5);
        i1.alpha = 0;
        b1.addChild(i1);
        this.add.tween(i1).to({alpha: 1, y: -40}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);

        var t1 = this.add.bitmapText(0,0, "JandaManateeSolid", "0", 40);
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

        var t2 = this.add.bitmapText(0,0, "JandaManateeSolid", "0", 40);
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

    // botoes auxiliar-fixa
    clearButtons: function() {
        this.add.tween(this.bicho1).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.bicho2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.bicho3).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        this.hideLevel(function() {
            console.log("Level atual: "+this.currentLevel);
            console.log("Acertos atuais: "+this.corrects);

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {
                    //this.isWrong = true;
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.add.tween(this.placar).to({y: -80}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    });
                } else {
                    this.add.tween(this.placar).to({y: -80}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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
        this.add.sprite( -632.90, -229.25, 'background');
    },

    // resumo inicial
    showTextResumo: function() {
        var resumoAlto = this.add.sprite( this.world.centerX-100, this.world.centerY-300, 'resumoAlto');
        resumoAlto.alpha = 0;
        this.add.tween(resumoAlto).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 1000);

        this.groupIntro.add(resumoAlto);

        var resumoBaixo = this.add.sprite( this.world.centerX-80, this.world.centerY-270, 'resumoBaixo');
        resumoBaixo.alpha = 0;
        this.add.tween(resumoBaixo).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000);

        this.groupIntro.add(resumoBaixo);
        
        this.createDelayTime( 7500, function() {
            this.add.tween(resumoBaixo).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(resumoAlto).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.animation1 = this.add.sprite(this.world.centerX-150, this.world.centerY-300, 'resumoExemplo');
            var _intervalo = [];
            for(var i=75; i<153; i++){
                _intervalo.push(i);
            }

            this.groupIntro.add(this.animation1);

            this.animation1.animations.add('idle', _intervalo, 18, false);
            this.animation1.animations.play('idle');
            this.animation1.scale.set( 1, 1);
        });

        this.createDelayTime( this.TEMPO_RESUMO, function() {
            this.add.tween(this.animation1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.hideResumo();
        });
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();
        
        switch(this.currentLevel) {
            case 1:
                if(!this.isWrong) {
                    this.sound.play("soundP1");
                    this.timeSound=6000;
                }
                this.initLevelModel(["roboP1"], ["roboM1", "roboM2"],["roboG1", "roboG2"], 3);
            break;
            case 2:
                if(this.repeatLevel2 == 1){
                    if(!this.isWrong) {
                        this.sound.play("soundP3");
                        this.timeSound=11000;
                    }
                    this.initLevelModel(["roboG1", "roboG2"], ["roboM1", "roboM2"], ["roboP1"], 3);
                }else{
                    if(!this.isWrong) {
                        this.sound.play("soundP2");
                        this.timeSound=9000;
                    }
                    this.initLevelModel(["detetiveG1", "detetiveG2"], ["detetiveP1"],["detetiveM2"], 3);
                }
            break;
            case 3:
                if(!this.isWrong) {
                    this.sound.play("soundP4");
                    this.timeSound=9000;
                }
                this.initLevelModel(["detetiveM2", "roboM2"],["detetiveP1", "roboP1"],["detetiveG1", "detetiveG2", "roboG1", "roboG2","detetiveM1", "roboM1"],3);
            break;
            default:
                this.timeSound=0;
            break;


        }

        this.isWrong = false;
    },

    showQuestion: function(num) {
        if(this.currentLevel == 2){
            if(this.repeatLevel2 == 1){
                this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta3");
            }else{
                this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta2");
            }
        }else if(this.currentLevel == 3){
            this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta4");
        }else{
            this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta1");
        }

        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.isWrong) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    hideQuestion: function() {

    },

    resetNumbers: function() {
        if(this.movableNumbers != null && this.movableNumbers.length > 0) {
            for(var i = 0; i < this.movableNumbers.length; i++) {
                this.movableNumbers[i].destroy();
            }
        }
    },

    // level-fixa
    gotoNextLevel: function() {
        if(this.currentLevel == 2 && (!this.repeatLevel2 || this.repeatLevel2 == 0)){
            this.repeatLevel2 = 1;
            this.currentLevel = 2;
        } else {
            this.currentLevel++;
            this.repeatLevel2 = 0;
        }
        this.hideAndShowLevel(false);
    },

    clickRightButton: function() {
        if(this.currentLevel == 2){
            if(this.repeatLevel2 == 1){
                this.corrects++;
                this.saveCorrect();
                //this.repeatLevel2 = 0;
            }
        }else{
            this.corrects++;
            this.saveCorrect();
        }

        /* FIXO */
        
        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons();
        //this.addPoints();
        /* FIXO */

        this.gotoNextLevel();
        //this.showCorrectName(true);
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
        this.clearButtons(false);
        
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

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            itens.splice(n,1);
        }
        return _itens;
    },

    //inicia as perguntas
    initLevelModel: function(primeiro, segundo, terceiro, jogadas) {
        //if(!this.jogadasAtuais || this.jogadasAtuais == 0){
            this.jogadasAtuais = jogadas;
        //}
        //if(!this.acertosTotais || this.acertosTotais == 0){
            this.acertosTotais = jogadas;
        //}

        //variáveis para verificar se já tem bicho na base
        this.noEmptyBase1 = false;
        this.noEmptyBase2 = false;
        this.noEmptyBase3 = false;

        console.log(primeiro, segundo, terceiro);
        
        this.primeiroAtual = this.createRandomItens(primeiro, 1);
        this.segundoAtual = this.createRandomItens(segundo, 1);
        this.terceiroAtual = this.createRandomItens(terceiro, 1);

        console.log(this.primeiroAtual, this.segundoAtual, this.terceiroAtual);

        var _letters = [];
        _letters.push(this.primeiroAtual);
        _letters.push(this.segundoAtual);
        _letters.push(this.terceiroAtual);
        

        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(this.currentLevel);
        this.createNumberRuler(_letters);
        this.createDelayTime(this.timeSound, function() {   
            this.liberarMovimento(_letters);
        }); 
    },

    drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
    },

    

    onStopDragBicho: function(elem) {
        if(this.base1.overlap(elem)){
            if((this.input.x >= this.posicao[0][0] && this.input.x <= this.posicao[0][1]) && !(this.noEmptyBase1)) {
                this.add.tween(elem).to({x: 250, y: 400}, 300, Phaser.Easing.Linear.None, true);
                elem.inputEnabled = false;
                this.acertosAtuais++;
                this.jogadasAtuais--;
                this.noEmptyBase1 = true;

                console.log(elem.key, this.primeiroAtual);

                if(elem.key == this.primeiroAtual){
                    this.acertosTotais--;
                    console.log("certo");}
                    else {
                        this.sound.play("hitErro");
                        this.clickWrongButton();
                        this.acertosTotais--;
                    }
            }else{
                this.sound.play("hitErro");
                this.moveBack(elem);
            }
        }else if((this.input.x >= this.posicao[1][0] && this.input.x <= this.posicao[1][1]) && !(this.noEmptyBase2)) {
            if(!(this.noEmptyBase2)) {
                this.add.tween(elem).to({x: 470, y: 400}, 300, Phaser.Easing.Linear.None, true);
                elem.inputEnabled = false;
                this.acertosAtuais++;
                this.jogadasAtuais--;
                this.noEmptyBase2 = true;

                console.log(elem.key, this.segundoAtual);

                if(elem.key == this.segundoAtual){
                    this.acertosTotais--;
                    console.log("certo");}
                    else{
                        this.sound.play("hitErro");
                        this.clickWrongButton();
                        console.log("errado");
                        this.acertosTotais--;
                    }

            }else{
                this.sound.play("hitErro");
                this.moveBack(elem);
            }
        }else if((this.input.x >= this.posicao[2][0] && this.input.x <= this.posicao[2][1]) && !(this.noEmptyBase3)) {
            if(!(this.noEmptyBase3)) {
                this.add.tween(elem).to({x: 685, y: 400}, 300, Phaser.Easing.Linear.None, true);
                elem.inputEnabled = false;
                this.acertosAtuais++;
                this.jogadasAtuais--;
                this.noEmptyBase3 = true;

                console.log(elem.key, this.terceiroAtual);

                if(elem.key == this.terceiroAtual){
                    this.acertosTotais--;
                    console.log("certo");}
                    else{
                        this.sound.play("hitErro");
                        this.clickWrongButton();
                        console.log("errado");
                        this.acertosTotais--;
                        }
            }   else  {
                this.sound.play("hitErro");
                console.log("errado");

                }
        }else{
            console.log("errado")
            this.sound.play("hitErro");
            this.moveBack(elem);
        }

        /*
        if((elem.key == this.primeiroAtual) && (this.base1.overlap(elem))){
            this.acertosTotais--;
            console.log("certo");
        }else if((elem.key == this.segundoAtual) && (this.base2.overlap(elem))){
            this.acertosTotais--;
            console.log("certo");
        }else if((elem.key == this.terceiroAtual) && (this.base3.overlap(elem))){
            this.acertosTotais--;
            console.log("certo");
        }*/

        console.log(this.acertosTotais, this.acertosTotais);

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

    liberarMovimento:function(list){
         for(var i = 0; i <= list.length-1; i++) {
            this.mov[i].inputEnabled = true;
            this.mov[i].input.enableDrag(false, true);
            this.mov[i].events.onDragStart.add(this.onStartDragNumber, this);
            this.mov[i].events.onDragStop.add(this.onStopDragBicho, this);  
         }
    },

    createNumberRuler: function(list) {
        this.createBase();

        console.log( list[0], list[1], list[2] );

        // meio
        this.mov[1] = this.add.sprite(this.world.centerX+50, this.world.centerY+280, list[1]);
        this.bicho2 = this.mov[1];

        // esq
        this.mov[0] = this.add.sprite(this.world.centerX+50, this.world.centerY+280, list[0]);
        this.mov[0].x = this.world.centerX-((this.bicho2.width * 0.5)+(this.mov[1].width - 10));
        this.bicho1 = this.mov[0];

        // dir
        this.mov[2]= this.add.sprite(this.world.centerX+50, this.world.centerY+280, list[2]);
        this.mov[2].x = this.world.centerX-((this.bicho2.width * 0.5)+(this.mov[2].width - 500));
        this.bicho3 = this.mov[2];
    
        for(var i = 0; i < 3; i++) {
            this.mov[i].anchor.set(0.5,1);

            this.mov[i].animations.add('idle', null, 18, true);
            this.mov[i].animations.play('idle');
        }
    },

    onStartDragNumber: function(elem) {
        this.initialLetterPos = new Phaser.Point(elem.x, elem.y);
    },

    onStartDragBicho: function(elem) {
        this.initialLetterPos = new Phaser.Point(elem.x, elem.y);
    },

    createBase: function() {
        console.log("*** createBase ***");
        this.base1 = this.add.sprite(this.world.centerX-340, 360, 'base');
        this.base2 = this.add.sprite(this.world.centerX-120, 360, 'base');
        this.base3 = this.add.sprite(this.world.centerX+100, 360, 'base');

        //console.log(this.base1);

        this.posicao = new Array(0,1,2);
        this.posicao[0] = new Array(180,330);
        this.posicao[1] = new Array(405,550);
        this.posicao[2] = new Array(620,770);

        //this.drawPoint(this.posicao[0][0],360);
        //this.drawPoint(this.posicao[0][1],360);

        //this.drawPoint(this.posicao[1][0],360);
        //this.drawPoint(this.posicao[1][1],360);

        //this.drawPoint(this.posicao[2][0],360);
        //this.drawPoint(this.posicao[2][1],360);

        this.elementsPosition = {
            "base1":   [314,390,239,409,213,381],
            "base2":   [524,404,433,408,433,384],
            "base3":   [756,396,650,411,645,382],
        };
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

    update: function () {



    }
};
