/**
* @version    1.0.0
**/

BasicGame.PreloaderBase = function (game) {

    this.background = null;
    this.preloadBar = null;
};

BasicGame.PreloaderBase.prototype = {

    createPreloadEffect: function() {

        var bg = this.add.sprite(this.world.centerX, this.world.centerY, "preloader", "loadingBackground");
        bg.anchor.set(0.5,0.5);
        bg.scale.set(0.4,0.4);
        bg.alpha = 0;

        this.add.tween(bg).to({alpha: 1}, 250, Phaser.Easing.Quadratic.Out, true);
        this.add.tween(bg.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out, true);

        var txt = this.add.sprite(this.world.centerX, this.world.centerY-30, "preloader", "loadingText");
        txt.anchor.set(0.5,0.5);
        txt.scale.set(0.4,0.4);
        txt.alpha = 0;

        this.add.tween(txt).to({alpha: 1}, 250, Phaser.Easing.Quadratic.Out, true, 250);
        this.add.tween(txt.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out, true, 250).onComplete.add(function() {

            this.preloadEmpty.alpha = 1;
            this.preloadBar.alpha = 1;
            this.effectFinished = true;

        }, this);

        this.preloadEmpty = this.add.sprite(this.world.centerX-175, this.world.centerY,"preloader", 'preloaderBarEmpty');
        this.preloadEmpty.alpha = 0;

        this.preloadBar = this.add.sprite(this.world.centerX-175, this.world.centerY,"preloader", 'preloaderBarFull');
        this.preloadBar.alpha = 0;

        this.load.setPreloadSprite(this.preloadBar);
    },

    getPoints: function() {

        BasicGame.Pontuacao = null;

        if(!BasicGame.isOnline) {
            BasicGame.Pontuacao = {moedas: 0, xp: 0};
            return;
        }


        BasicGame.OnlineAPI.obterPremiacao(
            BasicGame.InitialLevel,
            function(resposta) { // sucesso

                BasicGame.Pontuacao = resposta;
                console.log("Pontuacao", resposta);

            }, function(erro) { // erro
                console.log( erro );
            }
        );

    },

    initPreloaderBase: function () {

        this.ready = false;
        this.effectFinished = false;

        this.createPreloadEffect();

        this.getPoints();


        // FONTS

        this.caminho = getPathFile(GLOBAL_FONT);

        this.load.bitmapFont('Luckiest', this.caminho+'font.png',  this.caminho+"font.fnt");
        this.load.bitmapFont('JandaManateeSolid', this.caminho+'janda.png',  this.caminho+"janda.fnt");
        this.load.bitmapFont('JandaManateeSolidRed', this.caminho+'janda-red.png',  this.caminho+"janda.fnt");
        this.load.bitmapFont('lucky32', this.caminho+'lucky_small-32.png',  this.caminho+"lucky_small-32.fnt");

        this.load.bitmapFont('lucky-32', this.caminho+'lucky-32.png',  this.caminho+"lucky-32.fnt");



        this.caminho = getPathFile(GLOBAL);

        this.load.image('arrow',  this.caminho+'arrow.png');
        this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');


        // ---- HUD -----
        this.load.atlas('hud', this.caminho+'hud.png', this.caminho+'hud.json');


        // ---- ANIMATIONS ----
        this.load.atlas('textoVitoria1', this.caminho+'textoVitoria1.png', this.caminho+'textoVitoria1.json');
        this.load.atlas('textoVitoria2', this.caminho+'textoVitoria2.png', this.caminho+'textoVitoria2.json');
        this.load.atlas('textoVitoria3', this.caminho+'textoVitoria3.png', this.caminho+'textoVitoria3.json');
        this.load.atlas('textoVitoria4', this.caminho+'textoVitoria4.png', this.caminho+'textoVitoria4.json');
        this.load.atlas('textoVitoria5', this.caminho+'textoVitoria5.png', this.caminho+'textoVitoria5.json');

        this.load.atlas('bumbaWin',     this.caminho+'bumba_win.png',  this.caminho+'bumba_win.json');
        this.load.atlas('fredWin',      this.caminho+'fred_win.png',   this.caminho+'fred_win.json');
        this.load.atlas('polyWin',      this.caminho+'poly_win.png',   this.caminho+'poly_win.json');
        this.load.atlas('juniorWin',    this.caminho+'junior_win.png', this.caminho+'junior_win.json');

        this.load.atlas('kimAntiga',            this.caminho+'kim.png',        this.caminho+'kim.json');
        this.load.atlas('kim',          this.caminho+'kim2.png',       this.caminho+'kim2.json');


        // HUD Buttons
        this.load.atlas('hudVitoria',           this.caminho+'hud_vitoria.png',        this.caminho+'hud_vitoria.json');

        /************************ Inicio Medalhas ******************************/
        for(var i = 11; i<=20;i++){
            this.load.image('medalha' + i, this.caminho + 'medalhas/medalha_'+i+'_texto.png');
        }
        

        /************************ Final Medalhas ******************************/



        // PLACAR
        this.load.image('placarResumo', this.caminho+'placar_resumo.png');
        this.load.image('placar', this.caminho+'placar.png');

        // END GAME
        this.load.image('backgroundWin', this.caminho+'background_win.png');
        this.load.image('light',this.caminho+'tela-parabens.png');

        //this.caminho = SOUNDS_GLOBAL;

        this.caminho = getPathFileSound(SOUNDS_GLOBAL);

        this.load.audio('hitErro',       [this.caminho+'Hit_Erro.mp3']);
        this.load.audio('hitAcerto',     [this.caminho+'Hit_Acerto.mp3']);
        this.load.audio('soundVitoria1', [this.caminho+'vitoria_demais.mp3']);
        this.load.audio('soundVitoria2', [this.caminho+'vitoria_muito_bem.mp3']);
        this.load.audio('soundVitoria3', [this.caminho+'parabens_conecturma.mp3']);
        this.load.audio('soundVitoria4', [this.caminho+'vitoria_uau.mp3']);
        this.load.audio('soundVitoria5', [this.caminho+'vitoria_vamos_em_frente.mp3']);
        this.load.audio('soundParabens', [this.caminho+'vitoria_isso_ai.mp3']);

        this.load.audio('backgroundMusic', [this.caminho+'looping_jogo.mp3']);
    },

    onLoseFocus: function() {
        if(this.game.paused) {
            return;
        }

        //BasicGame.music.stop();
        //BasicGame.music = null;

        this.sound.pauseAll();

        this.tweens.pauseAll();
        this.game.paused = true;

        this.pauseGroup = this.add.group();

        var bmp = this.add.bitmapData(this.game.width, this.game.height);
        bmp.rect(0,0,this.game.width, this.game.height, "rgba(0,0,0,0.5)");
        var img = this.add.image(0,0,bmp, 0, this.pauseGroup);

        var spr = this.add.sprite(this.world.centerX, this.world.centerY, "preloader", "buttonResumeGame", this.pauseGroup);
        spr.anchor.set(0.5,0.5);

        this.game.input.onDown.addOnce(this.resumeGame, this);
    },

    resumeGame: function() {
        if(this.game.paused) {
            this.pauseGroup.destroy(true);
            this.game.paused = false;
            this.sound.resumeAll();
            this.tweens.resumeAll();

            //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        }
    },

    create: function () {
        this.preloadBar.cropEnabled = true;
    },

    initGame: function() {
        this.ready = true;
        this.state.start('Game');
        this.game.onBlur.add(this.onLoseFocus, this);
    }

};
