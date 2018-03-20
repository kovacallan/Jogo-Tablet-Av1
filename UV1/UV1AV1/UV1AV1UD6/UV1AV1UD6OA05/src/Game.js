//ESTA COM 7 LINHAS NA INTRODUÇÃO. COMBINADO COM O PESSOAL DA AONDE É 5 LINHAS. 
//FORMAS GEOMÉTRICAS CAINDO SOBREPOSTAS.

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
        this.TEMPO_INTRO = 24000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 15000;
        this.SOUND_VITORIA = 5500;
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
        this.resetRandomLetter();
        this.itensErrados=[];
        this.itensCertos=[];
        this.numeroItensLevel = 0;
        this.numerosItensErrados=0;
        this.itensErradosImg =[];
        this.itensCertosImg =[];
		this.itensImg =[];
        this.itensImgPosY =[];
        this.posicao =[];
        this.grouplevel =[];
        this.movimentar = false;
        this.acertos = 0;
        this.erros = 0;
        this.clickMouse = false;
        this.errou =false;
        this.posicaoCesta =[];
		this.drawItens=[];
		this.posY = -100;
        this.imagemClick = 0;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

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

        this.createDelayTime( 14000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {

        var tutorialText = this.add.sprite( this.world.centerX+60, 150, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);
		
		var tutorialText1 = this.add.sprite( this.world.centerX+70, 160, 'initialText1');
        tutorialText1.alpha = 0;
        tutorialText1.anchor.set(0.5, 0.5);

        

        this.groupIntro.add(tutorialText1);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        var time1 = 14200;

        this.createDelayTime(7000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			//this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        });
		this.createDelayTime(7500, function() {
            //this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        });
		
		this.createDelayTime(time1, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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
            this.add.tween(this.placar).to({y: -300}, 600, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 600, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        console.log("hideAndShowLevel");
        this.hideLevel(function() {

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                //console.log("if 1 ");
                if(isWrong) {
                    //console.log("if 2 ");
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;
                        this.showNextLevel();
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    });

                } else {
                    //console.log("else 2 ");
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }

            } else {

                console.log("else 1 ");
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
            
        ];
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

    /// 17/04/2015 - D6OA05
    retirarArrayPosicao:function(elem){
        var index = this.locPosicoes.indexOf(elem);
        for (i=index; i<this.locPosicoes.length-1; i++)
        {
            this.locPosicoes[i] = this.locPosicoes[i+1];
        }
        this.locPosicoes.pop();
		this.locPosicoes.push(elem);
    
    },

    retirarArrayElemento:function(elem){
        var index = this.itensErrados.indexOf(elem);
        for (i=index; i<this.itensErrados.length-1; i++)
        {
            this.itensErrados[i] = this.itensErrados[i+1];
        }
        this.itensErrados.pop();
    },

    criarLevel:function()
    {
        this.itensErrados=["chave","calculadora","ovo","sacola","funil","peteca","telefone","boneca","chave_de_fenda","bota","bala","dente","cadeado","cachimbo","livro"];
		this.locPosicoes = [200,350,500,650]; // posiçoes alocadas para os itens 
        this.locPosicoesY = [0,-800,-1000,-1200];
		// sorteiando os itens 
        for(var i=0; i<this.numerosItensErrados;i++) // 4
        {
            var item = this.getRandomUniqueItem(this.itensErrados, 1);
            this.retirarArrayElemento(item); 
			this.drawItens.push(item);
        }
        for(var i=0; i<this.numeroItensLevel;i++) //4
        {
            var item = this.getRandomUniqueItem(this.itensCertos, 1);
			this.drawItens.push(item);
        }
		console.log(this.drawItens);
		this.reorganizarArray();
		this.setPosicao();
		
        this.createDelayTime(100, function() {
            this.movimentar=true;
        });

    },
	
	reorganizarArray:function()
	{
		var n = this.drawItens.length; 
		var tempArr = []; 
		for ( var i = 0; i < n-1; i++ ) 
		{ 
			tempArr.push(this.drawItens.splice(Math.floor(Math.random()*this.drawItens.length),1)[0]);
		} 
		tempArr.push(this.drawItens[0]); 
		this.drawItens=tempArr;
		
		//console.log("----------------------");
		//console.log(this.drawItens);
	},
	
	setPosicao:function()
	{
		var n = this.drawItens.length; 
		for ( var i = 0; i <n; i++ ) 
		{ 
			var pos = this.getRandomUniqueItem(this.locPosicoes, 1);
            this.retirarArrayPosicao(pos);
			//console.log(this.drawItens[i] +" - "+pos);
			this.itensImg[i] = this.createSprite(i,this.drawItens[i],pos);
            this.itensImgPosY[i] = this.itensImg[i].y;
			this.itensImg[i].inputEnabled = true;
            this.itensImg[i].events.onInputDown.add(this.enventoMouse,this);
            this.itensImg[i].input.useHandCursor = true;
            this.itensImg[i].input.pixelPerfectOver = false;
			this.grouplevel[this.currentLevel].add(this.itensImg[i]);
			
		}
		console.log("---------pos Y----------------");
		console.log(this.itensImgPosY);
	},

    createSprite:function (id,nome,x) {
		
        //var y = 30;
        //var sprite = this.add.sprite(x,y,nome);
        var sprite = this.add.sprite(x, this.posY, nome);
        sprite.scale.set(0.7,0.7);
        sprite.name = nome;
        
        console.log("posição x "+x+ " posição y "+this.posY+ " width "+ nome);
		this.posY+=-150;
        return sprite;

    },

    enventoMouse:function(nomeSprite) 
    {
        this.clickMouse = true;
        if(this.clickMouse)
        {
            console.log("enventoMouse "+nomeSprite.name);
            nomeSprite.inputEnabled = false;
            var aux = nomeSprite;
            this.imagemClick = nomeSprite;
            this.verificar(aux);
        }

    },

    efeitoForma:function(nomeSprite)
    {
        var x = nomeSprite.x;
        var y = this.reposicionamentoY(nomeSprite,1);
        this.add.tween(nomeSprite).to({x:this.posicaoCesta[0],y:this.posicaoCesta[1]}, 100, Phaser.Easing.Linear.None, true,400);// gear caminhado
        this.add.tween(nomeSprite.scale).to({x:0.2,y:0.2}, 100, Phaser.Easing.Linear.None, true, 400).onComplete.add(function(){
            //nomeSprite.destroy();
            nomeSprite.alpha = 0;
            nomeSprite.x= x;
            nomeSprite.y= y;
            nomeSprite.alpha = 1;
            nomeSprite.scale.set(0.7,0.7);
            nomeSprite.inputEnabled = true;
            nomeSprite.input.useHandCursor = true;
            nomeSprite.input.pixelPerfectOver = false;
            this.imagemClick=0;
            console.log("******> nome: "+nomeSprite.name +" posicao: "+nomeSprite.y);
        }, this); 
    },

    verificar:function(nomeSprite){
        console.log("---> verificar "+nomeSprite.name);
        var name = nomeSprite.name;
        var aux = this.itensCertos.indexOf(name);

        console.log("item-> "+ name+ " certo-> "+aux);
        this.createDelayTime(100, function() {
            if(aux!=-1)
            {
                if(this.acertos>=0)
                {
                    this.acertos--;
                    this.sound.play("hitAcerto");
                    console.log("correto --> "+this.acertos);
                    this.efeitoForma(nomeSprite);
                    if(this.acertos==0)
                    {   
                        this.createDelayTime(100, function() {this.rightAnswer();}, this);
                        //this.rightAnswer();
                    }
                }
            }
            else{

                if( this.erros>=0)
                {
                    this.erros--;
					this.sound.play("hitErro");
                    console.log("errado--> "+this.erros);
                    this.createDelayTime(500, function() {
                        nomeSprite.inputEnabled = true;
                    }); 
                    
                    
                    if(this.erros==0)
                    {
                        this.createDelayTime(500, function() {this.wrongAnswer();}, this);
                    }
                }
                
            }

            this.clickMouse = false;
        }, this);
       
    },

    reposicionamentoY:function(nomeSprite,func)
    {
        this.game.physics.arcade.enable(nomeSprite);

        var tempy  = this.locPosicoesY[this.currentLevel];
        for(var i=0; i<this.itensImg.length;i++)
        { 
            //if(func==1)
            //{
                //console.log("---- reposicionamentoY ------"+ nomeSprite.name); 
                var y = tempy;
                var y1 = tempy+300;
                //console.log("--->  nome   "+this.itensImg[i].name+" --->obj1 "+nomeSprite.name);
                //console.log("--->  objetos "+this.itensImg[i].x+"    --->obj1 "+nomeSprite.x);
                this.game.physics.arcade.enable(this.itensImg[i]);
               
                if(this.itensImg[i].x==nomeSprite.x)
                {
                    //console.log("**** conferindo ******");
                    //console.log("--->  tempy "+y+" --->  tempy "+y1);
                    //console.log("--->  nome "+ this.itensImg[i].name+" --->  y "+this.itensImg[i].y);
                    //console.log();
                    /*if(this.itensImg[i]!=nomeSprite)
                    {
                        if (this.game.physics.arcade.overlap(nomeSprite,this.itensImg[i])) 
                        {
                            console.log("----overLap-----");
                            console.log("--->  nome   "+this.itensImg[i].name+" --->obj1 "+nomeSprite.name);
                        } 
                    }*/
                    

                    if((this.itensImg[i].y>=y)&&(this.itensImg[i].y<=y1))
                    {
                        console.log("posicao ocupada"+ this.posY);
                        tempy = this.posY-500;
                        this.posY = tempy;
                        //thsi reposicionamentoY:function(nomeSprite,func)
                    }
                    else
                    {
                         console.log("posicao livre");
                    } 
                }
            //} 
        }
        //console.log("---- reposicionamentoY ------");
        return  tempy;
    },     

    resetLevel:function(nivel)
    {
        console.log("*********resetLevel*********** ");
		this.posY = -100;
        this.movimentar=false;
        this.imagemClick=0;
        //this.locX=[];
        this.locPosicao=[];
        this.itensCertos=[];
        //this.itensCertosImg=[];
        //this.itensErrados=[];
        this.itensImg=[];
        this.itensImgPosY=[];
		this.posicaoCesta =[];
		this.drawItens=[];
        this.createDelayTime(1000, function() {
                 this.add.tween(this.grouplevel[this.nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
                 if(this.grouplevel[this.nivel] != null) {
                    this.grouplevel[this.nivel].removeAll(true);
                 }
        }); 

        //this.grouplevel[this.nivel] =[];
    },



    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        var background = this.add.sprite( -20, -170, 'background');
        background.scale.x=0.8;
        
        //this.walter = this.add.sprite( 100, 380, 'walter');
        //this.fred = this.add.sprite( 420, 240, 'fred');
        //this.poly = this.add.sprite( 790, 340, 'poly');

        this.walter = this.createAnimation( 100, 380, 'walter',1,1);
        this.fred = this.createAnimation( 420, 240, 'fred',1,1);
        this.poly = this.createAnimation( 790, 340, 'poly',1,1);

        //this.initGame();

        //this.createAnimation( -150, 265, 'bumba', 1,1);
        
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {


        this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showFinishedLiveTutorial, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var tutorialText2 = this.add.sprite( this.world.centerX+60, 110, 'initialText2');
        tutorialText2.alpha = 1;
        tutorialText2.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText2);

        var time1 = this.TEMPO_INTRO - 14000;
         this.createDelayTime(time1, function() {

            
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
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

        
        console.log("showNextLevel");
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
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
        this.imageQuestion = this.add.sprite(this.world.centerX, 50, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },
    showDica:function()
    {
        //this.verificar = false;
        this.sound.play("soundDica");
        //this.removeKeyboard();
    },

    
    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        console.log("add correct");
        //this.sound.play("hitAcerto");
        this.errors=0;
        this.corrects++;
        this.saveCorrect();
        //this.addPoints();
        this.nivel=this.currentLevel;
        this.resetLevel(this.nivel);
        this.createDelayTime(2000, function() {this.gotoNextLevel();}); // para o próximo nível

    },

    wrongAnswer:function()
    {
        console.log("wrongAnswer - 11 ");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        this.nivel=this.currentLevel;
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        
        this.lives--;
        this.errors--;
        this.errou = true;
        
        //this.sound.play("hitErro");
        this.updateLivesText();

        switch(this.lives) {
            case 1: // mostra dica 1
                //this.showDica();

                this.createDelayTime(500, function() {    
                    this.resetLevel(this.nivel);
                    this.createDelayTime(2000, function() {this.showDica();}); // para o próximo nível  
                }); 
                
                this.createDelayTime(4000, function() {    
                    this.createDelayTime(1000, function() {this.hideAndShowLevel(true);}); // para o próximo nível 
                }); // para nivel anterior
            break;
            case 0: // toca som de resumo
                this.lives = 0;

                this.createDelayTime(2000, function() {
                    this.resetLevel(this.nivel);
                    this.hideLevel();
                    //this.showResumo();
                }); 
                this.createDelayTime(3000, function() {
                    this.showResumo();
                }); 
            break;
            default: // game over
            break;
        }
    },

    initLevel1: function() {

        console.log("***** NIVEL 1 ******");

        this.grouplevel[this.currentLevel] = this.game.add.group();
        //console.log("***** NIVEL 11 ******");

        this.add.tween(this.fred).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.walter).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.poly).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.posicaoCesta[0]=790;
        this.posicaoCesta[1]=440;
        
        
        this.showQuestion(1);
        this.numeroItensLevel = 4;
        this.numerosItensErrados = 4;
        this.acertos = 4;
        this.erros = 2;
        this.totalItens = 8;

        //console.log("***** NIVEL 1 - passo 2 ******");

        this.itensCertos=["retangulo","quadrado","triangulo","triangulo"];
        
        
        var time1 = 0;
        if(this.errou)
        {
            time1 = 500;
            this.createDelayTime(time1, function() {
                 this.criarLevel();
            });
        }
        else
        {
            time1 = 4000;
            this.createDelayTime(time1, function() {
                this.criarLevel();
                this.hideLevel();
            });
        }
        this.errou = false;
    },

    initLevel2: function() {

        console.log("***** NIVEL 2 ******");
		//this.posY = -100;
        this.grouplevel[this.currentLevel] = this.game.add.group();
        //console.log("***** NIVEL 22 ******");

        this.add.tween(this.fred).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.walter).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.poly).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.posicaoCesta[0]=460;
        this.posicaoCesta[1]=390;
        
        this.showQuestion(2);
        this.numeroItensLevel = 5;
        this.numerosItensErrados = 8;
        this.acertos = 5;
        this.erros = 2;
        this.totalItens = 13;



        //console.log("***** NIVEL 2 - passo 2 ******");

        this.itensCertos=["retangulo","quadrado","triangulo","quadrado"];
        
        //this.locPosicoes = [0,1,2,3,4,5,6,7]; // posiçoes alocadas para os itens

        var time1 = 0;
        if(this.errou)
        {
            time1 = 500;
            this.createDelayTime(time1, function() {
                 this.criarLevel();
            });
        }
        else
        {
            time1 = 4000;
            this.createDelayTime(time1, function() {
                 this.criarLevel();
                 this.hideLevel();
            });
        }
        this.errou = false;
    },

    initLevel3: function() {

        console.log("***** NIVEL 3 ******");
		//this.posY = -100;
        this.grouplevel[this.currentLevel] = this.game.add.group();
        //console.log("***** NIVEL 33 ******");

        this.add.tween(this.fred).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.walter).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.poly).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.posicaoCesta[0]=140;
        this.posicaoCesta[1]=500;
        
        this.showQuestion(3);
        this.numeroItensLevel = 8;
        this.numerosItensErrados = 10;
        this.acertos = 8;
        this.erros = 2;
        this.totalItens = 18;



        //console.log("***** NIVEL 3 - passo 3 ******");

        this.itensCertos=["retangulo","quadrado","triangulo","retangulo"];
        
        //this.locPosicoes = [0,1,2,3,4,5,6,7]; // posiçoes alocadas para os itens

        var time1 = 0;
        if(this.errou)
        {
            time1 = 500;
            this.createDelayTime(time1, function() {
                 this.criarLevel();
            });
        }
        else
        {
            time1 = 5000;
            this.createDelayTime(time1, function() {
                 this.criarLevel();
                 this.hideLevel();
            });
        }
        this.errou = false;
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

        if(imagem == "medalha") {
            btn.y += 35;
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
    
    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/   

    overlapImag:function(nomeSprite)
    {
        var teste = false;
        for(var i=0; i<this.itensImg.length;i++)
        {
            if(this.itensImg[i]!=nomeSprite && this.itensImg[i]!=this.imagemClick)
            {
                if (this.game.physics.arcade.overlap(nomeSprite,this.itensImg[i])) 
                {
                    console.log("----overLap-----");
                    console.log("--->  nome   "+this.itensImg[i].name+" --->obj1 "+nomeSprite.name);
                    teste=true;
                } 
            }
        }

        return teste;
    },
    
    update:function() {
        
        if(this.movimentar)
        {
            
			
            for(var i=0; i<this.itensImg.length;i++)
            { 
				
				var overlap = this.overlapImag(this.itensImg[i]);

                if(overlap)
                {
                    this.itensImg[i].y= this.reposicionamentoY(this.itensImg[i]);
                }


				if(this.itensImg[i].y>600)
                {
					this.itensImg[i].y= this.reposicionamentoY(this.itensImg[i]);
				}
				else
				{
					//console.log("else")
					this.itensImg[i].y +=1;
				}
                
            }

        }
       



    }
};
