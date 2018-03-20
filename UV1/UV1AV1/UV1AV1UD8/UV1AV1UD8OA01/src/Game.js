
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
        this.TEMPO_INTRO = 19000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 20000;
        this.SOUND_VITORIA = 6000;
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

        //------D8OA01-----//
        this.groupEsfera = [];
        this.groupBotoes = [];
        this.numBolas = 0; // numero de bolas que estão dentro do vidro
        this.tempo = 6000;
        
        //------D8OA01-----//
        
        this.createScene();
        this.showIntro();
        /* HUD */   
        this.createBottomHud();
        this.createHud();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);

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

        if(this.groupEsfera[this.currentLevel] != null) {
            this.groupEsfera[this.currentLevel].removeAll(true);
         }

         //this.add.tween(this.groupBotoes[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 2000);
         if(this.groupBotoes[this.currentLevel] != null) {
            this.groupBotoes[this.currentLevel].removeAll(true);
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

        this.createDelayTime(9000, function() {
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
		
		var tutorialText2 = this.add.sprite( this.world.centerX, 60, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        
        this.groupIntro.add(tutorialText2);

        this.createDelayTime( 9000, function() {
			this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add( function(){
				this.add.tween(this.tutorialPlacar).to({y: -150},100, Phaser.Easing.Linear.None, true, 50).onComplete.add(function(){
                    this.add.tween(tutorialText2).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true, 100);
                    this.showLiveTutorial();
                }, this); 
			}, this);
        });
		
		this.createDelayTime(this.TEMPO_INTRO, function() {
		    this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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

        this.add.tween(this.placar).to({y: -160}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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
        this.hideAndShowLevel(true); // modificado de false para true neste jogo D8OA01 
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

                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;
                        this.showNextLevel();
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    });

                } else {

                    this.add.tween(this.placar).to({y: -160}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }

            } else {

                console.log();
               
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

    //------D8OA01-----//
    resetLevel:function(nivel)
    {
        console.log("*********resetLevel*********** ");

        this.count_click=0;
        this.numBolas = 0;  // numero esferas que estão no tubo 
        this.numOpcoes  = []; // valores de esferas em cada opção 
        this.bolasVidro =[]; // imagens das bolas nos botoes 
        this.botoes = []; // array de imagens de botoes 3 em cada nivel 
        this.imagemBolas =[]; // imagens das bolas nos botoes 
        this.numeroCorreto = 0;
        this.tempo = 500;
        
        this.createDelayTime(2000, function() {
                 this.add.tween(this.groupEsfera[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 2000);
                 if(this.groupEsfera[nivel] != null) {
                    this.groupEsfera[nivel].removeAll(true);
                 }

                 this.add.tween(this.groupBotoes[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 2000);
                 if(this.groupBotoes[nivel] != null) {
                    this.groupBotoes[nivel].removeAll(true);
                 }
                
        });
    },

    esferasNoTubo:function(){
        
        this.imagens =  new Array([360,170],
                                  [320,248],
                                  [341,335],
                                  [405,332],
                                  [400,228],
                                  [443,138],
                                  [518,175],
                                  [483,259],
                                  [539,325],
                                  [614,355],
                                  [599,254],
                                  [610,154]
                        )

        this.shuffle(this.imagens,12);// para random ordem array 
        this.posY = [];

        for(var i=0; i<this.numBolas; i++)
        {
            var pos_x = parseInt(this.imagens[i][0]);
            var pos_y = parseInt(this.imagens[i][1])+20;
             
            var y = pos_y
            var x = pos_x;

            this.bolasVidro[i] = this.game.add.sprite(x,y, 'bolas1');
            this.bolasVidro[i].scale.set(0.8,0.8);
            this.bolasVidro[i].name = i;
            this.posY[this.bolasVidro[i].name] = parseInt(y);
            this.startBounceTween(this.bolasVidro[i]);

            this.groupEsfera[this.currentLevel].add(this.bolasVidro[i]); // adicionando ao grupo de nivel 

            //console.log("--------------------");

            
            
        }  

    },

    efeitoEsferasCorretas:function(sprite)
    {
        var y = 10;
        var x = 55;    
        for(var i=0; i<sprite.children.length;i++) 
        {
            sprite.children[i].x = x;
            sprite.children[i].y = sprite.children[i].y-y;
            x-=5;
            y-=-10;
        }
        this.add.tween(sprite).to({x:440,y:450}, 500, Phaser.Easing.Linear.None, true,100).onComplete.add(function(){
            this.add.tween(this.quinze).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
            for(var i=0; i<sprite.children.length;i++) 
            {
                sprite.children[i].x = sprite.children[0].x;
                sprite.children[i].y = sprite.children[0].y;
            }
            this.createDelayTime(100, function() {this.add.tween(sprite).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);});
        },this);// caminhado
    },

    inputEnabledBotao:function()
    {
         for(var i=0; i<3; i++) // para cada botao 
        {
            this.botoes[i].inputEnabled = false;
            this.botoes[i].input.useHandCursor = false;
            this.botoes[i].input.reset();
        }
    },

    enventoMouse:function(sprite) 
    {
        console.log("enventoMouse");
        if(this.count_click==0)
        {
            //this.numeroCorreto
            this.inputEnabledBotao();
            if(sprite.name==this.numeroCorreto)
            {
                console.log("correto!!!");
                this.efeitoEsferasCorretas(sprite);
                this.rightAnswer();
            }
            else
            {

                console.log("errado!!!");
                this.wrongAnswer();
            }
            this.count_click=1;
        }
    },

    esferasNoBotao:function(tipo) 
    {
        var x  = 250;

        

        for(var i=0; i<3; i++) // para cada botao 
        {
            this.botoes[i] = this.game.add.sprite(x,550,'');
            this.botoes[i].name = this.numOpcoes[i];
            this.botoes[i].inputEnabled = true;
            this.botoes[i].input.useHandCursor = true;

            this.groupBotoes[this.currentLevel].add(this.botoes[i]); // adicionando ao grupo de nivel 
            if(tipo==1)
            {
                this.botoes[i].events.onInputDown.add(this.enventoMouse,this);
            }
        
            var x_child = 25;
            var y_child = 0;

            for(var it=0; it<this.numOpcoes[i];it++) // para cada esfera dentro de um botao 
            {
                // para modificar o y da esfera 
                if (it % 2 == 0){y_child = -10;}
                else{y_child = +10;}

                this.imagemBolas[it] = this.add.sprite(x_child ,y_child,'bolas');
                this.imagemBolas[it].anchor.set(0.5,0.5);
                this.imagemBolas[it].scale.set(0.5,0.5);
                this.imagemBolas[it].alpha = 1;
                
                this.botoes[i].addChild(this.imagemBolas[it]);
                x_child +=  25;    
            }
            x+=220;  
        } 
    },

    startBounceTween:function (bola) { // primeiro passo 

        bola.y = this.posY[bola.name];

        //console.log(bola.y);
        var bounce=this.game.add.tween(bola);
        var rand = Math.floor(Math.random() * (20 -5)) 
        var aux = (bola.y - bola.height) +rand;
        
        if(aux<=140){ // para não ultrapassar o vidro 
                aux=150;
                //console.log("if -->  " + aux);
        }

        bounce.to({ y:aux}, 2000, Phaser.Easing.Bounce.In);
        bounce.onComplete.add(this.startBounceTween_2, this);
        bounce.start();
    },

    startBounceTween_2:function (bola) { // segundo passo  para suavizar o bounce 

        bola.y = bola.y;

        //console.log(bola.y);
        var bounce=this.game.add.tween(bola);
        var rand = Math.floor(Math.random() * (20 -5)) 
        var aux = this.posY[bola.name];
        
        bounce.to({ y:aux}, 2000, Phaser.Easing.Bounce.In);
        bounce.onComplete.add(this.startBounceTween, this);
        bounce.start();
    },

    
    changeBumbaHappy:function(){    
        this.bumba.loadTexture('bumba_happy', 0);
        var anim  = this.bumba.animations.add('bumba_happy');
        anim.onComplete.add(function() {
            this.changeBumbaIdlle();
        }, this);

        anim.play(15);
    },

    changeBumbaIdlle:function(){
        this.bumba.loadTexture('bumba_idle', 0);
        this.bumba.animations.add('bumba_idle');
        this.bumba.animations.play('bumba_idle', 15, true);
    },
    //------D8OA01-----//
    shuffle:function(array,tam) {
        var currentIndex = tam, temporaryValue, randomIndex ;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/

    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */

    createScene: function() {//finished

        var background = this.add.sprite( -290, -500, 'background');
        background.scale.set(0.9,0.82);
       
		this.bumba = this.add.sprite(790, 320, 'bumba_idle',1);
        this.bumba.animations.add('bumba_idle');
        this.bumba.animations.play('bumba_idle', 15, true);

        this.vidro = this.add.sprite(305,140, 'vidro'); // para ficar a frente das esferas 
        this.vidro.scale.set(0.9,0.82);
        this.quinze = this.add.sprite(467,415, '15'); // para ficar a frente das esferas 
        this.quinze.alpha = 0;

    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.creteTutorial();
        this.createDelayTime( 1000, function() {
            
            this.arrow = this.add.sprite(this.world.centerX+200, this.world.centerY+150, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupBotoes[this.currentLevel].add(this.arrow);
            var x  = this.botoes[0].x+50;
            var y  = this.botoes[0].y;
            this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);

        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        click.animations.play('idle');
		
        this.groupBotoes[this.currentLevel].add(click);
        // remover click
        this.createDelayTime( 1400, function() {
            click.alpha = 0;
            click.destroy();
        });

        // remover tudo
        this.createDelayTime( 7000, function() {
            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.resetLevel(this.currentLevel);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
            this.tempo = 6000;

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
        this.imageQuestion = this.add.sprite(this.world.centerX, 25, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    creteTutorial:function()
    {

        this.groupEsfera[this.currentLevel] = this.add.group();
        this.vidro.destroy();
        this.quinze.destroy();
       
        //// tutorial ////
        this.bolasVidro =[]; // imagens das bolas nos botoes 
        this.count_click=0;
        this.numBolas = 12;  // numero esferas que estão no tubo 
        this.esferasNoTubo(); // posiciona e desenha as esferas 
        this.numOpcoes  = [3,2,4]; // valores de esferas em cada opção 
       
        this.botoes = []; // array de imagens de botoes 3 em cada nivel 
        this.imagemBolas =[]; // imagens das bolas nos botoes 
        this.numeroCorreto = 3;

        this.vidro = this.add.sprite(305,140, 'vidro'); // para ficar a frente das esferas 
        this.vidro.scale.set(0.9,0.82);
        this.quinze = this.add.sprite(467,415, '15'); // para ficar a frente das esferas 
        
        this.groupBotoes[this.currentLevel] = this.add.group();
        this.esferasNoBotao(0);
      
    },

    initLevel1: function() {

        console.log("--- nivel 1 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        this.showQuestion(1);
        this.groupEsfera[this.currentLevel] = this.add.group();
        this.vidro.destroy();
        this.quinze.destroy();
       
        //// level ////
        this.bolasVidro =[]; // imagens das bolas nos botoes 
        this.count_click=0;
        this.numBolas = 12;  // numero esferas que estão no tubo 
        this.esferasNoTubo(); // posiciona e desenha as esferas 
        this.numOpcoes  = [3,2,4]; // valores de esferas em cada opção 
        this.shuffle(this.numOpcoes,3);// para random ordem array 
        this.botoes = []; // array de imagens de botoes 3 em cada nivel 
        this.imagemBolas =[]; // imagens das bolas nos botoes 
        this.numeroCorreto = 3;

        this.vidro = this.add.sprite(305,140, 'vidro'); // para ficar a frente das esferas 
        this.vidro.scale.set(0.9,0.82);
        this.quinze = this.add.sprite(467,415, '15'); // para ficar a frente das esferas 

        //this.groupLevel[this.currentLevel].add(this.vidro);
        //this.groupLevel[this.currentLevel].add(this.quinze);

        this.createDelayTime(this.tempo, function(){ 
            this.hideLevel();
            this.groupBotoes[this.currentLevel] = this.add.group();
            this.esferasNoBotao(1);
        })// desenha as esferas em cada botão });
       
    },

    initLevel2: function() {

        console.log("--- nivel 2 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros); 
        
        this.groupEsfera[this.currentLevel] = this.add.group();
        this.vidro.destroy();
        this.quinze.destroy();
       
        //// level ////
        this.bolasVidro =[]; // imagens das bolas nos botoes 
        this.count_click=0;
        this.numBolas = 10;  // numero esferas que estão no tubo 
        this.esferasNoTubo(); // posiciona e desenha as esferas 
        this.numOpcoes  = [5,3,4]; // valores de esferas em cada opção 
        this.shuffle(this.numOpcoes,3);// para random ordem array 
        this.botoes = []; // array de imagens de botoes 3 em cada nivel 
        this.imagemBolas =[]; // imagens das bolas nos botoes 
        this.numeroCorreto = 5;

        this.vidro = this.add.sprite(305,140, 'vidro'); // para ficar a frente das esferas 
        this.vidro.scale.set(0.9,0.82);
        this.quinze = this.add.sprite(467,415, '15'); // para ficar a frente das esferas 

        //this.groupLevel[this.currentLevel].add(this.vidro);
        //this.groupLevel[this.currentLevel].add(this.quinze);

        this.createDelayTime(this.tempo, function(){ 
            this.hideLevel();
            this.groupBotoes[this.currentLevel] = this.add.group();
            this.esferasNoBotao(1);
        })// desenha as esferas em cada botão });
    },

    initLevel3: function() {

        console.log("--- nivel 3 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);

        this.groupEsfera[this.currentLevel] = this.add.group();
        this.vidro.destroy();
        this.quinze.destroy();
       
        //// level ////
        this.bolasVidro =[]; // imagens das bolas nos botoes 
        this.count_click=0;
        this.numBolas = 8;  // numero esferas que estão no tubo 
        this.esferasNoTubo(); // posiciona e desenha as esferas 
        this.numOpcoes  = [7,6,5]; // valores de esferas em cada opção 
        this.shuffle(this.numOpcoes,3);// para random ordem array 
        this.botoes = []; // array de imagens de botoes 3 em cada nivel 
        this.imagemBolas =[]; // imagens das bolas nos botoes 
        this.numeroCorreto = 7;

        this.vidro = this.add.sprite(305,140, 'vidro'); // para ficar a frente das esferas 
        this.vidro.scale.set(0.9,0.82);
        this.quinze = this.add.sprite(467,415, '15'); // para ficar a frente das esferas 

        //this.groupLevel[this.currentLevel].add(this.vidro);
        //this.groupLevel[this.currentLevel].add(this.quinze);

        this.createDelayTime(this.tempo, function(){ 
            this.hideLevel();
            this.groupBotoes[this.currentLevel] = this.add.group();
            this.esferasNoBotao(1);
        })// desenha as esferas em cada botão });


    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        console.log("--> imagem "+imagem);
        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem[this.countBotoes] = btn;
            this.countBotoes++;
            //this.correctItem.push(btn);

        } else {
            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

        }

        //btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, time);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time).onComplete.add(function() {
            if(_canInteract) {
                //btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    // clicar botao correto
    // ************* pontuação ********************
    
    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        console.log("add correct");
        this.sound.play("hitAcerto");
        this.qtdErros = 0;
        this.corrects++;
        this.saveCorrect();
        //this.addPoints(); 
        this.changeBumbaHappy(); 
        this.resetLevel(this.currentLevel);
        
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível

    },

    showDica:function()
    {
        this.sound.play("soundDica");
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        var nivel=this.currentLevel;
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        
        this.lives--;
        this.errors--;
        this.errou = true;
        
        this.sound.play("hitErro");
        this.updateLivesText();

        switch(this.lives) {
            case 1: // mostra dica 1
                this.createDelayTime(100, function() {    
                    this.resetLevel(nivel);
                    this.createDelayTime(1200, function() {this.showDica();}); // para o próximo nível
                }); 
                this.createDelayTime(6000, function() {    
                    this.createDelayTime(1000, function() {this.hideAndShowLevel(true);}); // para o próximo nível
                }); // para o próximo nível 
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.createDelayTime(100, function() {
                    this.resetLevel(nivel);
                    this.hideLevel();
                }); 
                this.createDelayTime(1200, function() {
                    this.showResumo();
                }); 
            break;
            default: 
            break;
        }

        
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
