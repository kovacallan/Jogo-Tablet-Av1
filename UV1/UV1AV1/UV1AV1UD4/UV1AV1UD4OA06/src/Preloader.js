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

        this.caminho = getPathFile(UV1AV1UD4OA06);

		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('initialText', this.caminho+'initialText.png');
		
		this.load.image('teclado', this.caminho+'teclado.png');
		this.load.image('teclaF', this.caminho+'teclaF.png');
		this.load.image('teclaV', this.caminho+'teclaV.png');

		// CHARACTER ANIMATION
		this.load.atlas('pi1', this.caminho+'pi1.png', this.caminho+'pi1.json');
		this.load.atlas('pi2', this.caminho+'pi2.png', this.caminho+'pi2.json');
		this.load.atlas('red1', this.caminho+'red1.png', this.caminho+'red1.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD4OA06);


		this.load.audio('soundP', [this.caminho+'UV1AV1UD4OA06_P.mp3']);

		this.load.audio('sound_bife', [this.caminho+'UV1AV1UD4OA06_BIFE.mp3']);
		this.load.audio('sound_bravo', [this.caminho+'UV1AV1UD4OA06_BRAVO.mp3']);
		this.load.audio('sound_cavalo', [this.caminho+'UV1AV1UD4OA06_CAVALO.mp3']);
		this.load.audio('sound_cravo', [this.caminho+'UV1AV1UD4OA06_CRAVO.mp3']);
		this.load.audio('sound_faca', [this.caminho+'UV1AV1UD4OA06_FACA.mp3']);
		this.load.audio('sound_fada', [this.caminho+'UV1AV1UD4OA06_FADA.mp3']);
		this.load.audio('sound_foca', [this.caminho+'UV1AV1UD4OA06_FOCA.mp3']);
		this.load.audio('sound_tofu', [this.caminho+'UV1AV1UD4OA06_TOFU.mp3']);
		this.load.audio('sound_tufo', [this.caminho+'UV1AV1UD4OA06_TUFO.mp3']);
		this.load.audio('sound_vaca', [this.caminho+'UV1AV1UD4OA06_VACA.mp3']);
		this.load.audio('sound_vara', [this.caminho+'UV1AV1UD4OA06_VARA.mp3']);
		this.load.audio('sound_voar', [this.caminho+'UV1AV1UD4OA06_VOAR.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD4OA06_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD4OA06_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD4OA06_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD4OA06_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
