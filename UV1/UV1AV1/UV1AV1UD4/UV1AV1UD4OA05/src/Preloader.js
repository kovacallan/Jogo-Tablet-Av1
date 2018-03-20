BasicGame.Preloader = function (game) {

    this.initExtends();

    BasicGame.PreloaderBase.call(game);
};

BasicGame.Preloader.prototype = Object.create(BasicGame.PreloaderBase.prototype);
BasicGame.Preloader.prototype.constructor = BasicGame.Preloader;

BasicGame.Preloader.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Preloader.prototype[name] = this.extends[name];
    }
};

BasicGame.Preloader.prototype.extends = {

	preload: function () {

		this.initPreloaderBase();

        //this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');

		this.caminho = getPathFile(UV1AV1UD4OA05);

		this.load.atlas('bumbaWin', this.caminho+'bumba_win.png', this.caminho+'bumba_win.json');
		this.load.atlas('fredWin', this.caminho+'fred_win.png', this.caminho+'fred_win.json');
		this.load.atlas('polyWin', this.caminho+'poly_win.png', this.caminho+'poly_win.json');
		this.load.atlas('juniorWin', this.caminho+'junior_win.png', this.caminho+'junior_win.json');

		this.load.atlas('textoVitoria1', this.caminho+'textoVitoria1.png', this.caminho+'textoVitoria1.json');
		this.load.atlas('textoVitoria2', this.caminho+'textoVitoria2.png', this.caminho+'textoVitoria2.json');
		this.load.atlas('textoVitoria3', this.caminho+'textoVitoria3.png', this.caminho+'textoVitoria3.json');
		this.load.atlas('textoVitoria4', this.caminho+'textoVitoria4.png', this.caminho+'textoVitoria4.json');
		this.load.atlas('textoVitoria5', this.caminho+'textoVitoria5.png', this.caminho+'textoVitoria5.json');

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('porta', this.caminho+'porta.png', this.caminho+'porta.json');

		this.load.atlas('pi1', this.caminho+'pi1.png', this.caminho+'pi1.json');
		this.load.atlas('pi2', this.caminho+'pi2.png', this.caminho+'pi2.json');
		this.load.atlas('pi3', this.caminho+'pi3.png', this.caminho+'pi3.json');
		this.load.atlas('pi4', this.caminho+'pi4.png', this.caminho+'pi4.json');
		this.load.atlas('pi5', this.caminho+'pi5.png', this.caminho+'pi5.json');
		this.load.atlas('pi6', this.caminho+'pi6.png', this.caminho+'pi6.json');
		this.load.atlas('pi7', this.caminho+'pi7.png', this.caminho+'pi7.json');
		this.load.atlas('pi8', this.caminho+'pi8.png', this.caminho+'pi8.json');
		this.load.atlas('pi9', this.caminho+'pi9.png', this.caminho+'pi9.json');
		this.load.atlas('pi10',this.caminho+'pi10.png',this.caminho+'pi10.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('teclado', this.caminho+'teclado.png');
		this.load.image('tecla', this.caminho+'tecla.png');

		this.load.image('chave', this.caminho+'chave.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD4OA05);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD4OA05_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD4OA5_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD4OA05_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD4OA5_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
