
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
        this.TEMPO_INTRO = 34000;
        this.TEMPO_ERRO1 = 8000;
        this.TEMPO_RESUMO = 25000;
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

        this.createDelayTime( 12000, function() {
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

        this.createDelayTime( 12000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);
            this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
                this.placar.anchor.set(0.5,0);

            this.animation1 = this.add.sprite(this.world.centerX-420, this.world.centerY-90, 'introExemplo');
            var _intervalo = [];
            var _intervalo2 = [];
            for(var i=0; i<10; i++){
                _intervalo.push(i);
            }
            for(var i=11; i<127; i++){
                _intervalo2.push(i);
            }

            this.groupIntro.add(this.animation1);
            this.animation1.animations.add('idle', _intervalo, 18, false);
            this.animation1.animations.play('idle');
            this.animation1.scale.set( 1, 1);

            this.createDelayTime(8000, function() {
                this.animation1.animations.add('idle', _intervalo2, 18, false);
                this.animation1.animations.play('idle');
                this.animation1.scale.set( 1, 1);
            });


        });

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(this.animation1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
                
                //this.createDelayTime(2000, function() {
                    this.initGame();
               // });
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
		this.juninho_jr.animations.play('hit').onComplete.add(function(){
			this.juninho_jr.animations.play('idle')
		},this);
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
                        this.isWrong = true;
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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

    showName: function(name) {
        for(var i = 0; i < name.length; i++) {
            //var px = this.world.centerX - name.length*25 + last;
            var px = 630 + i*this.LETTER_SPACING;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            var lastLetter = this.addLetter(px,py+220, name[i]);
            var nSize = lastLetter[0].width;
            if(name[i] == "_") {
                this.nameCorrectPos = px+260;
                var lSize = this.add.bitmapText(0,0, "JandaManateeSolid", this.nameCorrect[i], 80);
                nSize = lSize.width;
                lSize.destroy();
                lastLetter[0].x += nSize*0.5 - lastLetter[0].width*1.5;
                lastLetter[1].x += nSize*0.5 - lastLetter[1].width*1.5;
            }
        }
    },

    showName2: function(name) {
        for(var i = 0; i < name.length; i++) {
            //var px = this.world.centerX - name.length*25 + last;
            var px = 80 + i*this.LETTER_SPACING;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            var lastLetter = this.addLetter(px,py+280, name[i]);
            var nSize = lastLetter[0].width;
            if(name[i] == "_") {
                this.nameCorrectPos = px+260;
                var lSize = this.add.bitmapText(0,0, "JandaManateeSolid", this.nameCorrect[i], 80);
                nSize = lSize.width;
                lSize.destroy();
                lastLetter[0].x += nSize*0.5 - lastLetter[0].width*1.5;
                lastLetter[1].x += nSize*0.5 - lastLetter[1].width*1.5;
            }
        }
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

    showCorrectName: function(gotoNext) {
        var itens = [];

        for(var i = 0; i < this.nameCorrect.length; i++) {
            if(this.nameTexts[i].text == "_") {
                var px = this.world.centerX - this.nameCorrect.length*25 + i*this.LETTER_SPACING;
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


    createScene: function() {//finished
        this.add.sprite( 0, 0, 'background');
		
		this.juninho_jr = this.add.sprite(720, 330, "juninho_level");
        this.juninho_jr.animations.add('idle', this.math.numberArray(0,24), 18, true);
		this.juninho_jr.animations.add('hit', this.math.numberArray(25,69), 18, false);
      	this.juninho_jr.animations.play('idle');
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
        this.limparNomes();

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
                this.initLevel2((this.isWrong)?500:9000);
            break;
            case 3:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP3");
                }
                this.initLevel3((this.isWrong)?500:9000);
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

    preparaPalavra: function(palavra, lev) {
        var letters = this.getNonRepeatLetter(palavra,lev);
        var remove1 = this.rnd.integerInRange(0,letters.length-1);
        
        var name = palavra.replace(letters[remove1], "_");

        return name;
    },

    preparaPalavra2: function(palavra, lev) {
        this.letters = this.getNonRepeatLetter(palavra,lev);
        var remove1 = this.rnd.integerInRange(0,this.letters.length-1);
        
        var name = palavra.replace(this.letters[remove1], "_");
        
        this.spliceLetter[2].push(this.letters[remove1]);
        return name;
    },

    montaPalavra: function(palavra, letra) {
        var name = palavra.replace("_", letra);

        return name;
    },

    initLevel1: function(delay) {
        this.itens = ['SOM','CORUJA','NAVE'];
        this.nameCorrect = String(this.createRandomItens(this.itens, 1));

        this.itErros = ['M','W','D','B','K','T','J','P']; //M N W S C N D B K T J P
        var erro = String(this.createRandomItens(this.itErros, 1));

        //this.limparNomes();

        if(this.nameCorrect == "SOM"){
            this.nameCorrect2 = "SÍLABA";
        }else if(this.nameCorrect == "CORUJA"){
            this.nameCorrect2 = "CAMINHO";
        }else if(this.nameCorrect == "NAVE"){
            this.nameCorrect2 = "NINHO";
        }

        this.name1 = this.preparaPalavra(this.nameCorrect,1);
        this.name2 = this.preparaPalavra2(this.nameCorrect2,1);

        this.showQuestion(1);

        this.showName(this.name1);
        this.showName2(this.name2);

        this.createDelayTime(delay, function() {
            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX-300, 510, "bt"+this.letters, true, 100));
            this.buttons.push(this.createButton(this.world.centerX-175, 515, "bt"+erro, false, 100));
        });
    },

    initLevel2: function(delay) {
        this.itens = ['DANÇA','GRUTA','BICO'];
        this.nameCorrect = String(this.createRandomItens(this.itens, 1));

        //this.limparNomes();

        if(this.nameCorrect == "DANÇA"){
            this.nameCorrect2 = "DENTRO";
        }else if(this.nameCorrect == "GRUTA"){
            this.nameCorrect2 = "COGUMELO";
        }else if(this.nameCorrect == "BICO"){
            this.nameCorrect2 = "BOCA";
        }

        this.name1 = this.preparaPalavra(this.nameCorrect,2);
        this.name2 = this.preparaPalavra2(this.nameCorrect2,2);

        this.itErros = ['M', 'N', 'W', 'S', 'C', 'N', 'K', 'T', 'J', 'P']; //'M', 'N', 'W', 'S', 'C', 'N', 'D', 'B', 'K', 'T', 'J', 'P
        var _erros = this.createRandomItens(this.itErros, 2);
        _erros.push(this.letters);

        _erros.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(2);

        this.showName(this.name1);
        this.showName2(this.name2);

        this.createDelayTime(delay, function() {
            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX-330, 510, "bt"+_erros[0], (String(_erros[0]) == this.letters), 100));
            this.buttons.push(this.createButton(this.world.centerX-215, 515, "bt"+_erros[1], (String(_erros[1]) == this.letters), 100));
            this.buttons.push(this.createButton(this.world.centerX-100, 515, "bt"+_erros[2], (String(_erros[2]) == this.letters), 100));
        });
    },

    initLevel3: function(delay) {
        this.itens = ['LIVRO','MACACO','RIMA'];
        this.nameCorrect = String(this.createRandomItens(this.itens, 1));

        //this.limparNomes();

        if(this.nameCorrect == "LIVRO"){
            this.nameCorrect2 = "LETRA";
        }else if(this.nameCorrect == "MACACO"){
            this.nameCorrect2 = "MÚSICA";
        }else if(this.nameCorrect == "RIMA"){
            this.nameCorrect2 = "RISADA";
        }

        this.name1 = this.preparaPalavra(this.nameCorrect,3);
        this.name2 = this.preparaPalavra2(this.nameCorrect2,3);

        this.itErros = ['N', 'W', 'S', 'C', 'N', 'D', 'B', 'K', 'T', 'J', 'P'];
        var _erros = this.createRandomItens(this.itErros, 3);
        _erros.push(this.letters);

        _erros.sort(function() {
          return .5 - Math.random();
        });

        this.showQuestion(3);

        this.showName(this.name1);
        this.showName2(this.name2);

        this.createDelayTime(delay, function() {
            this.buttons = [];
            this.buttons.push(this.createButton(this.world.centerX-365, 510, "bt"+_erros[0], (String(_erros[0]) == this.letters), 100));
            this.buttons.push(this.createButton(this.world.centerX-250, 515, "bt"+_erros[1], (String(_erros[1]) == this.letters), 100));
            this.buttons.push(this.createButton(this.world.centerX-135, 515, "bt"+_erros[2], (String(_erros[2]) == this.letters), 100));
            this.buttons.push(this.createButton(this.world.centerX - 20, 520, "bt"+_erros[3], (String(_erros[3]) == this.letters), 100));
        });
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

    getNonRepeatLetter: function(palavra, num) {
        console.log(palavra+" entrou! "+num+" número");
        //var _letters = [null, "SM", "ORUJA", "AVE"];

        //var _name = _letters[num];
        var _name = "";
        if(num == 1){
            if(palavra == "SOM") _name = "S";
            if(palavra == "SÍLABA") _name = "S";
            if(palavra == "CORUJA") _name = "C";
            if(palavra == "CAMINHO") _name = "C";
            if(palavra == "NAVE") _name = "N";
            if(palavra == "NINHO") _name = "N";
        }
        else if(num == 2){
            if(palavra == "DANÇA") _name = "D";
            if(palavra == "DENTRO") _name = "D";
            if(palavra == "GRUTA") _name = "G";
            if(palavra == "COGUMELO") _name = "G";
            if(palavra == "BICO") _name = "B";
            if(palavra == "BOCA") _name = "B";
        }
        else if(num == 3){
            if(palavra == "LIVRO") _name = "L";
            if(palavra == "LETRA") _name = "L";
            if(palavra == "MACACO") _name = "M";
            if(palavra == "MÚSICA") _name = "M";
            if(palavra == "RIMA") _name = "R";
            if(palavra == "RISADA") _name = "R";
        }

        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            console.log("entrou "+this.spliceLetter[num].length);
            _name = _name.replace(this.spliceLetter[num][i], "");
        }

        return _name;
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
    clickRightButton: function(target) {

        if(target.alpha != 1) {
            return;
        }

        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons();
        //this.addPoints();
        /* FIXO */

        //this.clickEffect(target);
        //this.showCorrectName(true);
        var palavra1 = this.montaPalavra(this.name1, this.letters);
        var palavra2 = this.montaPalavra(this.name2, this.letters);

        this.limparNomes();
        this.showName(palavra1);
        this.showName2(palavra2);
        this.gotoNextLevel();
    },

    // clicar botao errado
    clickWrongButton: function(target) {

        if(target.alpha != 1) {
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
