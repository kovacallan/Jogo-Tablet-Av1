
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
        this.TEMPO_INTRO = 11000;
        this.TEMPO_ERRO2 = 23500;
        this.TEMPO_ERRO1 = 7000;
        this.TEMPO_RESUMO = 14000;
        this.SOUND_VITORIA = 7000;
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


        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();
        this.isWrong = false;



        this.createScene();

        this.showIntro();
        //this.gameOverMacaco();

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

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, "sprites", 'placar');
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

        var tutorialText = this.add.sprite( this.world.centerX+40, 110, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.add.tween(tutorialText).to({}, this.TEMPO_INTRO, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        }, this);
    },

    
    // resumo-fixa
    showResumo: function() {

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, "sprites", 'placarResumo');
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

        this.hidePersonagens();

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
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, "sprites", 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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
        this.add.tween(this.groupName).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

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
                        this.add.tween(this.placar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    }, this);

                } else {
                    this.add.tween(this.placar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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
    
    createDelayTime: function(time, callback) {

        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
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

    getNonRepeatLetter: function(num) {

        var _letters = [null, "POL", "FRE", "JNI", "BUM"];

        var _name = _letters[num];
        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            _name = _name.replace(this.spliceLetter[num][i], "");
        }

        if(_name.length < 1) {
            return _letters[num];
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

        var last = 0;

        for(var i = 0; i < name.length; i++) {

            var px = this.world.centerX - name.length*25 + last;
            //console.log(px, last);

            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            var lastLetter = this.addLetter(px,py, name[i]);
            var nSize = lastLetter[0].width;
            if(name[i] == "_") {
                this.nameCorrectPos = px;
                var lSize = this.add.bitmapText(0,0, "JandaManateeSolid", this.nameCorrect[i], 80);
                nSize = lSize.width;
                lSize.destroy();
                lastLetter[0].x += nSize*0.5 - lastLetter[0].width*0.5;
                lastLetter[1].x += nSize*0.5 - lastLetter[1].width*0.5;
            } 
            last += nSize + 10;
        }
    },
    addLetter: function(x,y, letter) {


        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 80);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 80);

        //shadow.x = x+4-shadow.width*0.5;
        //name.x = x-name.width*0.5;

        this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        this.groupName.add(shadow);
        this.groupName.add(name);

        return [name,shadow];
    },

    createRandomSymbol: function() {

        var symbol = this.add.sprite(0,0, "sprites", 'symbol' + this.rnd.integerInRange(1,3));
        return symbol;
    },

    createRandomNumber: function() {

        var letters = "123456789";
        var remove = this.rnd.integerInRange(0,letters.length-1);

        return letters[remove].toString();
    },

    showCorrectName: function(gotoNext) {

        var itens = [];

        for(var i = 0; i < this.nameCorrect.length; i++) {
            if(this.nameTexts[i].text == "_") {
                
                //var px = this.world.centerX - this.nameCorrect.length*25 + i*this.LETTER_SPACING;

                itens = this.addLetter(this.nameCorrectPos, 0, this.nameCorrect[i]);
            }
        }

        for(var i = 0; i < itens.length; i++) {
            itens[i].alpha = 0;
            this.add.tween(itens[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
        
        if(gotoNext) {
            this.add.tween(this).to({}, 500, Phaser.Easing.Linear.None, true, 1500).onComplete.add(this.gotoNextLevel, this);
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


    createScene: function() {
        this.add.sprite( -72, -112, "sprites", 'cenarioBack');
        
        this.a1 = this.createAnimation( 245, 276, 'poly', 1,1);

        this.a2 = this.createAnimation( 583,181, 'fred', 1,1);

        this.a3 = this.createAnimation( 775,318, 'bumba', 1,1);

        this.a4 = this.createAnimation( 4, 289, 'walter_jr', 1,1);

        this.add.sprite( 88, 447, "sprites", 'cenarioFrente');
    },

    showPersonagem: function(n) {
        this.a1.alpha = 0.5;
        this.a2.alpha = 0.5;
        this.a3.alpha = 0.5;
        this.a4.alpha = 0.5;
        this["a" + n].alpha = 1;
    },
    hidePersonagens: function() {
        this.a1.alpha = 1;
        this.a2.alpha = 1;
        this.a3.alpha = 1;
        this.a4.alpha = 1;
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.nameCorrect = "BUMBA";
        this.showName("BU_BA");

        this.groupIntro.add(this.groupName);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 160, "M", true, 100, false) );
        this.buttons.push( this.createButton(this.world.centerX+120, 160, "2", false, 100, false) );

        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[1]);

        this.add.tween(this).to({}, 5000, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
            this.groupIntro.add(this.arrow);
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

        this.groupIntro.add(click);

        // remover click
        this.add.tween(this).to({}, 1400, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            click.alpha = 0;
            click.destroy();
        }, this);

        // remover tudo
        this.add.tween(this).to({}, 4000, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.groupName).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        }, this);

        this.nameCorrect = "BUMBA";
        this.showCorrectName(false);


    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'resumoText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.add.tween(tutorialText).to({}, this.TEMPO_RESUMO, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.delayTimeToShowText, this);

        }, this);

    },

    // resumo delay para parte 2
    delayTimeToShowText: function() {
        this.add.tween(this).to({ }, 2000, Phaser.Easing.Linear.None, true).onComplete.add(this.showImagesResumo, this);        
    },

    // resumo parte 2
    showImagesResumo: function() {

        var image1 = this.add.sprite( this.world.centerX - 180, 30, "sprites", 'tutorialImage1');
        image1.alpha = 0;
        image1.scale.set(0.5,0.5);
        image1.anchor.set(0.5,0);

        var image2 = this.add.sprite( this.world.centerX, 30, "sprites", 'tutorialImage2');
        image2.alpha = 0;
        image2.scale.set(0.5,0.5);
        image2.anchor.set(0.5,0);

        var image3 = this.add.sprite( this.world.centerX + 180, 50, "sprites", 'tutorialImage3');
        image3.alpha = 0;
        image3.scale.set(0.5,0.5);
        image3.anchor.set(0.5,0);
        
        this.groupIntro.add(image1);
        this.groupIntro.add(image2);
        this.groupIntro.add(image3);

        var text1 = this.add.sprite( this.world.centerX - 180, 160, 'tutorialText1');
        text1.alpha = 0;
        text1.anchor.set(0.5,0);

        var text2 = this.add.sprite( this.world.centerX, 160, 'tutorialText2');
        text2.alpha = 0;
        text2.anchor.set(0.5,0);

        var text3 = this.add.sprite( this.world.centerX + 180, 160, 'tutorialText3');
        text3.alpha = 0;
        text3.anchor.set(0.5,0);

        this.groupIntro.add(text1);
        this.groupIntro.add(text2);
        this.groupIntro.add(text3);

        this.add.tween(image1.scale).to({x: 1, y:1}, 900, Phaser.Easing.Linear.None, true);
        this.add.tween(image2.scale).to({x: 1, y:1}, 900, Phaser.Easing.Linear.None, true, 1000);
        this.add.tween(image3.scale).to({x: 1, y:1}, 900, Phaser.Easing.Linear.None, true, 2000);

        this.add.tween(image1).to({alpha: 1}, 900, Phaser.Easing.Linear.None, true);
        this.add.tween(image2).to({alpha: 1}, 900, Phaser.Easing.Linear.None, true, 1000);
        this.add.tween(image3).to({alpha: 1}, 900, Phaser.Easing.Linear.None, true, 2000);

        this.add.tween(text1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 900);
        this.add.tween(text2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 1900);
        this.add.tween(text3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 2900);

        this.add.tween(this).to({}, 5500, Phaser.Easing.Linear.None, true).onComplete.add(function() { // timer to fade out

            this.add.tween(image1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(image2).to({alpha: 0}, 900, Phaser.Easing.Linear.None, true);
            this.add.tween(image3).to({alpha: 0}, 900, Phaser.Easing.Linear.None, true);

            this.add.tween(text1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(text2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(text3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        }, this);
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
                this.initLevel1();
                this.showPersonagem(1);
            break;
            case 2:
                if(!this.isWrong) {
                    this.sound.play("soundP2");
                }
                this.initLevel2();
                this.showPersonagem(2);
            break;
            case 3:
                // opcao alternativa no ultimo nivel
                if(this.rnd.integerInRange(0,10) > 5) {
                    if(!this.isWrong) {
                        this.sound.play("soundP3");
                    }
                    this.initLevel3();
                    this.showPersonagem(4);
                } else {
                    if(!this.isWrong) {
                        this.sound.play("soundP4");
                    }
                    this.initLevel4();
                    this.showPersonagem(3);
                }
            break;
        }

        this.isWrong = false;
    },

    initLevel1: function() {

        this.nameCorrect = "POLY";

        var letters = this.getNonRepeatLetter(1); // POL
        var remove1 = this.rnd.integerInRange(0,letters.length-1);
        
        var name = this.nameCorrect.replace(letters[remove1], "_");

        this.spliceLetter[1].push(letters[remove1]);

        var _letters = [ letters[remove1], this.createRandomSymbol() ];
        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showName(name);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 160, _letters[0], letters.indexOf(_letters[0])>=0, (this.isWrong)?0:4500) );
        this.buttons.push( this.createButton(this.world.centerX+120, 160, _letters[1], letters.indexOf(_letters[1])>=0, (this.isWrong)?0:4500) );

    },

    initLevel2: function() {

        this.nameCorrect = 'FRED';

        var letters = this.getNonRepeatLetter(2); // FRE
        var remove1 = this.rnd.integerInRange(0,letters.length-1);
        var name = this.nameCorrect.replace(letters[remove1], "_");

        this.spliceLetter[2].push(letters[remove1]);

        var _letters = [ letters[remove1], this.createRandomSymbol(), this.createRandomNumber() ];
        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showName(name);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-160, 160, _letters[0], letters.indexOf(_letters[0])>=0, (this.isWrong)?0:4000) );
        this.buttons.push( this.createButton(this.world.centerX, 160, _letters[1], letters.indexOf(_letters[1])>=0, (this.isWrong)?0:4000) );
        this.buttons.push( this.createButton(this.world.centerX+160, 160, _letters[2], letters.indexOf(_letters[2])>=0, (this.isWrong)?0:4000) );


    },

    initLevel3: function() {

        this.nameCorrect = 'JÚNIOR';

        var letters = this.getNonRepeatLetter(3); // "JNI";
        var remove1 = this.rnd.integerInRange(0,letters.length-1);
        var name = this.nameCorrect.replace(letters[remove1], "_");

        this.spliceLetter[3].push(letters[remove1]);

        var _letters = [ letters[remove1], this.createRandomNumber(), this.createRandomNumber() ];
        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showName(name);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-160, 160, _letters[0], letters.indexOf(_letters[0])>=0, (this.isWrong)?0:3500) );
        this.buttons.push( this.createButton(this.world.centerX, 160, _letters[1], letters.indexOf(_letters[1])>=0, (this.isWrong)?0:3500) );
        this.buttons.push( this.createButton(this.world.centerX+160, 160, _letters[2], letters.indexOf(_letters[2])>=0, (this.isWrong)?0:3500) );
    },

    initLevel4: function() {

        this.nameCorrect = 'BUMBA';

        var letters = this.getNonRepeatLetter(4); // "BUM";
        var remove1 = this.rnd.integerInRange(0,letters.length-1);
        var name = this.nameCorrect.replace(letters[remove1], "_");

        this.spliceLetter[4].push(letters[remove1]);

        var _letters = [ letters[remove1], this.createRandomNumber(), this.createRandomNumber() ];
        _letters.sort(function() {
          return .5 - Math.random();
        });

        this.showName(name);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-160, 160, _letters[0], letters.indexOf(_letters[0])>=0, (this.isWrong)?0:3000) );
        this.buttons.push( this.createButton(this.world.centerX, 160, _letters[1], letters.indexOf(_letters[1])>=0, (this.isWrong)?0:3000) );
        this.buttons.push( this.createButton(this.world.centerX+160, 160, _letters[2], letters.indexOf(_letters[2])>=0, (this.isWrong)?0:3000) );


    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, letter, right, time, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {
            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickRightButton:null, this, 'buttonBox','buttonBox','buttonBox');

            var letter = this.add.bitmapText(-15, -50, "JandaManateeSolid", letter, 70);
            letter.tint = 0x013467;
            btn.addChild(letter);

        } else {
            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickWrongButton:null, this, 'buttonBox','buttonBox','buttonBox');

            if(typeof(letter) == "string") {
                var letter = this.add.bitmapText(-15, -50, "JandaManateeSolid", letter, 70);
                letter.tint = 0x013467;
                btn.addChild(letter);

            } else {

                letter.anchor.set(0.5,0.5);
                btn.addChild(letter);

            }
        }

        btn.letter = letter;
        btn.anchor.set(0.5,0.5);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

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

        if(target.alpha < 1) {
            return;
        }

        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons();
        /* FIXO */

        this.clickEffect(target);
        this.showCorrectName(true);

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
        this.clearButtons();
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.sound.play("soundDica");
                this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel(function() {});
                this.hidePersonagens();
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
