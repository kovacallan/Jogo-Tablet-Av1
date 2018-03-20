
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
        this.TEMPO_INTRO = 11000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 21000;
        this.SOUND_VITORIA = 15500;
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

        this.silaba =[];
        this.count_silabas = 0;
        this.gear_silaba = [];
        this.count_click = 0;
        this.maquina_gear =[]; // para colocar o gaer a as silabas da palavra 
        this.gameGearImg = []; //colocar imagem do gear na maquina
        this.posicao_gear_vazio =[]; // armazena a posição do gear vazio x, y e index para completar
        this.posicao_click =[]; // armazena posição da escolha do jogador
        this.groupLevel=[];
        this.errou = false;
        this.createScene();
        this.sons = false;
        this.sons1 = false;
        this.play = true;

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
    
    getIndexOfK: function (arr, k){
        for(var i=0; i<arr.length; i++){
            var index = arr[i].indexOf(k);
            if (index > -1){
                return [i, index];
            }
        }
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

        console.log("showIntro -2 ");

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

        console.log("showTextoIntro - 3 "); 

        var tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial,this);
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

        console.log("initGame - 7");

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

        this.hideLevel(function() {

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {

                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;//para não aparecer a placa e pergunta
                        //this.showCallToAction = false;
						//this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                        this.showNextLevel();
						//para não aparecer a placa e pergunta
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

    showCorrectName: function(gotoNext) {

        var itens = [];

        this.removeButtonAction();

        console.log(this.correctItem);
        var _extra = (this.correctItem._frameName == "medalha")? 35 : 0;

        var t = this.add.tween(this.correctItem)
                    .to({x:this.world.centerX-450 + this.corrects*200, y: 250}, 1300, Phaser.Easing.Linear.None)
                    .to({y: 290+_extra}, 200, Phaser.Easing.Quadratic.In);
        t.start();
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
    },

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },
    ////para jogo 
    gameGear:function(item){
        
        var count = this.itens[item].length-1;
        var posicao_y =[40,60,40,60,40];
        var posicao_x = 350;
        this.groupGear = this.add.group();
        var count_som = 0;

        for(var i=0; i<=count;i++)
        {
            
            if(i==0){ posicao_x = posicao_x;}
            else{ posicao_x +=60;}
            //console.log("y: " + posicao_y[i]);
            
            if(this.itens[item][i]=="gear_vazio")
            {
                this.gameGearImg[i] =  this.add.sprite( posicao_x,posicao_y[i], 'gear_vazio');
                this.gameGearImg[i].scale.set(0.8,0.8);
                this.gameGearImg[i].alpha=1;
                this.posicao_gear_vazio =[posicao_x,posicao_y[i],this.gameGearImg[i]]; //x,y,sprite
                this.gameGearImg[i].name = this.itens_corretos[item];
                
            }
            else
            {
                this.gameGearImg[i] =  this.createAnimation(posicao_x,posicao_y[i], 'gear', 0.6,0.6);
                this.gameGearImg[i].addChild(this.game.make.sprite(25,40,this.itens[item][i]));
                this.gameGearImg[i].alpha=1;
                if(count_som==0)
                {
                    this.gameGearImg[i].inputEnabled = true;          
                    this.gameGearImg[i].events.onInputOver.add(this.enventoMouseUpGear,this);
                    this.gameGearImg[i].input.useHandCursor = true;
                }
                count_som = 1;
            }

            this.groupLevel[this.currentLevel].add(this.gameGearImg[i]);
            //this.groupGear.add(this.gameGearImg[i]);
            
        }    
    },

    criarGearSilaba: function(i,nivel,time, pos_y)
    {
        var pos_x =0;

        //console.log("time : " + time);
        //console.log("posicao  : " + pos_y);
        if(this.count_silabas==0)
        {
            pos_x=350;
        }
        else
        {
            pos_x = this.gear_silaba[this.gear_silaba.length-1].x+100;
        }

        var sprite = this.createAnimation(pos_x,pos_y, 'gear', 0.7,0.7);
        sprite.alpha=0;
        if(nivel==0)
        {
             this.groupIntro.add(sprite);
        }
        else{
            
            sprite.inputEnabled = true;
            //this.canClickItem = false;
            sprite.events.onInputDown.add(this.enventoMouse,this);
            sprite.events.onInputOver.add(this.enventoMouseUp,this);
            sprite.input.useHandCursor = true;
            this.groupLevel[this.currentLevel].add(sprite);
        }
       
        sprite.addChild(this.game.make.sprite(25,40,this.silaba[this.count_silabas]));
        sprite.name=this.silaba[this.count_silabas];
        this.gear_silaba.push(sprite);

        
        //console.log("------------------resumo gear---------------");
        //console.log("silaba : " + this.count_silabas);
        //console.log("posição X : " + pos_x);
        //console.log("posição Y: " + pos_y);
        //console.log("silaba filha: " + this.silaba[this.count_silabas]);
        //console.log("------------------FIM resumo gear---------------");
        this.count_silabas++;

        this.createDelayTime(time, function() {
            this.add.tween(sprite).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        }, this); // chamando as silabas para completar    
    },

    chamarGearSilaba:function(nivel,time, pos_y){
  
        this.count_silabas =0;
        for(var i=0; i<=2; i++)
        {
            //this.createDelayTime(time+=500, function () {this.criarGearSilaba();}, this);
            this.criarGearSilaba(i,nivel,time, pos_y);

        }
    },

    criarGear:function(){ // PARA INTRODUÇÃO 
        // gear 1 
        var gear_01 = this.createAnimation(350,40, 'gear', 0.6,0.6);
        this.groupIntro.add(gear_01);
        gear_01.addChild(this.game.make.sprite(25, 40, 'tar'));
        gear_01.alpha=0;

        var gear_02 = this.createAnimation(gear_01.x+60,60, 'gear', 0.6,0.6);
        this.groupIntro.add(gear_02);
        gear_02.addChild(this.game.make.sprite(25,40, 'ta'));
        gear_02.alpha=0;

        this.gear = this.add.sprite(gear_02.x+60,40,"gear_vazio");
        this.gear.scale.set(0.8,0.8);
        this.groupIntro.add(this.gear);
        this.gear.alpha=0;

        //this.gear.scale.set(0.6,0.6);

        var gear_03 = this.createAnimation(this.gear.x+60,60, 'gear', 0.6,0.6);
        this.groupIntro.add(gear_03);
        gear_03.addChild(this.game.make.sprite(25,40, 'ga'));
        gear_03.alpha=0;

        this.createDelayTime(900, function() {
           this.add.tween(this.gear).to({alpha:1}, 100, Phaser.Easing.Linear.None, true);
           this.add.tween(gear_01).to({alpha:1}, 100, Phaser.Easing.Linear.None, true);
           this.add.tween(gear_02).to({alpha:1}, 100, Phaser.Easing.Linear.None, true);
           this.add.tween(gear_03).to({alpha:1}, 100, Phaser.Easing.Linear.None, true);

        }, this); // chamando as silabas da palavra        
    },

    animClick:function()
    {
        this.click.x = this.arrow.x-35;
        this.click.y = this.arrow.y-35;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.click.destroy();
            //this.gear_silaba[this.silaba.indexOf("ru")].addChild(this.arrow);


            this.engregagem();
        }, this);
    },

    engregagem:function()
    {
        this.createDelayTime(1000, function() {
            var pos_gear_x=this.gear.x;
            var pos_gear_y=this.gear.y;
           
            this.add.tween(this.gear_silaba[this.silaba.indexOf("ru")]).to({x:pos_gear_x,y:pos_gear_y}, 400, Phaser.Easing.Linear.None, true,800);// gear caminhado
            this.add.tween(this.gear_silaba[this.silaba.indexOf("ru")].scale).to({x:0.6,y:0.6}, 400, Phaser.Easing.Linear.None, true, 800).onComplete.add(function() {
                this.gear.alpha = 0;
                this.gear.destroy();
                this.arrow.alpha = 0;
                this.arrow.destroy();
            }, this);// mouse caminhado
            this.createDelayTime(10000, function() {this.showFinishedLiveTutorial();}, this); 
        }, this); 
    },
    
    desabilitaInput:function()
    {
        this.sons = true;
        this.sons1 = true;
        for(var i=0; i<=this.gameGearImg.length-1;i++)
        {
            this.gameGearImg[i].inputEnabled = false;          
        }
    },

    soundStopped:function()
    {
        this.sons = false;
        this.sons1 = false;
    }, 

    enventoMouseUpGear:function(sprite) 
    {
        if(!this.sons1 && !this.sons)
        {
            var som = this.som_palavra;
            if(!this.sons1.isPlaying)
            {
                
                this.sons1 = this.game.add.audio(som);
                this.sons1.onStop.add(this.soundStopped, this);
                this.sons1.play();
            }
            
        }
    },

    enventoMouseUp:function(sprite) 
    {
        if(!this.sons1 && !this.sons)
        {
            
            var som = sprite.name;
            if(!this.sons.isPlaying)
            {
                
                this.sons = this.game.add.audio(som);
                this.sons.onStop.add(this.soundStopped, this);
                this.sons.play();
            }
            
        }
    },

    enventoMouse:function(sprite) 
    {
        this.posicao_click =[sprite.x,sprite.y,sprite];
        //this.sound.play(sprite.name);
        //console.log("posição img : " + this.posicao_click);
        //console.log("nome do sprite : " + sprite.name);
        if(this.count_click==0)
        {//this.add.tween(sprite).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);
            this.desabilitaInput();
            this.add.tween(sprite).to({x:this.posicao_gear_vazio[0],y:this.posicao_gear_vazio[1]}, 400, Phaser.Easing.Linear.None, true,800);// gear caminhado
            this.add.tween(sprite.scale).to({x:0.6,y:0.6}, 400, Phaser.Easing.Linear.None, true, 800).onComplete.add(function(){this.verificar(sprite)}, this); 
            this.count_click=1;
        }
        
    },
    
    verificar:function(sprite){

        //console.log("A ---> nome do sprite  : " + sprite.name);
        //console.log("B ---> nome do sprite  : " + this.posicao_gear_vazio[2].name);
		//this.sound.play(sprite.name);
		this.createDelayTime(100, function() {
			if(sprite.name==this.posicao_gear_vazio[2].name)
			{
				console.log("correto");
				this.createDelayTime(500, function() {this.rightAnswer();}, this); 
				
			}
			else{
				console.log("errado");
				this.wrongAnswer();
			}
		}, this);
       
    },

    // ************* pontuação ********************
    resetLevel:function(nivel)
    {
		console.log("*********resetLevel*********** ");
        this.posicao_click=[];
        this.posicao_gear_vazio=[];
        this.gameGearImg=[];

        this.createDelayTime(2000, function() {
                 this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 2000);
                 this.soundStopped();
                 if(this.groupLevel[nivel] != null) {
                    this.groupLevel[nivel].removeAll(true);
                 }
        }); 
    },

    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        console.log("add correct");
        this.sound.play("hitAcerto");
        this.qtdErros = 0;
		this.corrects++;
        this.saveCorrect();
        this.posicao_gear_vazio[2].destroy();
        //this.addPoints();
		var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(2000, function() {this.gotoNextLevel();}); // para o próximo nível

    },

    showDica:function()
    {
        //this.verificar = false;
        this.sound.play("soundDica");
        //this.removeKeyboard();
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
                //this.showDica();

                this.createDelayTime(500, function() {    
                    this.resetLevel(nivel);
                    this.createDelayTime(2000, function() {this.showDica();}); // para o próximo nível
                    //this.hideAndShowLevel(true);
                }); // para o próximo nível 

                this.add.tween(this.posicao_click[2]).to({x:this.posicao_click[0],y:this.posicao_click[1]}, 400, Phaser.Easing.Linear.None, true,800);// gear caminhado
                this.add.tween(this.posicao_click[2].scale).to({x:0.7,y:0.7}, 400, Phaser.Easing.Linear.None, true, 800).onComplete.add(function(){}, this);  
                this.createDelayTime(5000, function() {    
                    //this.resetLevel(nivel);
                    this.createDelayTime(1000, function() {this.hideAndShowLevel(true);}); // para o próximo nível
                    //this.hideAndShowLevel(true);
                }); // para o próximo nível 
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.add.tween(this.posicao_click[2]).to({x:this.posicao_click[0],y:this.posicao_click[1]}, 400, Phaser.Easing.Linear.None, true,800);// gear caminhado
                this.add.tween(this.posicao_click[2].scale).to({x:0.7,y:0.7}, 400, Phaser.Easing.Linear.None, true, 800).onComplete.add(function(){}, this);  
                this.createDelayTime(2000, function() {
                    this.resetLevel(nivel);
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

    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        console.log("createScene - 1");

        this.add.sprite( -365, -528, 'background');
        this.createAnimation( 50, 292.1, 'bumba', 1,1);
        this.createAnimation( 30, 205.9, 'fred', 1,1);
        this.createAnimation( 730, 275, 'poly', 1,1);
        this.createAnimation( 812, 342, 'walter', 1,1);   
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        console.log("showLiveTutorial - 5");
        this.silaba =["ru","ra","fa"];
        
        this.criarGear();
        this.chamarGearSilaba(0,4500,310);

        this.arrow = this.add.sprite(400,200, "arrow");
        this.arrow.scale.set(0.3,0.3);
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha=0;
        this.groupIntro.add(this.arrow);

        // animação de click 
        this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.groupIntro.add(this.click);

         // comprtamento 1 do mouse
        this.add.tween(this.arrow).to({alpha:1}, 400, Phaser.Easing.Linear.None, true, 800);
        this.add.tween(this.arrow.scale).to({x:1,y:1}, 400, Phaser.Easing.Linear.None, true, 800);

        this.createDelayTime(5000, function() {
            var pos_x = (this.gear_silaba[this.silaba.indexOf("ru")].x)+(this.gear_silaba[this.silaba.indexOf("ru")].width/2+20);
            var pos_y = (this.gear_silaba[this.silaba.indexOf("ru")].y)+(this.gear_silaba[this.silaba.indexOf("ru")].height/2+20);
            this.add.tween(this.arrow).to({x:pos_x,y:pos_y}, 400, Phaser.Easing.Linear.None, true, 3000).onComplete.add(function() {
                this.animClick();
            }, this);// mouse caminhado
        }, this); 

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        console.log("showFinishedLiveTutorial - 6");
        
        this.tweens.removeAll();
        this.groupIntro.alpha=0;
        this.groupIntro.destroy();
        //this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this); 
        this.createDelayTime(500, function(){this.initGame()}, this);   
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

        
        console.log("showNextLevel - 8");
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
    
    randOpcao:function(array)
    {
         var currentIndex = array.length, temporaryValue, randomIndex ;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }

          return array;
    },
    
    initLevel1: function() {

        this.groupLevel[this.currentLevel] = this.add.group();

        console.log("initLevel1 - 9");
        this.count_click=0;
        this.numero_itens = [0,1,2];
		this.sons_palavras = new Array(
			['caneca'],
			['boneca'],
			['bonita']
		)
        this.itens = new Array(
            ['ca','gear_vazio','ca'],//0
            ['gear_vazio','ne','ca'],//1
            ['bo','ni','gear_vazio']//2
        )  
        this.itens_corretos =['ne','bo','ta'];
        this.itens_errados = new Array(
            ['me','le'],
            ['do','po'],
            ['ba','da']
        )
    
        //var item = 2;
        var item = this.getRandomUniqueItem(this.numero_itens, 1);
		this.som_palavra = this.sons_palavras[item];
        this.showQuestion(1);
       
		var aux_time_placa = 0;
		var aux_time_som = 0;
		if(!this.errou) // para não aparecer a placa e pergunta
		{
			aux_time_placa = 9000;
			aux_time_som = 10000;
		}
		else
		{
			aux_time_placa = 0;
			aux_time_som = 1000;
		}
        
        this.createDelayTime(aux_time_placa, function() {
             this.hideLevel();
        });

        this.errou = false;

        var temp_silaba =[];
        this.createDelayTime(aux_time_som, function() {
             this.gameGear(item);
             this.silaba.pop();
             temp_silaba=this.itens_errados[item].slice(0);
             temp_silaba.push(this.itens_corretos[item]);
             this.silaba = this.randOpcao(temp_silaba);
             this.chamarGearSilaba(1,500,310);
        });
        
    },

    

    initLevel2: function() {

        this.groupLevel[this.currentLevel] = this.add.group();

        console.log("initLevel2 - 9");
        this.count_click=0;
        this.numero_itens = [0,1,2]; //gear_vazio
		this.sons_palavras = new Array(
			['pirulito'],
			['computador'],
			['microfone']
		)
        this.itens = new Array(
            ['pi','ru','gear_vazio','to'],//0
            ['com','gear_vazio','ta','dor'],//1
            ['mi','cro','gear_vazio','ne']//2
        )  
        this.itens_corretos =['li','pu','fo'];
        this.itens_errados = new Array(
            ['vi','ti'],
            ['bu','do'],
            ['ro','go']
        )
    
        //var item = 2;
        var item = this.getRandomUniqueItem(this.numero_itens, 1);
        this.showQuestion(2);
        this.som_palavra = this.sons_palavras[item];
		var aux_time_placa = 0;
		var aux_time_som = 0;
		
		if(!this.errou) // para não aparecer a placa e pergunta
		{
			aux_time_placa = 8000;
			aux_time_som = 9000;
		}
		else
		{
			aux_time_placa = 0;
			aux_time_som = 1000;
		}
        
        this.createDelayTime(aux_time_placa, function() {
             this.hideLevel();
        });

        this.errou = false;


        var temp_silaba =[];
        this.createDelayTime(aux_time_som, function() {
			this.gameGear(item);
			this.silaba.pop();
			temp_silaba=this.itens_errados[item].slice(0);
			temp_silaba.push(this.itens_corretos[item]);
			this.silaba = this.randOpcao(temp_silaba);
			this.chamarGearSilaba(1,500,310);
        });
    },

    initLevel3: function() {

       this.groupLevel[this.currentLevel] = this.add.group();

        console.log("initLevel3 - 9");
        this.count_click=0;
        this.numero_itens = [0,1,2]; //gear_vazio
		this.sons_palavras = new Array(
			['hipopotamo'],
			['jabuticaba'],
			['hinoceronte']
		)
        this.itens = new Array(
            ['hi','po','poo','ta','gear_vazio'],//0
            ['gear_vazio','bu','ti','ca','ba'],//1
            ['ri','no','gear_vazio','ron','te']//2
        )  
        this.itens_corretos =['mo','ja','ce'];
        this.itens_errados = new Array(
            ['lo','no'],
            ['ga','ka'],
            ['se','je']
        )
    
        //var item = 2;
        var item = this.getRandomUniqueItem(this.numero_itens, 1);
        this.showQuestion(3);
		this.som_palavra = this.sons_palavras[item];
		
		var aux_time_placa = 0;
		var aux_time_som = 0;
		
		if(!this.errou) // para não aparecer a placa e pergunta
		{
			aux_time_placa = 12000;
			aux_time_som = 13000;
		}
		else
		{
			aux_time_placa = 0;
			aux_time_som = 1000;
		}
        
        this.createDelayTime(aux_time_placa, function() {
             this.hideLevel();
        });

        this.errou = false;

        var temp_silaba =[];
        this.createDelayTime(aux_time_som, function() {
             this.gameGear(item);
             this.silaba.pop();
             temp_silaba=this.itens_errados[item].slice(0);
             temp_silaba.push(this.itens_corretos[item]);
             
              console.log("silaba: " +  temp_silaba);
              
              this.silaba = this.randOpcao(temp_silaba);
              
              console.log("silaba: " + this.silaba);
              this.chamarGearSilaba(1,500,310);
        });
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
        this.clearButtons(true);
        //this.addPoints();
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
        this.clearButtons(false);
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.sound.play("soundDica");
                this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel();
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
