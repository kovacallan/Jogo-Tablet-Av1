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
		this.caminho = getPathFile(UV1AV1UD3OA05);

		this.load.atlas('animacaoIntro', this.caminho+'animacao_intro.png', this.caminho+'animacao_intro.json');
		this.load.atlas('animacaoResumo', this.caminho+'animacao_resumo.png', this.caminho+'animacao_resumo.json');
		this.load.atlas('polyFixo', this.caminho+'poly_fixo.png', this.caminho+'poly_fixo.json');
		this.load.atlas('menino1Fixo', this.caminho+'menino1_fixo.png', this.caminho+'menino1_fixo.json');
		this.load.atlas('menino2Fixo', this.caminho+'menino2_fixo.png', this.caminho+'menino2_fixo.json');
		this.load.atlas('polyComemoracao', this.caminho+'poly_comemoracao.png', this.caminho+'poly_comemoracao.json');
		this.load.atlas('menino1Comemoracao', this.caminho+'menino1_comemoracao.png', this.caminho+'menino1_comemoracao.json');
		this.load.atlas('menino2Comemoracao', this.caminho+'menino2_comemoracao.png', this.caminho+'menino2_comemoracao.json');

		this.load.atlas('balao1anim', this.caminho+'balao1entrada.png', this.caminho+'balao1entrada.json');
		this.load.atlas('balao2anim', this.caminho+'balao2anim.png', this.caminho+'balao2anim.json');
		this.load.atlas('balao3anim', this.caminho+'balao3anim.png', this.caminho+'balao3anim.json');
		this.load.atlas('animacaoTeclado', this.caminho+'animacao_teclado_intro.png', this.caminho+'animacao_teclado_intro.json');

			
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');

		// SCENE
		this.load.image('background', this.caminho+'background.png');


		//IMAGENS
		this.load.image('FRight', this.caminho+'levelF_correto.png');
		this.load.image('FWrong1', this.caminho+'levelF_incorreto1.png');
		this.load.image('FWrong2', this.caminho+'levelF_incorreto2.png');
		this.load.image('FWrong3', this.caminho+'levelF_incorreto3.png');
		this.load.image('MRight', this.caminho+'levelM_correto.png');
		this.load.image('MWrong1', this.caminho+'levelM_incorreto1.png');
		this.load.image('MWrong2', this.caminho+'levelM_incorreto2.png');
		this.load.image('MWrong3', this.caminho+'levelM_incorreto3.png');
		this.load.image('DRight', this.caminho+'levelD_correto.png');
		this.load.image('DWrong1', this.caminho+'levelD_incorreto1.png');
		this.load.image('DWrong2', this.caminho+'levelD_incorreto2.png');
		this.load.image('DWrong3', this.caminho+'levelD_incorreto3.png');


		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD3OA05);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD3OA05_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD3OA05_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD3OA05_P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD3OA05_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD3OA05_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD3OA05_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD3OA05_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
