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
		this.caminho = getPathFile(UV1AV1UD3OA06);

		this.load.atlas('animacaoResumo', this.caminho+'animacao_resumo_texto.png', this.caminho+'animacao_resumo_texto.json');
		this.load.atlas('polyFixo', this.caminho+'poly_fixo.png', this.caminho+'poly_fixo.json');
		this.load.atlas('efeitoBotao', this.caminho+'botao_com_efeito.png', this.caminho+'botao_com_efeito.json');
		this.load.atlas('efeitoFumaca', this.caminho+'efeito_fumaca.png', this.caminho+'efeito_fumaca.json');
		this.load.atlas('efeitoClique', this.caminho+'intro_efeito_clique.png', this.caminho+'intro_efeito_clique.json');
		
			
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');

		// SCENE
		this.load.image('background', this.caminho+'background.png');


		//IMAGENS
		this.load.image('mostraDoce1', this.caminho+'acerto_doce1.png');
		this.load.image('mostraDoce2', this.caminho+'acerto_doce2.png');
		this.load.image('mostraDoce3', this.caminho+'acerto_doce3.png');
		this.load.image('mostraDoce4', this.caminho+'acerto_doce4.png');
		this.load.image('doceIntro', this.caminho+'intro_doce.png');
		this.load.image('mouseIntro', this.caminho+'intro_mouse.png');
		this.load.image('placaLisa', this.caminho+'placa_lisa.png');
		this.load.spritesheet('fundoBotao', this.caminho+'fundo_botao.png',129,108);

		// GAMEPLAY
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD3OA06);

		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD3OA06_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD3OA06_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD3OA06_P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD3OA06_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD3OA06_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD3OA06_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD3OA06_INTRO.mp3']);


	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
