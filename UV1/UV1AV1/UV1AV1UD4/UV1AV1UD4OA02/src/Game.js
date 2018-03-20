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
        this.TEMPO_INTRO = 25000;
        this.TEMPO_ERRO2 = 12500;
        this.TEMPO_ERRO1 = 8000;
        this.TEMPO_RESUMO = 21000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 25;
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
		this.clickPermission = true;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();

        this.createScene();

        this.showIntro();

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

    createAnimationStop: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, false);
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
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
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

        this.createDelayTime( 10000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    showBugsIntro: function() {
        this.bugsIntro = [];
        for(i=1; i<=5; i++){
            var b = this.createAnimation( 80 + 120*i,this.world.centerY+30, "animIntro"+i, 1,1);
    
            this.bugsIntro.push(b);
            this.groupIntro.add(b);
        }

        this.createDelayTime(this.TEMPO_INTRO, function() {
            for(i=0; i<5; i++){
                this.add.tween(this.bugsIntro[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            }
        });
    },

    showLetrasResumo: function() {
        this.letrasResumo = [];
        for(i=1; i<=5; i++){
            var a = this.createAnimation( 100 + 120*i,this.world.centerY-250, "letra"+i, 1,1);

            this.letrasResumo.push(a);
            this.groupIntro.add(a);
        }

        this.createDelayTime(14000, function() {
            for(i=0; i<5; i++){
                this.add.tween(this.letrasResumo[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            }

            this.createDelayTime(500, function() {
                this.add.tween(this.letrasResumo[0]).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
                this.add.tween(this.letrasResumo[1]).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 1000);
                this.add.tween(this.letrasResumo[2]).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000);
                this.add.tween(this.letrasResumo[3]).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 3000);
                this.add.tween(this.letrasResumo[4]).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 4000);
            })
        });
    },

    hideLetrasResumo: function() {
        for(i=0; i<5; i++){
            this.add.tween(this.letrasResumo[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }
    },

    // intro-fixa
    showTextoIntro: function() {
        var tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
            tutorialText.alpha = 0;
            tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        
        var palavraIntro = this.add.sprite( this.world.centerX, 110, 'palavraIntro');
            palavraIntro.alpha = 0;
            palavraIntro.anchor.set(0.5, 0.5);

        this.groupIntro.add(palavraIntro);

        var palavraIntroO = this.add.sprite( this.world.centerX-85, 110, 'palavraIntroO');
            palavraIntroO.alpha = 0;
            palavraIntroO.anchor.set(0.5, 0.5);

        this.groupIntro.add(palavraIntroO);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim();
        this.soundIntro = this.sound.play("soundIntro");

        this.showBugsIntro();

        this.createDelayTime(10000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(palavraIntro).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
            this.createDelayTime(2000, function() {
                this.arrow = this.add.sprite(this.world.centerX+120, this.world.centerY+60, "mouseIntro");
                this.arrow.anchor.set(0.5,0.5);

                this.groupIntro.add(this.arrow);

                this.add.tween(this.arrow).to({x:this.world.centerX+130, y: this.world.centerY+125}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showClickEffect,this);
                this.add.tween(this.bugsIntro[3]).to({alpha: 0.5}, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(palavraIntroO).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
            })
        });

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(palavraIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(palavraIntroO).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
        });
    },

    showClickEffect: function() {
        var clique = this.add.sprite(this.world.centerX+100, this.world.centerY+90, 'efeitoClique');
            clique.animations.add('idle', null, 18, false);
            clique.animations.play('idle');
            clique.scale.set(1, 1);
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

    // resumo inicial
    showTextResumo: function() {
        //var textoResumo = this.add.sprite(this.world.centerX-250, 40, 'txtResumo');
        this.showLetrasResumo();

        this.soundResumo = this.sound.play("soundResumo");

        this.createDelayTime( this.TEMPO_RESUMO, function() {
            this.hideLetrasResumo();
            this.hideResumo();
        })
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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 7000);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 7500).onComplete.add(function() {
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

        this.add.tween(this.placar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function(clearCorrect) {
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
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        this.hideLevel(function() {
			this.clickPermission = true;
            console.log(this.corrects);
            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {
                    this.isWrong = true;
                    this.add.tween(this).to({}, this.TEMPO_ERRO1, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        this.showNextLevel();
                    }, this);

                } else {
                    this.add.tween(this.placar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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

    

    showName: function(name) {
        if(name == "CHAPEU" && this.remove1 == null){
            name = "CHAPÉU";
        }

        var Ypos = 10;
        this.limparNomes();

        for(var i = 0; i < name.length; i++) {
            var px = this.world.centerX - name.length*11 + i*this.LETTER_SPACING;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;
            if(name[i] == this.remove1){
                this.addLetterShadow(px,py+245, name[i]);
                this.letra1 = this.remove1;
                this.remove1 = null;
            }else if(name[i] == this.remove2){
                this.addLetterShadow(px,py+245, name[i]);
                this.letra2 = this.remove2;
                this.remove2 = null;
            }else{
                this.addLetter(px,py+245, name[i]);
            }
        }
    },


    showNameLevelD: function(name) {
        var espaco_letra = 20;
        var espaco_underline = 5;

        var Ypos = 10;

        this.limparNomes();
        for(var i = 0; i < name.length; i++) {
            var px = this.world.centerX - name.length*9 + i*espaco_letra;
            var py = (name[i] == "_") ? espaco_underline : 0;

            if(name[i] == this.remove1){
                this.addLetterShadowLevelD(px,py+255, name[i]);
                this.letra1 = this.remove1;
                this.remove1 = null;
            }else if(name[i] == this.remove2){
                this.addLetterShadowLevelD(px,py+255, name[i]);
                this.letra2 = this.remove2;
                this.remove2 = null;
            }else{
                this.addLetterD(px,py+255, name[i]);
            }
        }
    },

    showLetraLevelFM: function(name) {
        var Ypos = 10;
        this.limparNomes();

        console.log("letra 1: "+this.letra1);
        console.log("letra 2: "+this.letra2);

        for(var i = 0; i < name.length; i++) {
            var px = this.world.centerX - name.length*11 + i*this.LETTER_SPACING;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;
            if(name[i] == this.letra1){
                this.addLetter(px,py+245, name[i]);
                this.letra1 = null;
            }else if(name[i] == this.letra2){
                this.addLetterShadow(px,py+245, name[i]);
                this.letra2 = null;
            }else{
                this.addLetter(px,py+245, name[i]);
            }
        }
    },

    showLetraLevelD: function(name) {
        var espaco_letra = 20;
        var espaco_underline = 5;

        var Ypos = 10;
        this.limparNomes();

        for(var i = 0; i < name.length; i++) {
            var px = this.world.centerX - name.length*9 + i*espaco_letra;
            var py = (name[i] == "_") ? this.espaco_underline : 0;
            if(name[i] == this.letra1){
                this.addLetterD(px,py+255, name[i]);
                this.letra1 = null;
            }else if(name[i] == this.letra2){
                this.addLetterShadowLevelD(px,py+255, name[i]);
                this.letra2 = null;
            }else{
                this.addLetterD(px,py+255, name[i]);
            }
        }
    },

    addLetterD: function(x,y, letter) {
        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 25);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 25);

        shadow.x = x+4-shadow.width*0.5;
        name.x = x-name.width*0.5;

        this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        this.groupName.add(shadow);
        this.groupName.add(name);

        return [name,shadow];
    },


    addLetterShadow: function(x,y, letter) {
        var shadow = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 36);
        shadow.tint = 0xCCCCCC;
        shadow.alpha = 0.2;

        shadow.x = x+2-shadow.width*0.5;

        this.nameShadows.push(shadow);

        this.groupName.add(shadow);

        return [name,shadow];
    },

    addLetterShadowLevelD: function(x,y, letter) {
        var shadow = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 25);
        shadow.tint = 0xCCCCCC;
        shadow.alpha = 0.2;

        shadow.x = x+2-shadow.width*0.5;

        this.nameShadows.push(shadow);

        this.groupName.add(shadow);

        return [name,shadow];
    },

    

    addLetter: function(x,y, letter) {
        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 36);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 36);

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

    showCorrectName: function(letra, gotoNext) {
        var itens = [];
        for(var i = 0; i < this.nameCorrect.length; i++) {
            if(this.nameTexts[i].text == "_" && this.nameCorrect[i] == letra) {
                itens = this.addLetter(this.nameCorrectPos, 0, this.nameCorrect[i]);
            }
        }

        for(var i = 0; i < itens.length; i++) {
            itens[i].alpha = 0;
            this.add.tween(itens[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
        
        if(gotoNext) {
            this.add.tween(this.nameAtual).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.gotoNextLevel, this);
            //this.add.tween(this).to({}, 500, Phaser.Easing.Linear.None, true, 1500).onComplete.add(this.gotoNextLevel, this);
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

        this.listNumbers = [];
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP1");
                }
                this.initLevel1((this.isWrong)?500:7000);
            break;
            case 2:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP2");
                }
                this.initLevel2((this.isWrong)?500:5500);
            break;
            case 3:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP3");
                }
                this.initLevel3((this.isWrong)?500:10500);
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

    stopSfx: function() {
        if(this.currentSound != null) {
            this.currentSound.stop();
        }
    },

    initLevel1: function(delay) {
        this.itens = ['DIA','TERRA','BOLA'];

        this.nameCorrect = String(this.createRandomItens(this.itens, 1));

        var letters = this.getNonRepeatLetter(1, this.nameCorrect);
        var letRemove1 = this.rnd.integerInRange(0,letters.length-1);
        this.remove1 = letters[letRemove1];
        //console.log(letters[this.remove1]);
        //this.nameAtual = this.nameCorrect.replace(letters[remove1], "_");

        this.nameAtual = this.nameCorrect;
        this.spliceLetter[1].push(letRemove1);

        this.showQuestion(1);
        this.showName(this.nameAtual);

        this.createDelayTime(delay, function() {
            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX-300, 550, "btA", ("btA".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX-160, 550, "btE", ("btE".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX, 550, "btI", ("btI".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX+160, 550, "btO", ("btO".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX+300, 550, "btU", ("btU".indexOf(letters))>=0, 100));

            this.sound.play(this.nameCorrect);
        });
    },

    initLevel2: function(delay) {
        this.itens = ['CELULAR','CHAPEU','BARRIGA'];

        this.nameCorrect = String(this.createRandomItens(this.itens, 1));

        var letters = this.getNonRepeatLetter(2, this.nameCorrect);
        var letRemove1 = this.rnd.integerInRange(0,letters.length-1);
        this.remove1 = letters[letRemove1];

        this.nameAtual = this.nameCorrect;
        this.spliceLetter[1].push(letRemove1);

        this.showQuestion(2);
        this.showName(this.nameAtual);

        this.createDelayTime(delay, function() {
            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX-300, 550, "btA", ("btA".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX-160, 550, "btE", ("btE".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX, 550, "btI", ("btI".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX+160, 550, "btO", ("btO".indexOf(letters))>=0, 100));
            this.buttons.push(this.createButton(this.world.centerX+300, 550, "btU", ("btU".indexOf(letters))>=0, 100));

            this.sound.play(this.nameCorrect);
        });
    },

    initLevel3: function(delay) {
        this.qtdJogada = 2;
        this.itens = ['TELEFONE','COMPUTADOR','RECREIO'];

        this.nameCorrect = String(this.createRandomItens(this.itens, 1));

        var letters = this.getNonRepeatLetter(3, this.nameCorrect);
        var letters2 = this.getNonRepeatLetter2(3, this.nameCorrect);

        var letRemove1 = this.rnd.integerInRange(0,letters.length-1);
        var letRemove2 = this.rnd.integerInRange(0,letters2.length-1);

        this.remove1 = letters;
        this.remove2 = letters2;

        this.nameAtual = this.nameCorrect;
        //this.nameAtual = this.nameAtual.replace(letters2[remove2], "_");

        this.spliceLetter[1].push(letRemove1);
        this.spliceLetter[2].push(letRemove2);

        this.showQuestion(3);

        if(this.nameCorrect == "COMPUTADOR"){
            this.showNameLevelD(this.nameAtual);
        }else{
            this.showName(this.nameAtual);
        }

        this.createDelayTime(delay, function() {
            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX-300, 550, "btA",
                ((("btA".indexOf(letters))>=0 && this.qtdJogada==2) || (("btA".indexOf(letters2))>=0 && this.qtdJogada==1)), 100));
            this.buttons.push(this.createButton(this.world.centerX-160, 550, "btE",
                ((("btE".indexOf(letters))>=0 && this.qtdJogada==2) || (("btE".indexOf(letters2))>=0 && this.qtdJogada==1)), 100));
            this.buttons.push(this.createButton(this.world.centerX, 550, "btI",
                ((("btI".indexOf(letters))>=0 && this.qtdJogada==2) || (("btI".indexOf(letters2))>=0 && this.qtdJogada==1)), 100));
            this.buttons.push(this.createButton(this.world.centerX+160, 550, "btO",
                ((("btO".indexOf(letters))>=0 && this.qtdJogada==2) || (("btO".indexOf(letters2))>=0 && this.qtdJogada==1)), 100));
            this.buttons.push(this.createButton(this.world.centerX+300, 550, "btU",
                ((("btU".indexOf(letters))>=0 && this.qtdJogada==2) || (("btU".indexOf(letters2))>=0 && this.qtdJogada==1)), 100));

            this.sound.play(this.nameCorrect);
        });

        this.l1 = letters;
        this.l2 = letters2;
    },

    updateBotao: function() {
        for(var i = 0; i < this.buttons.length; i++) {
            var key = this.buttons[i].key;

            var correct = (((key.indexOf(this.l1))>=0 && this.qtdJogada==2) || ((key.indexOf(this.l2))>=0 && this.qtdJogada==1));

            this.buttons[i].onInputUp.removeAll();
            if(correct) {
                this.buttons[i].onInputUp.add(this.clickRightButton, this);
            } else {
                this.buttons[i].onInputUp.add(this.clickWrongButton, this);
            }
        }
    },

    getNonRepeatLetter: function(num, palavra) {
        var name = "";
        if(num == 1){
            if(palavra == "BOLA") name = "O";
            if(palavra == "DIA") name = "I";
            if(palavra == "TERRA") name = "E";
        }
        else if(num == 2){
            if(palavra == "CELULAR") name = "U";
            if(palavra == "CHAPEU") name = "E";
            if(palavra == "BARRIGA") name = "I";
        }
        else if(num == 3){
            if(palavra == "TELEFONE") name = "E";
            if(palavra == "COMPUTADOR") name = "O";
            if(palavra == "RECREIO") name = "I";
        }

        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            name =  name.replace(this.spliceLetter[num][i], "");
        }

        return name;
    },

    getNonRepeatLetter2: function(num, palavra) {
        var name = "";
        if(palavra == "TELEFONE") name = "O";
        if(palavra == "COMPUTADOR") name = "A";
        if(palavra == "RECREIO") name = "O";

        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            name =  name.replace(this.spliceLetter[num][i], "");
        }

        return name;
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

    // clicar botao correto
    clickRightButton: function(botao) {
		if(this.clickPermission){
			if(this.currentLevel == 3 && this.qtdJogada > 1){
				this.sound.play("hitAcerto");
				this.qtdJogada--;
				this.updateBotao();
				if(this.nameCorrect == "COMPUTADOR"){
					this.showLetraLevelD(this.nameAtual);
				}else{
					this.showLetraLevelFM(this.nameAtual);
				}
			}
			else{
				/* FIXO */
				this.corrects++;
				this.saveCorrect();
				this.sound.play("hitAcerto");
				this.clearButtons();
				//this.addPoints();
				/* FIXO */
	
				if((this.currentLevel == 3) && (this.nameCorrect == "COMPUTADOR")){
					this.showNameLevelD(this.nameCorrect);
				}else{
					this.showName(this.nameCorrect);
				}
				
				this.clickPermission = false;
				this.gotoNextLevel();
			}
		}
    },

    // clicar botao errado
    clickWrongButton: function(target) {
		if(this.clickPermission){
			if(this.currentLevel == 3 && this.qtdJogada > 1){
				this.qtdJogada--;
			}
			if(this.currentLevel > 1) {
				this.currentLevel--;
			}
			this.lives--;
			console.log("Vidas: "+this.lives);
			this.errors--;
	
			this.sound.play("hitErro");
			this.clearButtons();
			this.limparNomes();
			this.updateLivesText();
				
			switch(this.lives) {
				case 1: // mostra dica 1
					this.sound.play("soundDica");
					this.clickPermission = false;
					this.hideAndShowLevel(true);
				break;
				case 0: // toca som de resumo
					this.lives = 0;
					this.hideLevel(function() {});
					this.clickPermission = false;
					this.showResumo();
				break;
				default: // game over
				break;
			}
		}
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

};
