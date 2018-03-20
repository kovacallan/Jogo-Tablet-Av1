
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
        this.TEMPO_INTRO = 31000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 23000;
        this.SOUND_VITORIA = 17000;
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

        //------D8OA05-----//
        
        this.posicaoFrase = new Array([45,-9],[38,258],[188,454]); // posicionamentos das frases 
        this.scaleFrase = new Array([0.91,0.90],[0.9,0.9],[0.90,0.9]); // escala das imgs da freses 
        this.posicaoPonto = new Array([832,59],[876,310],[712,512]); // posicionamentos dos pontos 
        this.errou = false;
        this.tempo = 0;
        this.imgFrases = []; // sprites das frases 
        this.imgPontos = []; // sprites dos pontos 
        this.imgMarcas = []; // sprites das marcas para drag and drop 
        this.groupScene =[]; // para imagens ficarem atras do hud 
        this.numAcertos = 0;
        this.posicao = []; // posicao para voltar 
        this.texto = []; // sprite com o texto das frases 
        this.textoPosicao = []; // array com a posicao das frases 
        this.imgTexto = []; // guarda a imagem dos texto 
        this.somTempo =[]; //guarda o tempo de cada som de frease;

         this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //------D8OA05-----//
        
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

        var hud = this.add.sprite(0,0, "hud");
        this.groupBottom.add(hud);

        this.livesTextShadow = this.add.bitmapText(111,36, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.livesText = this.add.bitmapText(110,35, "JandaManateeSolid", this.lives.toString(), 18);

        this.pointsTextShadow = this.add.bitmapText(51,102, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.pointsText = this.add.bitmapText(50,101, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);

        var _cVal = 0;// this.rnd.integerInRange(100,999);
        var coin = this.add.bitmapText(31,191, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        var aux = this.add.bitmapText(30,190, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);


        this.groupBottom.add(this.livesTextShadow);
        this.groupBottom.add(this.livesText);

        this.groupBottom.add(this.pointsTextShadow);
        this.groupBottom.add(this.pointsText);

        this.groupBottom.add(coin);
        this.groupBottom.add(aux);
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
        this.groupScene[0] = this.add.group();

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

        this.createDelayTime( 17000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {

        this.tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);
        this.tutorialText.scale.set(1, 1);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");
        
        this.tutorialText2 = this.add.sprite( this.world.centerX, 70, 'initialText2');
        this.tutorialText2.alpha = 0;
        this.tutorialText2.anchor.set(0.5, 0.5);

        
        this.groupIntro.add(this.tutorialText2);

        this.createDelayTime(17000, function() {
            this.efeitoHud(1); // retirar o hud temporariamente 
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add( function(){
                this.add.tween(this.tutorialPlacar.scale).to({x:0.7,y:0.7},100, Phaser.Easing.Linear.None, true,500).onComplete.add(function(){
                    this.add.tween(this.tutorialText2.scale).to({x:1,y:1}, 200, Phaser.Easing.Linear.None, true, 100);
                    this.add.tween(this.tutorialText2).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true, 100);
                    this.showLiveTutorial();
                }, this); 
            }, this);
        });
        
        //this.createDelayTime(this.TEMPO_INTRO, function() {
            //this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        //});
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

        console.log("this.gameOverMacaco");

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

    //------D8OA05-----//
    resetLevel:function(nivel){
        console.log("*********resetLevel*********** ");console.log(nivel);

        
        this.tempo = 0;
        this.imgFrases = []; // sprites das frases 
        this.imgPontos = []; // sprites dos pontos 
        this.imgMarcas = []; // sprites das marcas para drag and drop 
        this.numAcertos = 0; // numero de acertos por fase 
        this.frases = []; // as frases para demonstracao 
        this.nomeCorreto = []; // ordem correta das frases
        this.nomePonto = []; // nome do ponto da frases 
        this.somMarca = []; // marca de colisao no lugar certo 
        this.posicao = []; // posicao para voltar 
        this.texto = []; // sprite com o texto das frases 
        this.textoPosicao = []; // array com a posicao das frases 
        this.imgTexto = []; // guarda a imagem dos texto
        this.somTempo =[]; //guarda o tempo de cada som de frease; 

        this.add.tween(this.groupScene[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
        if(this.groupScene[nivel] != null) {
            this.groupScene[nivel].removeAll(true);
        }
    },

    efeitoHud:function(tipo){
        switch(tipo)
        {
            case 1:
                this.add.tween(this.groupBottom ).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 500);
            break;
            case 2:
                //this.createDelayTime(2000, function() {   
                this.add.tween(this.groupBottom ).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 500);
                //}); 
            break;
        }
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

    onStartDragNumber: function(elem) {
        
    },

    inputenabledPonto:function(elem,tipo)
    {

        for(var i=0; i<3; i++)
        {
            if(elem.name==this.imgPontos[i].name)
            {
                elem.inputEnabled = false;
                elem.input.reset();
            }
            else{
                if(tipo==false)
                {
                    this.imgPontos[i].inputEnabled = false;
                    this.imgPontos[i].input.reset();
                }
                else{

                    this.imgPontos[i].inputEnabled = true;
                    this.imgPontos[i].input.enableDrag(false, true);
                    this.imgPontos[i].events.onDragStart.add(this.onStartDragNumber, this);
                    this.imgPontos[i].events.onDragStop.add(this.onStopDragNumber, this);
                }

            }   
           
        }
       
    },
    
    onStopDragNumber: function(elem, pointer) {
        
        //console.log("ponto x -> "+elem.x);
        //console.log("ponto y -> "+elem.y);

        var validar = false;

        console.log(" --> onStopDragNumber <---");
       
        
        this.game.physics.arcade.enable(elem);
        for(var i = 0; i <this.imgTexto.length; i++){ 
             console.log(validar);

            var nome = this.imgTexto[i].name;
            //console.log(" comp. --> "+elem.name +" == "+ nome);
            this.game.physics.enable(this.imgTexto[i], Phaser.Physics.ARCADE);
            this.game.physics.enable(this.imgMarcas[i], Phaser.Physics.ARCADE);

            if (this.game.physics.arcade.overlap (elem,this.imgTexto[i])) {
                console.log("---- overlap ---");
                validar = true;
                if(elem.name==nome)
                {
                    console.log("no lugar");
                    if(this.numAcertos!=0)
                    {
                        this.numAcertos--;
                        elem.x=this.imgMarcas[i].x+12;

                        if(elem.name=="final"){elem.y=this.imgMarcas[i].y+14;} else {elem.y=this.imgMarcas[i].y+8;}
                        elem.scale.set(0.3,0.3);
                        this.inputenabledPonto(elem,false);// desabilitando input drag temporariamente
                        this.sound.play("hitAcerto"); 
                        this.sound.play(this.somMarca[i]);
                        this.createDelayTime(this.somTempo[i], function() {  
                            this.verifyCompleted();
                            this.inputenabledPonto(elem,true);// habilitando input drag temporariamente
                        }); 
                      
                        
                        
                    }
                }
                else
                {
                    console.log("no lugar errado");
                    var x =this.posicao[elem.name][0];
                    var y =this.posicao[elem.name][1];

                    //console.log("no lugar errado " + x);
                    //console.log("no lugar errado " + y);

                    this.add.tween(elem).to({x:x,y:y},100, Phaser.Easing.Linear.None, true,200).onComplete.add(function() {
                        elem.inputEnabled = false;
                        elem.input.reset();
                        this.createDelayTime(200, function() {   
                            this.wrongAnswer();
                        }); 
                        
                    }, this);
                    
                }
            } 
        }

        if(!validar)
        {
            console.log("lugar qualuqer");

            var x =this.posicao[elem.name][0];
            var y =this.posicao[elem.name][1];

            //console.log("no lugar errado " + x);
            //console.log("no lugar errado " + y);

            this.sound.play("hitErro");

            this.add.tween(elem).to({x:x,y:y},100, Phaser.Easing.Linear.None, true,200);
        }

        validar = false;
    },

    verifyCompleted: function() {
        if(this.numAcertos <= 0) {
            console.log("level completo");
                this.createDelayTime(100, function() {
                this.rightAnswer();
            });
            
        } else {
            console.log("need more " + this.numAcertos);
        }
    },

    efeitomouse:function(evt){

        console.log("efeitomouse", evt);
        switch(evt)
        {
            case 1:
                var x = this.imgPontos[0].x+40;
                var y = this.imgPontos[0].y+40;
                this.add.tween(this.arrow.scale).to({x:0.8, y:0.8}, 1200, Phaser.Easing.Linear.None, true)
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitomouse(2);}, this);
            break;
            case 2:
                var xp = this.posicaoMarca[1][0]+10;
                var yp = this.posicaoMarca[1][1]+5;

                var x = this.posicaoMarca[1][0]+50;
                var y = this.posicaoMarca[1][1]+50;

                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                // this.imgPontos[0]
                this.groupIntro.bringToTop(this.imgPontos[0]);
                this.add.tween(this.imgPontos[0]).to({x:xp,y:yp},1200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        
                        this.createDelayTime(100, function() {
                            this.imgPontos[0].scale.set(0.3,0.3);   
                            this.efeitomouse(3);
                        }); 
                        
                }, this);
            break;
            case 3:
                var x = this.imgPontos[1].x+40;
                var y = this.imgPontos[1].y+40;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitomouse(4);}, this);
            break;
            case 4:
                var xp = this.posicaoMarca[2][0]+10;
                var yp = this.posicaoMarca[2][1]+5;

                var x = this.posicaoMarca[2][0]+50;
                var y = this.posicaoMarca[2][1]+50;

                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);

                this.groupIntro.bringToTop(this.imgPontos[1]);
                this.add.tween(this.imgPontos[1]).to({x:xp,y:yp},1200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        
                        this.createDelayTime(100, function() {
                            this.imgPontos[1].scale.set(0.3,0.3);   
                            this.efeitomouse(5);
                        }); 
                        
                }, this);
            break;
            case 5:
                var x = this.imgPontos[2].x+40;
                var y = this.imgPontos[2].y+40;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitomouse(6);}, this);
            break;
            case 6:
                var xp = this.posicaoMarca[0][0]+10;
                var yp = this.posicaoMarca[0][1]+10;

                var x = this.posicaoMarca[0][0]+50;
                var y = this.posicaoMarca[0][1]+50;

                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);

                this.groupIntro.bringToTop(this.imgPontos[2]);
                this.add.tween(this.imgPontos[2]).to({x:xp,y:yp},1200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        
                        this.createDelayTime(100, function() {
                            this.imgPontos[2].scale.set(0.3,0.3);   
                            this.showFinishedLiveTutorial();
                        }); 
                        
                }, this);
            break;

        }
    },

    // tutorial 
    creteTutorial:function(){
        
        this.frases = ['tutorial_1','tutorial_2','tutorial_3'];
        this.nomeCorreto = ['exclamacao','interrogacao','final']; // 1 exclamacao // 2 interrogacao // 3 ponto final 
        this.nomePonto = ['exclamacao','interrogacao','final']; // 1 exclamacao // 2 interrogacao // 3 ponto final 
        
        this.posicaoMarca= new Array([214,100],[177,338],[303,533]);

        for(var i=0; i<3;i++) 
        {
            var spr = this.add.sprite(this.posicaoFrase[i][0],this.posicaoFrase[i][1],this.frases[i]);
            spr.scale.set(this.scaleFrase[i][0],this.scaleFrase[i][1]);
            //this.groupScene[0].add(spr);
            this.groupIntro .add(spr)
            this.imgFrases.push(spr);

            this.imgMarcas[i] = this.add.sprite(this.posicaoMarca[i][0],this.posicaoMarca[i][1],'marca');
            this.imgMarcas[i].alpha =0;
            //this.groupScene[0].add(this.imgMarcas[i]);
            this.groupIntro .add(this.imgMarcas[i])

            this.imgPontos[i] = this.add.sprite(this.posicaoPonto[i][0],this.posicaoPonto[i][1],this.nomePonto[i]);
            //this.groupScene[0].add(this.imgPontos[i]);
            this.groupIntro .add(this.imgPontos[i])
        }
    },

    createLevel:function(){
        this.efeitoHud(1); // retirar o hud temporariamente 
        this.hideLevel();
        this.createDelayTime(1000, function() {  
            for(var i=0; i<3;i++) 
            {
                this.imgFrases[i] = this.add.sprite(this.posicaoFrase[i][0],this.posicaoFrase[i][1],this.frases[i]);
                this.imgFrases[i].scale.set(this.scaleFrase[i][0],this.scaleFrase[i][1]);
                this.groupScene[this.currentLevel].add(this.imgFrases[i]);
               
                var x = this.textoPosicao[i][0];
                var y = this.textoPosicao[i][1];
                
                //console.log(x);
                //console.log(y);
                
                this.imgTexto[i] = this.add.sprite(x,y,this.texto[i]);
                this.imgTexto[i].scale.set(0.9,0.9);
                this.imgTexto[i].name = this.nomeCorreto[i];
                this.groupScene[this.currentLevel].add(this.imgTexto[i]);
        

                this.imgMarcas[i] = this.add.sprite(this.posicaoMarca[i][0],this.posicaoMarca[i][1],'marca');
                this.imgMarcas[i].name = this.nomeCorreto[i];
                this.imgMarcas[i].alpha =0;
                this.groupScene[this.currentLevel].add(this.imgMarcas[i]);

               
                this.imgPontos[i] = this.add.sprite(this.posicaoPonto[i][0],this.posicaoPonto[i][1],this.nomePonto[i]);
                this.imgPontos[i].name = this.nomePonto[i];
                this.imgPontos[i].inputEnabled = true;
                this.imgPontos[i].input.enableDrag(false, true);
                this.imgPontos[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.imgPontos[i].events.onDragStop.add(this.onStopDragNumber, this);

                //game.input.enableDrag.removeAll();

                this.posicao[this.imgPontos[i].name] = new Array(this.posicaoPonto[i][0],this.posicaoPonto[i][1]); // para voltar ao lugar quando errado 
                this.groupScene[this.currentLevel].add(this.imgPontos[i]);
            }
        }); 
    },
    //------D8OA05-----//
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

        var background = this.add.sprite( -201, -625, 'background');
        background.scale.set(0.9,0.9);
        this.createAnimation(395,336, 'omega', 1,1);
       
        //this.gradeGuia();

        //var x = this.addSprite('omega',300,100);
    },

    

    
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.creteTutorial();
        this.createDelayTime( 1000, function() {
            
            this.arrow = this.add.sprite(this.world.centerX+50, this.world.centerY+150, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            //this.groupScene[0].add(this.arrow);
            this.groupIntro.add(this.arrow);
            this.createDelayTime( 6000, function() {
                this.efeitomouse(1);
            }, this);
        }, this);
    },
    showFinishedLiveTutorial:function() {


        // remover tudo
        this.createDelayTime(500, function() {
            this.resetLevel(0);
            this.add.tween(this.tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 100);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        var tutorialText2 = this.add.sprite( this.world.centerX, 110, 'imgResumo2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        this.soundResumo = this.sound.play("soundResumo");

        this.createDelayTime(16500, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true)
            }, this);

        });

        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(tutorialText2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

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

    

    initLevel1: function() {
        this.efeitoHud(2); 
        console.log("--- nivel 1 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        this.showQuestion(1);
        this.numAcertos = 3;
        this.groupScene[this.currentLevel] = this.add.group();

        this.frases = ['frase_p1_1','frase_p1_2','frase_p1_3'];
        this.texto = ['texto_p1_1','texto_p1_2','texto_p1_3'];
        this.textoPosicao = new Array([149.65,85],[115.65,323.95],[259.8,517.25]);
        this.posicaoMarca= new Array([235,98],[197,314],[316,507]);
        this.nomeCorreto = ['exclamacao','interrogacao','final']; 
        this.nomePonto = ['exclamacao','interrogacao','final']; 
        this.nomePonto = this.shuffle(this.nomePonto,3);
        this.somMarca = ['soundP11','soundP12','soundP13'];
        this.somTempo =[2000,1000,1000]; 

        if(!this.errou){this.tempo=13000;}else{this.tempo=500;} // para liberar as imagens após o som inicial
        
        this.createDelayTime(this.tempo, function() {   
            this.createLevel();
        });         
       

        this.errou = false;


        //this.initLevel3()
    },

    initLevel2: function() {

        console.log("--- nivel 2 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros); 
        this.showQuestion(2);
        this.numAcertos = 3;
        this.groupScene[this.currentLevel] = this.add.group();

        this.frases = ['frase_p2_1','frase_p2_2','frase_p2_3'];
        this.texto = ['texto_p2_1','texto_p2_2','texto_p2_3'];
        this.textoPosicao = new Array([149.65,85],[115.65,323.95],[259.8,517.25]);

        this.nomeCorreto = ['final','interrogacao','exclamacao']; 
        this.nomePonto = ['final','interrogacao','exclamacao']; 
        this.nomePonto = this.shuffle(this.nomePonto,3);
        this.somMarca = ['soundP21','soundP22','soundP23'];
        this.somTempo =[2000,3000,3000]; 
        this.posicaoMarca= new Array([184,100],[210,357],[322,529]);

        if(!this.errou){this.tempo=7000;}else{this.tempo=500;} // para liberar as imagens após o som inicial
    
        this.createDelayTime(this.tempo, function() {   
            this.createLevel();
        });         
       

        this.errou = false;
    },

    initLevel3: function() {

        console.log("--- nivel 3 ----");
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        this.showQuestion(3);
        this.numAcertos = 3;
        this.groupScene[this.currentLevel] = this.add.group();

        this.frases = ['frase_p3_1','frase_p3_2','frase_p3_3'];
        this.texto = ['texto_p3_1','texto_p3_2','texto_p3_3'];
        this.textoPosicao = new Array([149.65,85],[115.65,323.95],[259.8,495.25]);
       
        this.nomeCorreto = ['final','exclamacao','interrogacao']; 
        this.nomePonto = ['final','exclamacao','interrogacao']; 
        this.nomePonto = this.shuffle(this.nomePonto,3);
        this.somMarca = ['soundP31','soundP32','soundP33'];
        this.somTempo =[3000,4000,3000]; 
        this.posicaoMarca= new Array([183,131],[156,370],[307,564]);


        if(!this.errou){this.tempo=10000;}else{this.tempo=500;} // para liberar as imagens após o som inicial
       
        this.createDelayTime(this.tempo, function() {   
            this.createLevel();
        });    

        this.errou = false;
    },

    
    // ************* pontuação ********************
    
    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        console.log("add correct");
        //this.sound.play("hitAcerto");
        this.efeitoHud(2); // retirar o hud temporariamente 
        this.qtdErros = 0;
        this.corrects++;
        this.saveCorrect();
        //this.addPoints(); 
       
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
        this.efeitoHud(2); // mostra o hud temporariamente 
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
                this.createDelayTime(1000, function() {
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
