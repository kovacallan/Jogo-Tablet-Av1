
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
        this.TEMPO_INTRO = 8000;
        this.TEMPO_ERRO2 = 18000;
        this.TEMPO_ERRO1 = 3000;
        this.TEMPO_RESUMO = 17000;
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
        this.count = 0;


        this.input.onTap.add(function() {
            console.log(this.input.x, this.input.y);
        }, this);


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

        this.isIntro = true;
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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 10500);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 11000).onComplete.add(function() {
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

        this.isIntro = false;

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function() {

        for(var i = 0; i < this.nameTexts.length; i++) {
            this.nameTexts[i].inputEnabled = false;
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

        for(var i = 0; i < this.nameTexts.length; i++) {
            if(this.nameShadows[i] != null) {
                this.nameShadows[i].destroy();
            }
            if(this.nameTexts[i] != null) {
                this.nameTexts[i].destroy();
            }
            if(this.nameTransp[i] != null) {
                this.nameTransp[i].destroy();
            }
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.nameTransp = [];
        this.groupName = this.add.group();
    },

    showName: function(name) {

        var Ypos = 10;

        this.limparNomes();

        var last = 0;

        for(var i = 0; i < name.length; i++) {

            var px = this.world.centerX - name.length*15 + last;

            var py = 430;

            var lastLetter = this.addLetter(px,py, name[i]);

            var nSize = lastLetter.width;

            lastLetter.x += nSize*0.5 - lastLetter.width*0.5;
            
            last += nSize + 5;
        }

        //this.nameShadow.x = this.world.centerX - this.nameShadow.width*0.5+4;
        //this.nameText.x = this.world.centerX - this.nameText.width*0.5;
    },
    addLetter: function(x,y, word) {

        this.count++;
        //var cor;
        //if(this.count==1){cor=0xff0000;}
        //if(this.count==2){cor=0xffff00;}
        //if(this.count==3){cor=0x00ffff;}
        //if(this.count==4){cor=0x00000f;}
        //if(this.count==5){cor=0x0000ff;}
        
        var transp = this.add.bitmapText(x,y, "JandaManateeSolid", word.toUpperCase(), 50);
        transp.tint = 0x2E9CC2;
        transp.alpha = 0.5;
        //transp.x = x-transp.width*0.5;
        transp.x = x;
        transp.letter = word;

        //this.drawPoint(cor,x,y);
        //this.drawPoint(cor,x+transp.width,y);

        //this.drawPoint(cor,x,y+transp.height);
        //this.drawPoint(cor,x+transp.width,y+transp.height);

        var shadow = this.add.bitmapText(0,-2, "JandaManateeSolid", word.toUpperCase(), 50);
        shadow.tint = 0x0C7498;

        var name = this.add.bitmapText(0,0, "JandaManateeSolid", word.toUpperCase(), 50);
        name.tint = 0x2E9CC2;


        var letter = this.add.sprite(x,y, null);
        letter.addChild(shadow);
        letter.addChild(name);
        letter.letter = word;

        //letter.x = x-letter.width*0.5;

        letter.initPos = new Phaser.Point(x,y);

        this.groupName.add(transp);
        this.groupName.add(letter);


        //this.nameTransp.push(transp);
        this.nameShadows.push(transp);
        this.nameTexts.push(letter);

        if(this.isIntro) {
            this.groupIntro.add(transp);
            this.groupIntro.add(letter);
            this.groupIntro.add(shadow);
        }

        return letter;
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

    showCorrectName: function() {

        var _sorted = [];


        var _initPos = this.nameTexts[0];

        for(var i = 0; i < this.nameTexts.length; i++) {
            if(this.nameTexts[i].isCorrect) {
                _sorted[0] = this.nameTexts[i];
                _sorted[i] = _initPos;
            } else {
                _sorted[i] = this.nameTexts[i];
            }
        }

        for(var i = 0; i < this.nameTexts.length; i++) {

            this.add.tween(_sorted[i].scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(_sorted[i]).to({x: this.nameShadows[i].x, y: this.nameShadows[i].y}, 500, Phaser.Easing.Linear.None, true);
        }


        this.createDelayTime( 2000, function() {

            this.limparNomes();

            this.hideNuvem();

            this.gotoNextLevel();
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
        this.createAnimation( 758, 175, 'fred', 1,1);
        
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.tutorialText = this.add.sprite( this.world.centerX, 110, 'initialText2');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.groupIntro.add(this.tutorialText);

        this.createNuvem("girafa", true);

        this.groupIntro.add(this.nuvem);
        //this.groupIntro.add(this.groupName);

        this.createDelayTime( 8200, function() {
            
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
            this.arrow.anchor.set(0.5,0.5);

            this.groupIntro.add(this.arrow);

            this.add.tween(this.arrow).to({x: this.nameTexts[0].x+30, y: this.nameTexts[0].y+50}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);

        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {



        this.add.tween(this.arrow).to({x:420, y:475}, 2000, Phaser.Easing.Linear.None, true, 500);

        this.add.tween(this.nameTexts[0]).to({x: this.nameShadows[0].x, y: this.nameShadows[0].y}, 2000, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.nameTexts[0].scale).to({x: 1, y: 1}, 2000, Phaser.Easing.Linear.None, true, 500);
        

        this.createDelayTime( 4600, function() {

            for(var i = 1; i < this.nameTexts.length; i++) {
                this.add.tween(this.nameTexts[i]).to({x: this.nameShadows[i].x, y: this.nameShadows[i].y}, 500, Phaser.Easing.Linear.None, true);
            }

        });

        
        this.createDelayTime( 8000, function() {

            this.add.tween(this.tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.Out, true);
            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.removeClouds(true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 1500).onComplete.add(this.initGame, this);

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
                this.initLevelModel(["bala", "bolo", "bola"], "b", (this.isWrong)?500:7000);
            break;
            case 2:
                if(!this.isWrong) {
                    this.sound.play("soundP2");
                }
                this.initLevelModel(["caneca", "cadeira", "caracol"], "c", (this.isWrong)?500:5000);
            break;
            case 3:
                if(!this.isWrong) {
                    this.sound.play("soundP3");
                }
                this.initLevelModel(["damasco", "dálmata", "debaixo"], "d", (this.isWrong)?500:5500);
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

    initLevelModel: function(itens, correctLetter, delay) {

        this.correctLetter = correctLetter;

        var item = this.getRandomUniqueItem(itens, 1);
        
        this.showQuestion(this.currentLevel);
        
        this.createNuvem(item, false, delay);
    },

    showPalavra: function(palavra, isTutorial, delay) {
        this.showName(palavra);

        this.add.tween(this.nameTexts[0].scale).to({x:1.5, y:1.5}, 500, Phaser.Easing.Linear.None, true);

        var xList = [];
        for(var i = 0; i < this.nameTexts.length; i++) {
            xList.push(this.nameTexts[0].x - 90 + i*70);
        };
        xList.sort(function() {
          return .5 - Math.random();
        });


        for(var i = 0; i < this.nameTexts.length; i++) {
            
            var y1 = this.nameTexts[0].y + 80 - i%2*15;
            var yb = this.nameTexts[0].y-30;

            this.add.tween(this.nameTexts[i]).to({x:xList[i], y:[yb, y1]}, 800, Phaser.Easing.Linear.None, true)
            .interpolation(function(v, k){
                return Phaser.Math.bezierInterpolation(v, k);
            });
            
                
        }
        if(!isTutorial) {
            this.createDelayTime(delay, function() {
                console.log("click");
                for(var i = 0; i < this.nameTexts.length; i++) {

                    // this.nameTexts[i].children[0].updateText();

                    this.nameTexts[i].hitArea = new Phaser.Rectangle(5,5, this.nameTexts[i].children[0].textWidth+5, this.nameTexts[i].children[0].textHeight+5);
                    
                    console.log( this.nameTexts[i].textWidth, this.nameTexts[i].textHeight, this.nameTexts[i].getBounds(), this.nameTexts[i].hitArea, this.nameTexts[i] );

                    this.nameTexts[i].inputEnabled = true;
                    this.nameTexts[i].input.useHandCursor = true;
                    this.nameTexts[i].input.enableDrag(false, true);
                    this.nameTexts[i].events.onDragStart.add(this.onDragLetterStart, this);
                    this.nameTexts[i].events.onDragStop.add(this.onDragLetterStop, this);
                }

            });
        }
    },

    moveBack: function(elem) {
        this.add.tween(elem).to({
            x: this.initialLetterPos.x, y: this.initialLetterPos.y
        }, 200, Phaser.Easing.Linear.None, true);
    }, 

    drawPoint:function(cor,x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(cor,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
    },

    onDragLetterStart: function(elem) {
        this.initialLetterPos = new Phaser.Point(elem.x, elem.y);
    },
    onDragLetterStop: function(elem) {

        if(elem.letter != this.correctLetter) {
            console.log("wrong");
            this.moveBack(elem);
            this.clickWrongButton();
            return;
        }
        
        for(var i = 0; i < this.nameShadows.length; i++) {
            if(this.input.x >= this.nameShadows[i].x && this.input.x <= this.nameShadows[i].x + this.nameShadows[i].width) {
                if(this.input.y >= this.nameShadows[i].y && this.input.y <= this.nameShadows[i].y + this.nameShadows[i].height) {

                    if(this.nameShadows[i].letter == elem.letter && i == 0) {
                        console.log("correct");
                        elem.isCorrect = true;
                        this.clickRightButton();
                        return;
                    } else {
                        console.log("worng");
                        this.moveBack(elem);
                        this.clickWrongButton();
                        return;
                    }
                }
            }
        }
        console.log("no target");
        this.moveBack(elem);
    },

    createNuvem: function(palavra, isTutorial, delay) {
        this.nuvem = this.add.sprite(100,200, "nuvem");
        this.nuvem.alpha = 0;

        this.add.tween(this.nuvem).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            this.showPalavra(palavra, isTutorial, delay);

        }, this);

        this.add.tween(this.nuvem).to({x: 330, y: [150,330]}, 1000, Phaser.Easing.Linear.None, true)
        .interpolation(function(v, k){
            return Phaser.Math.bezierInterpolation(v, k);
        });
    },

    hideNuvem: function() {
        this.add.tween(this.nuvem).to({alpha: 0, x: 600, y: 200}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.nuvem.scale).to({x: 0.5, y: 0.5}, 500, Phaser.Easing.Linear.None, true);
    },

    removeClouds: function(isTutorial) {
        this.hideNuvem();

        if(isTutorial) {
            this.limparNomes();
        } else {
            this.add.tween(this.groupName).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
        }
        
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

        }

        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(imagem == "telefone") {
            btn.scale.set(0.85,0.85);
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
    clickRightButton: function() {
        
        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons();
        //this.addPoints();
        /* FIXO */

        this.showCorrectName(true);

    },

    // clicar botao errado
    clickWrongButton: function() {
        
        /* FIXO */
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.clearButtons();

        this.removeClouds();
        
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
