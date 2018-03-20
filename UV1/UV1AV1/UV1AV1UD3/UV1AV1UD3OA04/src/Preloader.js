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

		//ANIMAÇÕES
		this.caminho = getPathFile(UV1AV1UD3OA04);

		this.load.atlas('animacaoIntro', this.caminho+'animacao_intro.png', this.caminho+'animacao_intro.json');
		this.load.atlas('animacaoResumo', this.caminho+'animacao_resumo.png', this.caminho+'animacao_resumo.json');
		this.load.atlas('spriteLetras', this.caminho+'sprite-letras.png', this.caminho+'sprite-letras.json');
	
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');

		// SCENE
		this.load.image('background', this.caminho+'background.png');

		//IMAGENS
		this.load.image('FRight', this.caminho+'levelF_correto.png');
		this.load.image('FWrong1', this.caminho+'levelF_incorreto1.png');
		this.load.image('FWrong2', this.caminho+'levelF_incorreto2.png');
		this.load.image('FWrong3', this.caminho+'levelF_incorreto3.png');


		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');
		this.load.image('baseLetras', this.caminho+'base_letras.png');

		this.load.image('regua', this.caminho+'regua_vazia.png');


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD3OA04);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD3OA04_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD3OA04_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD3OA04_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD3OA04_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD3OA04_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD3OA04_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD3OA04_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
