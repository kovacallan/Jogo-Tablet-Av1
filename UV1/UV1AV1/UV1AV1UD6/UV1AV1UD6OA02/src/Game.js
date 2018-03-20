
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
        this.TEMPO_INTRO = 7500;
        this.TEMPO_INTRO1 = 33000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 20000;
        this.SOUND_VITORIA = 10000;
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
        this.letter = "#";
        // 800, 480,
        this.letterY = 480;
        this.letterX = 800;
        this.second = 0;
        this.timerLevel =0;
        this.palavra_correta;
        this.imagem_palavra_correta;
        this.verificar = false; // para verificar se palavra está correta 
        this.palavra ="";       
        this.resetRandomLetter();
        this.press=false;


        this.createScene();

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
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    // intro-fixa
    showIntro: function() {
        this.groupIntro = this.add.group();
		
		//this.game.time.events.add(Phaser.Timer.SECOND * 33, this.updateCounter, this);
		//this.game.time.events.start();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
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

        this.createDelayTime( this.TEMPO_INTRO1, function() {
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

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        // mudanca do alpha da animacao da Kim e do Texto
        this.createDelayTime( this.TEMPO_INTRO1, function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        });

         this.createDelayTime( this.TEMPO_INTRO, function() {
         this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
         });
    },

    
    // resumo-fixa
    showResumo: function() {

        console.log("showResumo");

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        //this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);//(29)
        
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        //this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

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

        this.add.tween(this.placar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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

        this.currentLevel++;
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
                    console.log("hideAndShowLevel - 1");
                    
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;//para não aparecer a placa e pergunta
                        this.showNextLevel();
                      
                    });

                } else {
                    console.log("hideAndShowLevel - 2");
                    this.add.tween(this.placar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this); // chamada para placar proximo nível     
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
        this.spliceLetter = [];
        this.arrayPalavraCorreta = [];
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

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/
    
    showIgreja:function(){
        // efeito na imagem da igreja 
        this.createDelayTime(2000, function() {this.add.tween(this.intro_imagem).to({alpha:1}, 200, Phaser.Easing.Linear.None, true, 1100).onComplete.add(function () {
        this.showTeclado(1);}, this);});
    },

    showTeclado:function(tipo){

		
		
		if(tipo==1) // caso for introdução
		{ 
			this.teclado = this.add.sprite( 370, 500, 'teclado');
			this.teclado.alpha = 0;//0
			this.teclado.anchor.setTo(0.01, 0.01);
			this.groupIntro.add(this.teclado);
			 // efeito no teclado 
			this.createDelayTime(6500, function() {
				this.add.tween(this.teclado).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
				this.add.tween(this.teclado.scale).to({x:1.3,y:1.3}, 500, Phaser.Easing.Linear.None, true, 1100).onComplete.add(function () {this.showLetra(tipo);}, this);
			});
		}
		else{	
			if(!this.teclado)
			{
				this.teclado = this.add.sprite( 370, 500, 'teclado');
				this.teclado.alpha = 0;//0
				this.teclado.anchor.setTo(0.01, 0.01);
			}
            this.createDelayTime(100, function() {
                this.add.tween(this.teclado).to({alpha:1}, 100, Phaser.Easing.Linear.None, true, 200);
                //this.add.tween(this.teclado.scale).to({x:1.3,y:1.3}, 100, Phaser.Easing.Linear.None, true, 200).onComplete.add(function () {this.showLetra(tipo);}, this);
                this.add.tween(this.teclado.scale).to({x:1.3,y:1.3}, 100, Phaser.Easing.Linear.None, true, 200);
            }); 
		}
    },

    showLetra:function(tipo){
        // efeito na letra
		if(tipo==1) // caso for introdução
		{
			this.intro_letra = this.add.sprite( 560, 500, 'i');
			this.intro_letra.scale.set(0.1);
			this.intro_letra.alpha = 0;//0
			this.intro_letra.anchor.setTo(0.5, 0.5);
			this.groupIntro.add(this.intro_letra);
			this.createDelayTime( 600, function() {
				this.add.tween(this.intro_letra).to({alpha:1}, 600, Phaser.Easing.Linear.None, true, 1100);
				this.add.tween(this.intro_letra.scale).to({x:1.1,y:1.1}, 600, Phaser.Easing.Linear.None, true, 1100).onComplete.add(function () {this.showPalavraIgreja();}, this);
			});
		}
		else{
			
			if(!this.tecla_vazia)
			{
				this.tecla_vazia = this.add.sprite( 560, 500, 'tecla_vazia');
				this.tecla_vazia .scale.set(0.1);
				this.tecla_vazia .alpha = 0;//0
				this.tecla_vazia .anchor.setTo(0.5, 0.5);
			}
			
			this.createDelayTime( 100, function() {
				this.add.tween(this.tecla_vazia).to({alpha:1}, 100, Phaser.Easing.Linear.None, true, 200);
				this.add.tween(this.tecla_vazia.scale).to({x:1.1,y:1.1}, 100, Phaser.Easing.Linear.None, true,200).onComplete.add(function () {this.showKey(this.letter.toUpperCase(),false);}, this);
			});
			
		}
    },

    showPalavraIgreja:function(){
        // efeito na palavra da igreja 
        this.add.tween(this.intro_palavra2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(this.intro_palavra2.scale).to({x:0.65,y:0.65}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.createDelayTime( 200, function() {this.add.tween(this.intro_palavra2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1100);});
        this.createDelayTime( 500, function() {this.add.tween(this.intro_palavra2.scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Linear.None, true, 1100).onComplete.add(function () {this.showFinishedLiveTutorial();}, this);});   
    },

    efeitoPalavra: function(img,x,y){

        var sprite = this.add.sprite( x, y, img);
        sprite.alpha = 0;//0
        sprite.scale.set(1.5);
        sprite.anchor.setTo(0.5, 0.5);
        
        this.add.tween(sprite).to({alpha:1}, 600, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(sprite.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.createDelayTime( 200, function() {this.add.tween(sprite.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1100);});
        this.createDelayTime( 500, function() {this.add.tween(sprite.scale).to({x:1.3,y:1.3}, 500, Phaser.Easing.Linear.None, true, 1100);});
        
        return sprite;
    },

    showPalavra: function(){
       
        this.imagem = this.add.sprite( 805, 350,this.imagem_palavra_correta);
        
        this.imagem.anchor.setTo(0.5, 0.5);
        this.imagem.scale.set(1);
        this.showTeclado(2);
        //this.add.tween(this.imagem).to({x:1,y:1}, 100, Phaser.Easing.Linear.None, true, 200).onComplete.add(function () {this.showPalavraIgreja();}, this);
        //this.groupLevel.add(this.imagem);
    },

    palavraBrilhante:function() {
        //this.add.tween(this.intro_palavra1_escura).to({alpha:0}, 300, Phaser.Easing.Linear.None, true, 1100);
        //this.intro_palavra1_escura.alpha = 0;//0
        this.add.tween(this.intro_palavra1).to({alpha:1}, 600, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(this.intro_palavra1.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.createDelayTime( 200, function() {this.add.tween(this.intro_palavra1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1100);});
        this.createDelayTime( 500, function() {this.add.tween(this.intro_palavra1.scale).to({x:1.3,y:1.3}, 500, Phaser.Easing.Linear.None, true, 1100).onComplete.add(function () {
        this.showIgreja();}, this);});
    },

    liberarPalavra: function(tempo) // leberar a verificacao da palavra 
    {
        console.log("---liberarPalavra--"+ this.currentLevel);
        console.log("Nivel: " + this.currentLevel);
        console.log("Timer: " + tempo);

        this.createDelayTime(10000, function() {         
            if(this.letter=="" && this.press==false)
            {
                console.log("**** Timer: " + tempo);
                console.log("**** aqui *****");
                this.verificaPalavra("liberarPalavra");
            }
        }); // verifica se a plavra digitada está correta 
    },

   

    showEnergia: function(_aux,aux)
    {
        this.energia = this.createAnimation(177.25,456.65, 'energia',1,1);
        this.groupIntro.add(this.energia);
        this.add.tween(this.energia).to({alpha: 0}, _aux, Phaser.Easing.Linear.None, true, aux).onComplete.add(function() {
        this.energia.animations.stop();}, this);
    },

    introTexto3:function(){
        var tutorialText3 = this.add.sprite( this.world.centerX+60,110, 'initialText3');
        tutorialText3.alpha = 0;
        tutorialText3.anchor.set(0.5, 0.5);
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.groupIntro.add(tutorialText3);

        this.createDelayTime(8000, function() {
         this.add.tween(tutorialText3).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.introTexto4, this);
        });
    },

    introTexto4:function(){
        this.tutorialText4 = this.add.sprite( this.world.centerX+60, 110, 'initialText4');
        this.tutorialText4.alpha = 0;
        this.tutorialText4.anchor.set(0.5, 0.5);
        this.add.tween(this.tutorialText4).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.groupIntro.add(this.tutorialText4);
    },


    /// teste logico do jogo

    verificaPalavra:function(func){

        //console.log("teste de tempo: " + this.letter);
        console.log("verificaPalavra " + this.currentLevel);
        console.log("verificaPalavra funcao --> " + func);
        this.game.time.events.stop();
        var _palavra = this.letter.toUpperCase();
        var _palavra_correta = this.palavra_correta.toUpperCase();

        if(_palavra_correta == _palavra){
            console.log("CORRETO: " + _palavra_correta +"--> "+_palavra);
            this.rightAnswer(); // resposta correta 
        }else{
            
            //console.log("ERRADO");
            console.log("ERRADO: " + _palavra_correta +"--> "+_palavra);
            this.wrongAnswer(); // resposta errada
        }
         //this.errou=false; 
    },


    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.add.sprite( -42, -60, 'background');
        //this.add.sprite( 256.15,293.10, 'corujas');
        var coruja_azul = this.createAnimation(256.15, 253.10, 'coruja_azul',1,1);
        var coruja_roxa = this.createAnimation(256.15+coruja_azul.width/2, 253.10, 'coruja_roxa',1,1);       
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() { 

        // TEXTO 2
        var tutorialText2 = this.add.sprite( this.world.centerX+60, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.groupIntro.add(tutorialText2);
        
        this.intro_palavra1 = this.add.sprite( 120, 385, 'intro_abacaxi');
        this.intro_palavra1.alpha = 0;//0
        this.intro_palavra1.scale.set(1.5);
        this.intro_palavra1.anchor.setTo(0.5, 0.5);
		
		this.groupIntro.add(this.intro_palavra1);

        this.intro_palavra2 = this.add.sprite( 800, 480, 'intro_igreja');
        this.intro_palavra2.alpha = 0;//0
        this.intro_palavra2.scale.set(0.5,0.5);
        this.intro_palavra2.anchor.setTo(0.5, 0.5);
		
		this.groupIntro.add(this.intro_palavra2);

        this.intro_imagem = this.add.sprite( 790, 375, 'intro_img_igreja');
        this.intro_imagem.alpha = 0;//0
        this.intro_imagem.anchor.setTo(0.5, 0.5);
		
		this.groupIntro.add(this.intro_imagem);

        this.createDelayTime(8000, function() {
         this.add.tween(tutorialText2).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.introTexto3, this);
        });

        this.createDelayTime(3500, function() {
            this.palavraBrilhante();
        ;});
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        
        this.createDelayTime( 1000, function() {this.showEnergia(500,1100);});
        this.createDelayTime( 3000, function() {
            this.add.tween(this.intro_palavra1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText4).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.intro_imagem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.teclado).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.intro_letra).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.intro_palavra2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
            
        });
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
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
                    this.sound.play("soundP3");
                }
                this.initLevel3();
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 80, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0.5);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initKeyboard: function() {
        //console.log("funcao de teclado");
        this.game.input.keyboard.addCallbacks(this,null,null, this.onKeyPressed);
    },

    removeKeyboard: function() {
        this.game.input.keyboard.addCallbacks( this, null, null, null );
    },
    
    onKeyPressed: function(evt) {
	
	   //this.showTeclado(2);
       var regex = new RegExp("[a-zA-ZãÃáÁàÀêÊéÉèÈíÍìÌôÔõÕóÓòÒúÚùÙûÛçÇºª' ']");
       console.log( "letras: " + this.letter.length );
        if(evt.match(regex))
        {
            if(this.letter.length<=1)
            {
                this.letter = evt;
                this.removeKeyboard();
				//this.showTeclado(2);
                this.showLetra(2);
                
            }
        }
    },


    showKey: function(value,correto) { //(16) MOSTRA A LETRA DIGITADA 

        console.log("showKey " + this.currentLevel);
        
        this.currentKey = this.add.bitmapText(0, 437, "JandaManateeSolid", value.toString(), 80);
        this.currentKey.x = 545-(this.currentKey.textWidth/4);
        this.currentKey.tint = '0x000000';
        this.arrayPalavraCorreta.push(this.currentKey);
		this.verificaPalavra("showKey");
		this.removeKeyboard();//(23)
    },
    
	updateCounter: function() {

		if(this.letter=="#")
		{
			console.log("**** teste *****");
			this.verificaPalavra("updateCounter");
		}
		

	},
    initLevel1: function() { // mary
        
        console.log("NIVEL 1");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        console.log("Errou "+this.verificar);
        
        this.qtdErros = 1;
        this.itens = ["amigo", "kiwi", "tatu"]; // palavras do nivel
        this.itens_corretos= ["onda","ilha","uva"]; // palavras corretas 
		var letras_corretas = ["o","i","u"]; // letras corretas 
        //var item = "tatu";// sorteio da palavra do nivel
        var item = this.getRandomUniqueItem(this.itens, 1);// sorteio da palavra do nivel
        this.palavra_correta = letras_corretas[this.itens.indexOf(item)];
        this.imagem_palavra_correta = this.itens_corretos[this.itens.indexOf(item)];
        
        this.showQuestion(1); // para adcionar imagem da pergunta 
        this.item = this.efeitoPalavra(item,120,385);// efeito para criar a palavra do nivel 
        
		if(!this.verificar)
		{
			this.timerLevel=15000;
		}
		else
		{
			this.timerLevel=1000;
			this.verificar = false;
		}
        this.createDelayTime(this.timerLevel, function() {
				this.letter="#";
				this.initKeyboard(); // (14) FUNÇÕES DE TECLADO E VERIFICAÇÃO DE JOGO
				this.showPalavra();
				this.game.time.events.add(Phaser.Timer.SECOND * 10, this.updateCounter, this);
				this.game.time.events.start();
			});
        //this.createDelayTime(14500, function() {this.liberarPalavra(10000);}); // verifica se a plavra digitada está correta 
    },
    initLevel2: function() {
        //this.verificarTempo(0);
        //this.letter ="";
        //this.press=false;
        console.log("NIVEL 2");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        console.log("Errou "+this.errou);
        //console.log("tempo s "+this.timerStartlevel);


        this.qtdErros = 1;
        var _aux = "";
        this.itens = ["luz", "azul", "capim"]; // palavras do nivel
        this.itens_corretos = ["zebra","lapis","moeda"]; // palavras corretas 
		var letras_corretas = ["z","l","m"]; // letras corretas 

        //var item = "luz";
        var item = this.getRandomUniqueItem(this.itens, 1);// sorteio da palavra do nivel
        this.palavra_correta = letras_corretas[this.itens.indexOf(item)];
        this.imagem_palavra_correta = this.itens_corretos[this.itens.indexOf(item)];
        
        this.showQuestion(2); // para adcionar imagem da pergunta 
        this.item = this.efeitoPalavra(item,120,385);// efeito para criar a palavra do nivel 
        
        if(!this.verificar)
		{
			this.timerLevel=10000;
		}
		else
		{
			this.timerLevel=1000;
			this.verificar = false;
		}
        this.createDelayTime(this.timerLevel, function() {
				this.letter="#";
				this.initKeyboard(); // (14) FUNÇÕES DE TECLADO E VERIFICAÇÃO DE JOGO
				this.showPalavra();
				this.game.time.events.add(Phaser.Timer.SECOND * 8, this.updateCounter, this);
				this.game.time.events.start();
		});
    },

    initLevel3: function() {
        //this.letter="";
        //this.press=false;
        //this.verificarTempo(0);
        console.log("NIVEL 3");
        console.log("Errou "+this.errou);
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);

        this.qtdErros = 1;
        var _aux = "";
        this.itens = ["computador", "microfone", "cadeira"]; // palavras do nivel
        this.itens_corretos = ["regua","escova","arara"]; // palavras corretas
		var letras_corretas = ["r","e","a"]; // letras corretas 

        //var item = "microfone";
        var item = this.getRandomUniqueItem(this.itens, 1);// sorteio da palavra do nivel
        this.palavra_correta = letras_corretas[this.itens.indexOf(item)];
        this.imagem_palavra_correta = this.itens_corretos[this.itens.indexOf(item)];
        
        this.showQuestion(3); // para adcionar imagem da pergunta 
        this.item = this.efeitoPalavra(item,120,385);// efeito para criar a palavra do nivel        
        //this.timerLevel = 6000;
       
        //this.createDelayTime(4000, function() {this.initKeyboard();}); // tempo de audio 0:16
        //this.createDelayTime(4000, function() {this.showPalavra();}); // para mostrar a imagem 
        //this.createDelayTime(4000, function() {this.liberarPalavra(6000);}); // verifica se a plavra digitada está correta 
		if(!this.verificar)
		{
			this.timerLevel=4000;
		}
		else
		{
			this.timerLevel=1000;
			this.verificar = false;
		}
        this.createDelayTime(this.timerLevel, function() {
				this.letter="#";
				this.initKeyboard(); // (14) FUNÇÕES DE TECLADO E VERIFICAÇÃO DE JOGO
				this.showPalavra();
				this.game.time.events.add(Phaser.Timer.SECOND * 6, this.updateCounter, this);
				this.game.time.events.start();
		});
    },

    //____________________PONTUACAO______________________
    resetPalavraCorreta:function()
    {
        for(var i=0; i<=this.arrayPalavraCorreta.length-1; i++)
        {
             this.add.tween(this.arrayPalavraCorreta[i]).to({alpha:0}, 600, Phaser.Easing.Linear.None, true, 1100);
        }
    },



    
    showPalavraCorrteta:function()
    {
        this.showEnergia(600,1100);

        var aux="resp_"+this.imagem_palavra_correta; 
        console.log("imagem -->"+aux); 

        this.palavra= this.efeitoPalavra(aux,this.letterX, this.letterY);

        this.createDelayTime(2000, function() {
            this.resetLevel();
            this.gotoNextLevel();
        }); // para o próximo nível 
    },

    rightAnswer: function() { 
        //this.verificarTempo(0);
        this.corrects++;
        this.saveCorrect();
        this.removeKeyboard(); 
        this.verificar = false;
        console.log("add correct");
        this.sound.play("hitAcerto");
        //this.addPoints(); 
        this.qtdErros = 0;
        this.showPalavraCorrteta();
       
       
    },

    verifyEndLevel: function() { //(21)
        this.showNextLevel();
    },

    resetLevel: function(){
       
        if(this.letter!="#")
        {
            
            this.add.tween(this.palavra).to({alpha:0}, 600, Phaser.Easing.Linear.None, true, 1100);
            this.add.tween(this.teclado).to({alpha:0}, 600, Phaser.Easing.Linear.None, true, 1100);
            this.add.tween(this.tecla_vazia).to({alpha:0}, 600, Phaser.Easing.Linear.None, true, 1100);
        }
    
        this.add.tween(this.item).to({alpha:0}, 600, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(this.imagem).to({alpha:0}, 600, Phaser.Easing.Linear.None, true, 1100);
       
        this.resetPalavraCorreta();
        
    },

    showDica:function()
    {
        //this.verificar = false;
        this.sound.play("soundDica");
        //this.removeKeyboard();
    },

    wrongAnswer: function(target) { //(26) RESPOSTA ERRADA
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        this.nivelAnterior = this.currentLevel;
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;

        this.sound.play("hitErro");
        console.log("******resetLevel---------");
		this.verificar=true;
        this.resetLevel();

        switch(this.lives) {
            case 1: // mostra dica 1
                this.hideLevel(function() {}); //(32)
                this.createDelayTime(1500, function() {   
                    this.showDica();
                }); // para o próximo nível   
                this.createDelayTime(13000, function() {
                    
                    this.hideAndShowLevel(true);
                }); // para o próximo nível 
                
                //this.hideAndShowLevel(true); //(27)
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.createDelayTime(1500, function() {   
                    this.hideLevel(function() {}); //(32)
                    this.showResumo(); //(28)
                }); 
            break;
            default: // game over
            break;
        }
        this.updateLivesText();//(33)

        
    },

    //__________________________________________________

    update: function () {
    },

    render: function() {
		//this.game.debug.text("Tempo do nível " + this.game.time.events.duration, 32, 330);
	}
};
