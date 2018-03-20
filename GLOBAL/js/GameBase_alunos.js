/**
* @version    1.0.9


1.0.1
- Adicionado 'verifyCurrentLevel' ao global e corrigida funcao

1.0.2
- Corrigida funcao 'onPlayerSuccess' para fazer toda validacao pela global

1.0.3
- Corrigido problema de errar no segundo item do level em 'onPlayerError'

1.0.4
- Corrigido problema ao ter mais de uma chance de errar nos niveis em 'onPlayerError'

1.0.5
- Corrigido problema em 'skipResumo'

1.0.6
- Corrigido sistema de abrir level e salvar corretos em 'openLevel' e 'saveCorrect'
- Atualizado 'onPlayerSuccess' para calcular porcentagem quebradas automaticamente

1.0.7
- atualizada funcoes da API

1.0.8
- atualizacao skip resumo - removida onStop quando clica em skip

1.0.9 - mary 
- acescentados as funçoes para a criação dos mapas 
    - createMap(); - cria vericação de video e inicializaçao de mapa

1.0.9 - mary 
- acescentados as funçoes para a edição de cenário 
**/

BasicGame.GameBase = function (game) {

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

BasicGame.GameBase.prototype = {
    

    initGlobal: function() {

        
        
        this.corrects = 0;
        this.errors = 0;
        this.currentLevel = BasicGame.InitialLevel;
        this.listCorrects = [-1,-1,-1];
        this.listCompleted = [false,false,false];
        this.conclusaoEnviada = false;
        this.lives = 2;
        this.showCallToAction = false;
        
        this.ENABLE_CALL_TO_ACTION = false;

        this.input.onTap.add(function() {
            console.log("Posicao do Mouse:", this.input.x, this.input.y);
        }, this);


        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
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

        return this.groupBottom;
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
            location.href = "../UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + "MAPA/";
        }, this);
    },

    switchSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        var _frame = (this.game.sound.mute)? "soundOff" : "soundOn";
        this.soundButton.setFrames(_frame,_frame,_frame, _frame);
    },

    createHud: function() {

        var hud = this.add.group();
        this.add.sprite(0,0, "hud", 0, hud);

        this.livesTextShadow = this.add.bitmapText(111,36, "lucky32", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.livesText = this.add.bitmapText(110,35, "lucky32", this.lives.toString(), 18);

        hud.add(this.livesTextShadow);
        hud.add(this.livesText);

        this.pointsTextShadow = this.add.bitmapText(51,102, "lucky32", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.pointsText = this.add.bitmapText(50,101, "lucky32", BasicGame.Pontuacao.moedas.toString(), 18);

        hud.add(this.pointsTextShadow);
        hud.add(this.pointsText);

        var coin = this.add.bitmapText(31,191, "lucky32", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        var _xp = this.add.bitmapText(30,190, "lucky32", BasicGame.Pontuacao.xp.toString(), 18);

        hud.add(coin);
        hud.add(_xp);

        return hud;
    },


    drawText: function(x,y,text, fontSize, align, lineHeight) {

        var _lineHeight = lineHeight || -2;
        var _align = align || "center";

        var textGroup = this.add.group();

        var _width = 0;

        var byLine = text.split("\n");

        var py = 0;

        for(var i = 0; i < byLine.length; i++) {

            var byColor = byLine[i].split(/(\[[^\]]+\])/gi);

            var px = 0;
            var textBase = this.add.sprite(0,0);

            for(var j = 0; j < byColor.length; j++) {
                
                var _color = 0xFBFBFB;
                var _text = byColor[j];
                if(byColor[j][0] == "[") {

                    _text = " " + byColor[j].replace(/[\[\]]/gi, "");
                    _color = 0xFFD200;

                } 

                var s = this.add.bitmapText(1+px,1+py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                s.tint = 0x010101;

                var t = this.add.bitmapText(px,py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                px += t.width;
                t.tint = _color;
                
                textBase.addChild(s);
                textBase.addChild(t);
            }
            textGroup.add(textBase);

            switch(_align) {
                case "left":
                    
                break;
                case "right":
                    textBase.x -= px;
                break;
                case "center":
                    textBase.x -= px*0.5;
                break;
            }

            py += textBase.height + _lineHeight;

            if(px > _width) {
                _width = px;
            }
        }

        textGroup.x = x;
        textGroup.y = y;

        switch(_align) {
            case "left":
                textGroup.x -= _width*0.5;
            break;
            case "right":
                textGroup.x += _width*0.5;
            break;
            case "center":
                
            break;
        }

        return textGroup;
    },

    showKim: function(delay) {
        var kim = this.add.sprite(this.world.centerX-320, 0, 'kim');

        var fIntro = Phaser.Animation.generateFrameNames("kim_", 0, 14, "", 3);
        var fLoop = Phaser.Animation.generateFrameNames("kim_", 15, 84, "", 3);

        kim.animations.add('intro', fIntro, 18, false);
        kim.animations.add('loop', fLoop, 18, true);

        kim.animations.play('intro').onComplete.add(function() {

            kim.animations.play('loop');
        }, this);

        this.groupIntro.add(kim);

        this.createDelayTime( delay || this.TEMPO_INTRO, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });

        return kim;
    },

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

        console.log(this.listCorrects, this.listCompleted);

        if(_porc > this.listCorrects[this.currentLevel-1]) {
            this.listCorrects[this.currentLevel-1] = _porc;
        }

        if(!this.listCompleted[this.currentLevel-1]) {
            this.listCompleted[this.currentLevel-1] = _completed;
        }

        console.log("saveCorrect", this.listCorrects, this.listCompleted );
    },

    onButtonOver: function(elem) {
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },

    createDelayTime: function(time, callback) {
        //this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
        this.time.events.add(time, callback, this);
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

    skipIntro: function(elem) {
        this.time.events.removeAll();
        this.tweens.removeAll();

        if(this.soundIntro != null) {
            this.soundIntro.onStop.removeAll();
            this.soundIntro.stop();
        }

        elem.inputEnabled = false;

        if(this.tutorialPlacar) {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 400, Phaser.Easing.Linear.None, true, 200);
        }

        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
    skipResumo: function(elem) {
        this.tweens.removeAll();
        this.time.events.removeAll();

        if(this.soundResumo != null) {
            this.soundResumo.onStop.removeAll();
            this.soundResumo.stop();
        }

        if(elem) {
            elem.inputEnabled = false;
        }

        if(this.tutorialPlacar) {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 400, Phaser.Easing.Linear.None, true, 200);
        }

        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    setDebugAudio: function(audio) {
        this.debugAudio = this.sound.add(audio);
        this.debugAudio.onPlay.add(this.onStartDebugAudio, this);
        this.debugAudio.onStop.add(this.onStopDebugAudio, this);
        this.debugAudio.play();

        return this.debugAudio;
    },

    onStartDebugAudio: function() {
        console.log("onStartDebugAudio");
        this.input.onTap.add(this.onDebuAudio, this);
    },
    onDebuAudio: function() {
        var _timer = this.debugAudio.currentTime/100;
        console.log("Timer Audio:", Math.round(_timer)*100, "ms", this.input.x, this.input.y);
    },
    onStopDebugAudio: function() {
        var _timer = this.debugAudio.currentTime/100;
        console.log("Timer Audio Ended:", Math.round(_timer)*100, "ms");
        this.input.onTap.remove(this.onDebuAudio, this);
    },

    // resumo-fixa
    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },

    // vidas-fixa
    updateLivesText: function() {

        if(this.lives < 0) {
            this.lives = 0;
        }

        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },

    // game over-fixa
    gameOverMacaco: function() {

        BasicGame.OfflineAPI.setCookieVictory();

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

        this.sound.play("soundFinal").onStop.add(function() {

            this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                animal.animations.play('idle');

                this.showTextVictory();

                // set as callback to onSucessRegistrarConclusao
                this.eventConclusao = new Phaser.Signal();
                this.eventConclusao.addOnce(this.showEndButtons, this);

                this.registrarConclusao();

            }, this);

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
            if(this.listCorrects[i] >= 0) {
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



    verifyCurrentLevel: function() {

        var n = this.currentLevel + this.currentLocalLevel;
        for(var i = 1; i < this.currentLevel; i++) {
            n += (this["totalLevel" + i] - 1);
            console.log(i, n, this["totalLevel" + i]);
        }
        return n;
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

        var t1 = this.add.bitmapText(0,0, "Luckiest", _moedas.toString(), 40);
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

        var t2 = this.add.bitmapText(0,0, "Luckiest", _xp.toString(), 40);
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

    gameOverLose: function() {

        if(!BasicGame.isOnline) {
            this.createDelayTime(500, this.backButton);
            return;
        }

        var _this = this;
        BasicGame.OnlineAPI.registrarConclusao(this.listCorrects, function(data) {
            _this.createDelayTime(500, _this.backButton);
        }, function(error) {
            console.log(error)
        });

    },

    /**
    *
    * Cria {num} itens aleátorio da lista {itens} e retorna os itens escolhidos
    *
    **/
    createRandomItens: function(itens, num) {
        var _itens = [];
        var _oldList = [];
        for(var i = 0; i < itens.length; i++) {
            _oldList.push(itens[i]);
        }

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, _oldList.length-1);
            _itens.push(_oldList[n]);
            _oldList.splice(n,1);
        }
        return _itens;
    },

    getRandomUniqueItem: function(list, level) {

        if(!this.spliceLetter) {
            this.spliceLetter = [];
        }

        var letters = this.getNonRepeatLetter(list, level); // FRE
        var n = this.rnd.integerInRange(0,letters.length-1);

        this.spliceLetter.push( letters[n] );

        return letters[n];
    },

    getNonRepeatLetter: function(itens) {

        var _name = [];

        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }

        for(var i = 0; i < this.spliceLetter.length; i++) {
            var indx = _name.indexOf(this.spliceLetter[i]);
            if(indx >= 0) {
                _name.splice(indx,1);
            }
        }

        if(_name.length < 1) {
            this.spliceLetter = [];
            return itens;
        }
        return _name;
    },


    onPlayerError: function() {
        console.log(" *** onPlayerError ***")
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.lives--;
        this.errors--;
    },
    onPlayerSuccess: function() {

        
        if(this.currentLocalLevel+1 >= this["totalLevel" + this.currentLevel]) {
            this.corrects++;
            this.saveCorrect();
        } else {
            console.log(this["totalLevel" + this.currentLevel], (this.currentLocalLevel+1));
            var _porc = (this.currentLocalLevel+1) / this["totalLevel" + this.currentLevel] * 100;
            this.saveCorrect(_porc, false);
        }
    },

    onCompleteShowDica: function() {
        console.log(" *** onCompleteShowDica ***")
        if(this.ENABLE_CALL_TO_ACTION) {
            this.showCallToAction = true;
            this.showNextLevel();
        } else {
            this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
        }
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/ 
    
    /*********************************************************************************************************************/ 
    /* FUNCOES DE MAPAS */

    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
    }, 
    
    createMap:function(){
        this.gameStarted = false;
        this.hasVideoButton = false;

        this.tweenTime = 500;
        this.posicaoXvideo = 420;
        this.posicaoYvideo = 450;

    },

    verificaVideo: function() {
        console.log("-----------verificaVideo -------------");
        if((BasicGame.OfflineAPI.isLevelOpen(1) && !BasicGame.OfflineAPI.getVideo("CN01"))){
            BasicGame.OfflineAPI.saveVideo("CN01");

            BasicGame.OnlineAPI.registrarConclusaoVideo("CN01");

            this.showAbertura();
            return true;
        }
        if(BasicGame.OfflineAPI.isLevelFinished(3)){
            this.hasVideoButton = true;
        }
        if(BasicGame.OfflineAPI.isLevelFinished(6)){
            if(!BasicGame.OfflineAPI.getVideo("CN02")){
                BasicGame.OfflineAPI.saveVideo("CN02");

                BasicGame.OnlineAPI.registrarConclusaoVideo("CN02");

                this.showCinematic();
                return true;
            }
        }
        return false;
    },

    createButton: function(x,y,scaleX,scaleY, callback, iconName, visited, win) {
        console.log("-----------createButton -------------");
        var button = this.add.group();

        button.create(0,0,"buttonBg");
        var icon;

        if(visited || win) {
            if(win){
                icon = button.create(90,-20, iconName);
            }else{
                icon = button.create(90,-20, "buttonIcon");
            }
            
            icon.inputEnabled = true;
            icon.input.useHandCursor = true;

            icon.events.onInputUp.add(callback, this);
            icon.anchor.set(0.5,1);

            this.createDelayTime(this.rnd.integerInRange(0,900), function() {
                this.add.tween(icon).to({y: -70}, 800, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
            })
            var al = button.create(25,-200,"buttonAlpha");
            al.alpha = 0;

            this.add.tween(al).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {

                var spr = button.create(35, -100,"feixeAnima");
                spr.animations.add("normal", null, 18, true);
                spr.animations.play("normal");

                var spr = button.create(50, -200,"feixeAnima");
                spr.animations.add("normal", null, 18, true);
                spr.animations.play("normal");

                var spr = button.create(130, -140,"feixeAnima");
                spr.animations.add("normal", null, 18, true);
                spr.animations.play("normal");

            }, this);
        }

        button.x = x;
        button.y = y;
        button.scale.x = scaleX;
        button.scale.y = scaleY;

        return button;
    },

    clickButton1: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"OA01/";
        }, this);
    },
    clickButton2: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"OA02/";
        }, this);
    },
    clickButton3: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"OA03/";
        }, this);
    },
    clickButton4: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"OA04/";
        }, this);
    },
    clickButton5: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"OA05/";
        }, this);
    },
    clickButton6: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"OA06/";
        }, this);
    },

    showAbertura: function() {

        console.log("-----------showAbertura -------------");
        this.game.canvas.className = "";
        this.game.paused = true;
        var id = "UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"CN01";
        document.getElementById("video_box").src = "../../../../GLOBAL/player/"; 
        //document.getElementById("video_box").data = "../../../../GLOBAL/player/"; 
        document.getElementById("video_box").name = id;
        window.video.style.display = "block";
    },
    showVideo: function() {

        console.log("-----------showVideo -------------");
        this.game.canvas.className = "";
        this.game.paused = true;
        //document.getElementById("video_box").src = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"VC01/"; // UV1AV1UD1VC02  
        var id = "UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"VC01";
        document.getElementById("video_box").src = "../../../../GLOBAL/player/"; 
        document.getElementById("video_box").name = id;
        window.video.style.display = "block";
    },
    
    showCinematic: function() {

       console.log("-----------showCinematic-------------");

        this.game.canvas.className = "";
        this.game.paused = true;
        //document.getElementById("video_box").src = "../UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"CN02/"; // UV1AV1UD1CN01
        
        var id = "UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"CN02";
        document.getElementById("video_box").src = "../../../../GLOBAL/player/"; 
        document.getElementById("video_box").name = id;

        window.video.style.display = "block";

        console.log("show video");
    },

    hideVideo: function() {
        console.log("-----------hideVideo-------------");
        console.log("init hide video func");

        this.game.paused = false;
        document.getElementById("video_box").src = "";
        window.video.style.display = "none";
        this.game.canvas.className = "visible";
        
        console.log("hide video");

        this.initGameMap();
    },

    createBtVideo: function(isAnimated) {
        console.log("-----------createBtVideo-------------");
        var mov = this.add.sprite(this.posicaoXvideo,this.posicaoYvideo, 'videoIcon');
        mov.anchor.set(0.5,1);

        if(isAnimated) {
            BasicGame.OfflineAPI.saveVideo("VC01");
            BasicGame.OnlineAPI.registrarConclusaoVideo("VC01");
            mov.animations.add('idle', null, 18, false);
        } else {
            mov.animations.add('idle', [32], 18, false);
        }

        mov.animations.play('idle');
        mov.inputEnabled = true;
        mov.events.onInputUp.add(this.showVideo, this);
    },

    createBottomHudMap: function() {
        console.log("-----------createBottomHudMap-------------");
        this.groupBottom = this.add.group();

        var bg = this.groupBottom.create(0, this.game.height, 'hudMapa', "hudBottom");
        bg.anchor.set(0,1);

        this.soundButton = this.add.button(80,this.world.height-95, 'hudMapa', this.showAbertura, this, 'vdButton', 'vdButton', 'vdButton', 'vdButton', this.groupBottom);

        var sTool = this.add.sprite(8,-5, 'hudMapa', "vdText");
        sTool.alpha = 0;
        this.soundButton.addChild(sTool);
        this.soundButton.input.useHandCursor = true;

        this.soundButton.events.onInputOver.add(this.onOverItemMap, this);
        this.soundButton.events.onInputOut.add(this.onOutItemMap, this);

        var back = this.add.button(10,this.world.height-110, 'hudMapa', this.backButtonMap, this, "backButton", "backButton", "backButton", "backButton", this.groupBottom);
        back.input.useHandCursor = true;

        var sTool = this.add.sprite(8,-40, 'hudMapa', "backText");
        sTool.alpha = 0;
        back.addChild(sTool);

        back.events.onInputOver.add(this.onOverItem, this);
        back.events.onInputOut.add(this.onOutItem, this);
    },

    onOverItemMap: function(elem) {
        elem.getChildAt(0).alpha = 1;
    },
    onOutItemMap: function(elem) {
        elem.getChildAt(0).alpha = 0;
    },

    backButtonMap: function() {

        this.tweens.removeAll();
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"MAPA/";
        }, this);
    },

    onGotoUN: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../../UV"+BasicGame.UV+"Mapa/";
        }, this);
    },

    onGotoAV: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"MAPA/";
        }, this);
    },

    initGameMap: function() {

        console.log("*** initGameMap ***");
        if(this.gameStarted) {
            return;
        }
        
        this.createScene();

        if(this.hasVideoButton && !BasicGame.OfflineAPI.getVideo("VC01")) {
            this.sound.play('showIconVideo', 0.75);
            this.createDelayTime(100, function() {
                this.createBtVideo(true);
            });
        } else if(BasicGame.OfflineAPI.getVideo("VC01") == 1){
            this.createBtVideo(false);
        }
       
        
        this.createBottomHudMap();
    },


    /* FIM FUNCOES DE MAPAS */
    /*********************************************************************************************************************/ 

    /* FUNÇÕES DE CENÁRIO */

    addSpriteMeu:function(sprite,x,y,frame)
    {
        spr = this.game.add.sprite(x,y, sprite,frame);
        //spr.anchor.set(0.5,0.5);
        this.enableDragDrop(spr);
        return spr;
    },

    enableDragDrop:function(elem)
    {
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStart, this);
        elem.events.onDragStop.add(this.onDragStop, this);
    },

    onDragStart:function(sprite, pointer) {

        this.result = "Dragging " + sprite.key;

    },

    onDragStop:function (sprite, pointer) {

        this.mouse = " mouse  x:" + pointer.x + " y: " + pointer.y;
        this.result = " sprite:" + sprite.key + " dropped at x:" + sprite.x + " y: " + sprite.y;

    },

    


    /* FIM FUNÇÕES DE CENÁRIO */
    /*********************************************************************************************************************/ 
    

    update: function () {



    }
};