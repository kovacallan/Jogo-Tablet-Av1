
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
        this.TEMPO_INTRO = 21000;
        this.TEMPO_ERRO2 = 21000;
        this.TEMPO_ERRO1 = 3000;
        this.TEMPO_RESUMO = 12500;
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

        this.pointsByLevel = [0,200,300,500,500];

        this.lives = 2;
        this.points = 0;
        this.isWrong = false;

        this.audiosprite = this.add.audioSprite("soundItens");

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


        var tutorialText2 = this.add.sprite( this.world.centerX+60, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);


        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( 8000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime(21000, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
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

        this.ball = this.add.group();

        this.placar = this.add.sprite( this.world.centerX, 130, 'balao');
        this.placar.anchor.set(0.5,0.5);
        this.placar.alpha = 0;
        this.placar.scale.set(0.2,0.2);

        this.canClickItem = false;
        this.placar.inputEnabled = true;
        this.placar.events.onInputOver.add(this.onOverName, this);
        this.placar.events.onInputOut.add(this.onOutName, this);

        this.initBubbles();

        this.add.tween(this.placar.scale).to({x: 0.8, y: 0.8}, 1000, Phaser.Easing.Elastic.Out, true, 500);
        this.add.tween(this.placar).to({alpha: 1}, 1000, Phaser.Easing.Elastic.Out, true, 500).onComplete.add(this.showNextLevel, this);
    },

    initBubbles: function() {

        console.log(this.currentLevel);

        var pos = [null,
            [432,280,-1],
            [291,247, 1],
            [691,271,-1]
        ];

        var x = pos[this.currentLevel][0],
            y = pos[this.currentLevel][1],
            m = pos[this.currentLevel][2];




        var s1 = this.add.sprite( x, y, 'ball', 0, this.ball);
        s1.scale.set(0.1,0.1);
        s1.anchor.set(0.5,0.5);

        var s2 = this.add.sprite( x+20*m, y-20, 'ball', 0, this.ball);
        s2.scale.set(0.1,0.1);
        s2.anchor.set(0.5,0.5);

        var s3 = this.add.sprite( x+50*m, y-50, 'ball', 0, this.ball);
        s3.scale.set(0.1,0.1);
        s3.anchor.set(0.5,0.5);

        this.add.tween(s1.scale).to({x: 0.5, y: 0.5}, 300, Phaser.Easing.Elastic.Out, true, 200);
        this.add.tween(s2.scale).to({x: 0.7, y: 0.7}, 300, Phaser.Easing.Elastic.Out, true, 300);
        this.add.tween(s3.scale).to({x:   1, y:   1}, 300, Phaser.Easing.Elastic.Out, true, 400);
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

        this.canClickItem = false;

        this.add.tween(this.balaoItem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.balaoImagem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);


    },

    // level-fixa
    gotoNextLevel: function() {

        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        
        this.add.tween(this.groupName).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.ball.removeAll(true);


        this.add.tween(this.placar.scale).to({x: 0.3, y: 0.3}, 500, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.placar).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {

        this.hideLevel(function() {

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {
                    
                    this.isWrong = true;
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.initBubbles();
                        this.add.tween(this.placar.scale).to({x: 0.8, y: 0.8}, 1000, Phaser.Easing.Elastic.Out, true, 500);
                        this.add.tween(this.placar).to({alpha: 1}, 1000, Phaser.Easing.Elastic.Out, true, 500).onComplete.add(this.showNextLevel, this);
                    });

                } else {
                    this.initBubbles();
                    this.add.tween(this.placar.scale).to({x: 0.8, y: 0.8}, 1000, Phaser.Easing.Elastic.Out, true, 500);
                    this.add.tween(this.placar).to({alpha: 1}, 1000, Phaser.Easing.Elastic.Out, true, 500).onComplete.add(this.showNextLevel, this);
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

        for(var i = 0; i < this.nameTexts.length; i++) {
            this.nameTexts[i].destroy();            
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.groupName = this.add.group();
    },

    showName: function(name) {

        var Ypos = 10;

        this.limparNomes();

        var last = 0;

        for(var i = 0; i < name.length; i++) {

            var px = this.world.centerX - 30 - name.length*25 + last;
            //console.log(px, last);

            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;
            py+=70;

            var lastLetter = this.addLetter(px,py, name[i]);
            var nSize = lastLetter.width;
            if(name[i] == "_") {
                this.nameCorrectPos = px;
                var lSize = this.add.bitmapText(0,0, "JandaManateeSolid", this.nameCorrect[i], 80);
                nSize = lSize.width;
                lSize.destroy();
                lastLetter.x += nSize*0.5 - lastLetter.width*0.5;
            } 
            last += nSize + 10;
        }
    },
    addLetter: function(x,y, letter) {

        var aux = letter.toUpperCase();
        var name = this.add.bitmapText(x,y, "JandaManateeSolid", aux, 75);
        name.tint = 0x0877B6;

        this.nameTexts.push(name);

        this.groupName.add(name);

        return name;
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

        for(var i = 0; i < this.nameCorrect.length; i++) {
            if(this.nameTexts[i].text == "_") {
         
                itens = this.addLetter(this.nameCorrectPos, 70, this.nameCorrect[i]);
            }
        }

        for(var i = 0; i < itens.length; i++) {
            itens[i].alpha = 0;
            this.add.tween(itens[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
        
        
        this.createDelayTime( 2000, function() {
            if(gotoNext) {
                this.gotoNextLevel();
            } else {
                this.hideAndShowLevel(false);
            }
        });
        
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

        this.add.sprite( -453, -75, 'background');
        this.createAnimation( 181, 244, 'fred', 1,1);
        this.createAnimation( 392, 275, 'poly', 1,1);
        this.createAnimation( 620, 283, 'walter', 1,1);

        //this.currentLevel =3;
        
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 160, "dado", true, 100, false) );
        this.buttons.push( this.createButton(this.world.centerX    , 160, "lapis", false, 100, false) );
        this.buttons.push( this.createButton(this.world.centerX+120, 160, "bola", false, 100, false) );

        this.createDelayTime( 4200, function() {
            
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.add.tween(this.arrow).to({x:this.world.centerX-120, y: 150}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);

        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        click.animations.play('idle');

        this.buttons[0].alpha = 0.7;

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
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.placar.scale).to({x: 0.3, y: 0.3}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.placar).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
            
        this.soundResumo = this.sound.play("soundResumo");

        this.createDelayTime(1000, function() {

            this.buttons = [];
            this.buttons.push( this.createButton(this.world.centerX-200, 160, "a", false,  100, false) );
            this.buttons.push( this.createButton(this.world.centerX-100, 160, "e", false,  200, false) );
            this.buttons.push( this.createButton(this.world.centerX    , 160, "i", false,  300, false) );
            this.buttons.push( this.createButton(this.world.centerX+100, 160, "o", false,  400, false) );
            this.buttons.push( this.createButton(this.world.centerX+200, 160, "u", false,  500, false) );

            this.groupIntro.add(this.buttons[0]);
            this.groupIntro.add(this.buttons[1]);
            this.groupIntro.add(this.buttons[2]);
            this.groupIntro.add(this.buttons[3]);
            this.groupIntro.add(this.buttons[4]);
            
            this.createDelayTime(7000, function() {

                this.add.tween(this.buttons[0].scale).to({x:1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
                this.createDelayTime(1000, function() {
                    this.add.tween(this.buttons[1].scale).to({x:1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
                });
                this.createDelayTime(2000, function() {
                    this.add.tween(this.buttons[2].scale).to({x:1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
                });
                this.createDelayTime(3000, function() {
                    this.add.tween(this.buttons[3].scale).to({x:1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
                });
                this.createDelayTime(4000, function() {
                    this.add.tween(this.buttons[4].scale).to({x:1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
                });
            });
            
            this.createDelayTime( 18000, function() {

                this.add.tween(this.buttons[0]).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[1]).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[2]).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[3]).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[4]).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
                this.hideResumo();
            });


        });

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                if(!this.numCorrects || this.numCorrects == 0) {
                    this.numCorrects = 2;
                }

                if(this.numCorrects == 2) {
                    if(!this.isWrong) {
                        this.sound.play("soundP11");
                    }
                    this.initLevelBase(["bala", "mala", "cama"], "a", (this.isWrong)?500:12000);
                } else {
                    if(!this.isWrong) {
                        this.sound.play("soundP12");
                    }
                    this.initLevelBase(["bolo", "lobo", "ovo"], "o", (this.isWrong)?500:4000);
                }
            break;
            case 2:
                if(!this.numCorrects || this.numCorrects == 0) {
                    this.numCorrects = 2;
                }
                if(this.numCorrects == 2) {
                    if(!this.isWrong) {
                        this.sound.play("soundP21");
                    }
                    this.initLevelBase(["luva", "uva", "bule"], "u", (this.isWrong)?500:11000);
                } else {
                    if(!this.isWrong) {
                        this.sound.play("soundP22");
                    }
                    this.initLevelBase(["lixo", "fita", "isca"], "i", (this.isWrong)?500:6000);
                }
            break;
            case 3:
                if(!this.numCorrects || this.numCorrects == 0) {
                    this.numCorrects = 2;
                }
                //this.numCorrects = 2;
                if(this.numCorrects == 2) {
                    if(!this.isWrong) {
                        this.sound.play("soundP31");
                    }
                    //06/11/15 - palavra heroi foi retida pois a fonte não tem o (ó)  e ficava her_
                    this.initLevelBase(["boi", "cílios"], "i", (this.isWrong)?500:8000);
                    //this.initLevelBase(["herói", "herói", "herói"], "i", (this.isWrong)?500:8000);
                } else {
                    if(!this.isWrong) {
                        this.sound.play("soundP32");
                    }
                    this.initLevelBase(["beijo", "pão", "sabão"], "o", (this.isWrong)?500:4000);
                }
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

    showItem: function(item) {
        this.balaoItem = this.add.sprite(this.world.centerX, this.world.centerY-40, "balao");
        this.balaoItem.scale.set(0.6,0.6);
        this.balaoItem.anchor.set(0.5,0.5);

        this.balaoItem.alpha = 0;

        this.balaoImagem = this.add.sprite(0, 0, "sprites", item);
        //this.balaoImagem.scale.set(1,0.9);
        this.balaoImagem.anchor.set(0.5,0.5);
        this.balaoImagem.inputEnabled = true;

        this.balaoItem.addChild(this.balaoImagem);
        //this.balaoImagem.alpha = 0;
        //this.balaoImagem.input.useHandCursor = true;
        //this.balaoImagem.events.onInputOver.add(this.playSoundDemo, this);
    },

    onOverName: function() {
        if(this.canClickItem) {
            //this.add.tween(this.balaoImagem).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.balaoItem).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
            this.playSoundDemo(this.balaoImagem);
        }
    },
    onOutName: function() {
        //this.add.tween(this.balaoImagem).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.balaoItem).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
    },


    playSoundDemo: function(elem) {


        var _nome = elem._frame.name.toString().toUpperCase();

        if(this.currentAudio == null || !this.currentAudio.isPlaying) {
            this.currentAudio = this.audiosprite.play(_nome);
        }
    },

    initLevelBase: function(letras, vogal, time) {

        this.itens = letras;

        var item = this.getRandomUniqueItem(this.itens, 1);
       
        var noAccent = item.replace("ã", "a").replace("í", 'i').replace('ó', 'o');

        console.log(noAccent);

        this.nameCorrect = item;

        this.showItem(noAccent);

        this.createDelayTime(time, function() {
            this.canClickItem = true;
        });

        var letter = vogal;

        var n = item.indexOf(letter);
        var nname = "";
        for(var i = 0; i < item.length; i++) {
            if(i == n) {
                nname += "_";
            } else {
                nname += item[i];
            }
        }

        this.showName(nname);


        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-240, 580, "a", "a"==letter,  time+100) );
        this.buttons.push( this.createButton(this.world.centerX-120, 580, "e", "e"==letter,  time+200) );
        this.buttons.push( this.createButton(this.world.centerX    , 580, "i", "i"==letter,  time+300) );
        this.buttons.push( this.createButton(this.world.centerX+120, 580, "o", "o"==letter,  time+400) );
        this.buttons.push( this.createButton(this.world.centerX+240, 580, "u", "u"==letter,  time+500) );
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'letra_'+imagem, (_canInteract)?this.clickRightButton:null, this, 0,0,0);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'letra_'+imagem, (_canInteract)?this.clickWrongButton:null, this, 0,0,0);

        }

        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, time);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, time).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    // clicar botao correto
    clickRightButton: function(target) {

        if(target.alpha < 1) {
            return;
        }

        this.numCorrects--;

        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons(false);

        if(this.numCorrects <= 0) {
            /* FIXO */
            this.corrects++;
            this.saveCorrect();
            //this.addPoints();
            /* FIXO */
            this.showCorrectName(true);
        } else {
            this.saveCorrect(50, false);
            this.showCorrectName(false);
        }
    },

    // clicar botao errado
    clickWrongButton: function(target) {
        if(target.alpha < 1) {
            return;
        }

        this.numCorrects = 0;

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
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
