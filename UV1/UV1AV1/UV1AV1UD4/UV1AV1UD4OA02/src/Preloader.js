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
        this.caminho = getPathFile(UV1AV1UD4OA02);

		this.load.image('palavraIntro', this.caminho+'palavraExemploIntro.png');
		this.load.image('palavraIntroO', this.caminho+'palavraExemploIntroO.png');
		
		// BOTÕES
		this.load.atlas('btA', this.caminho+'botaoA.png', this.caminho+'botaoA.json');
		this.load.atlas('btE', this.caminho+'botaoE.png', this.caminho+'botaoE.json');
		this.load.atlas('btI', this.caminho+'botaoI.png', this.caminho+'botaoI.json');
		this.load.atlas('btO', this.caminho+'botaoO.png', this.caminho+'botaoO.json');
		this.load.atlas('btU', this.caminho+'botaoU.png', this.caminho+'botaoU.json');

		// BOTÕES
		this.load.atlas('animIntro1', this.caminho+'botaoA.png', this.caminho+'botaoA.json');
		this.load.atlas('animIntro2', this.caminho+'botaoE.png', this.caminho+'botaoE.json');
		this.load.atlas('animIntro3', this.caminho+'botaoI.png', this.caminho+'botaoI.json');
		this.load.atlas('animIntro4', this.caminho+'botaoO.png', this.caminho+'botaoO.json');
		this.load.atlas('animIntro5', this.caminho+'botaoU.png', this.caminho+'botaoU.json');
		
		// END GAME
		this.load.image('mouseIntro', this.caminho+'intro_mouse.png');

		this.load.atlas('efeitoClique', this.caminho+'intro_efeito_clique.png', this.caminho+'intro_efeito_clique.json');

		this.load.image('letra1', this.caminho+'letraA.png');
		this.load.image('letra2', this.caminho+'letraE.png');
		this.load.image('letra3', this.caminho+'letraI.png');
		this.load.image('letra4', this.caminho+'letraO.png');
		this.load.image('letra5', this.caminho+'letraU.png');
			
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'pergunta1.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');

		//this.load.image('imgResumo', this.caminho+'resumo_img.png');
		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD4OA02);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD4OA02_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD4OA02_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD4OA02_P3.mp3']);

		this.load.audio('BARRIGA', [this.caminho+'UV1AV1UD4OA02_BARRIGA.mp3']);
		this.load.audio('BOLA', [this.caminho+'UV1AV1UD4OA02_BOLA.mp3']);
		this.load.audio('CELULAR', [this.caminho+'UV1AV1UD4OA02_CELULAR.mp3']);
		this.load.audio('CHAPEU', [this.caminho+'UV1AV1UD4OA02_CHAPEU.mp3']);
		this.load.audio('COMPUTADOR', [this.caminho+'UV1AV1UD4OA02_COMPUTADOR.mp3']);
		this.load.audio('DIA', [this.caminho+'UV1AV1UD4OA02_DIA.mp3']);
		this.load.audio('RECREIO', [this.caminho+'UV1AV1UD4OA02_RECREIO.mp3']);
		this.load.audio('RESUMO', [this.caminho+'UV1AV1UD4OA02_RESUMO.mp3']);
		this.load.audio('TELEFONE', [this.caminho+'UV1AV1UD4OA02_TELEFONE.mp3']);
		this.load.audio('TERRA', [this.caminho+'UV1AV1UD4OA02_TERRA.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD4OA02_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD4OA02_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD4OA02_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD4OA02_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
