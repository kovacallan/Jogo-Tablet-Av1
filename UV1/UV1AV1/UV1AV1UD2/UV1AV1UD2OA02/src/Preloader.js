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
		
		
        this.caminho = getPathFile(UV1AV1UD2OA02);


		this.load.atlas('polyRegador', this.caminho+'poly_regador.png', this.caminho+'poly_regador.json');
		this.load.atlas('tecladoIntro', this.caminho+'teclado_intro.png', this.caminho+'teclado_intro.json');
		this.load.atlas('arvoreCresce', this.caminho+'arvore_crescer.png', this.caminho+'arvore_crescer.json');
		this.load.atlas('resumoVogais', this.caminho+'resumo_vogais.png', this.caminho+'resumo_vogais.json');
		
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');


		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.image('florIntro', this.caminho+'flor_intro.png');
		this.load.image('computador', this.caminho+'painel-letra.png');

		this.load.image('arvoreMurcha', this.caminho+'arvore_murcha.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD2OA02);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD2OA2-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD2OA2-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD2OA2-P3.mp3']);


		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD2OA2-FINAL.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD2OA2-INTRO.mp3']);
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD2OA2-DICA.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD2OA2-RESUMO.mp3']);
		this.load.audio('typ1-A', [this.caminho+'UV1AV1UD2OA2-Atipo1.mp3']);
		this.load.audio('typ2-A', [this.caminho+'UV1AV1UD2OA2-Atipo2.mp3']);
		this.load.audio('typ3-A', [this.caminho+'UV1AV1UD2OA2-Atipo3.mp3']);
		this.load.audio('typ1-E', [this.caminho+'UV1AV1UD2OA2-Etipo1.mp3']);
		this.load.audio('typ2-E', [this.caminho+'UV1AV1UD2OA2-Etipo2.mp3']);
		this.load.audio('typ3-E', [this.caminho+'UV1AV1UD2OA2-Etipo3.mp3']);
		this.load.audio('typ1-I', [this.caminho+'UV1AV1UD2OA2-Itipo1.mp3']);
		this.load.audio('typ2-I', [this.caminho+'UV1AV1UD2OA2-Itipo2.mp3']);
		this.load.audio('typ3-I', [this.caminho+'UV1AV1UD2OA2-Itipo3.mp3']);
		this.load.audio('typ1-O', [this.caminho+'UV1AV1UD2OA2-Otipo1.mp3']);
		this.load.audio('typ2-O', [this.caminho+'UV1AV1UD2OA2-Otipo2.mp3']);
		this.load.audio('typ3-O', [this.caminho+'UV1AV1UD2OA2-Otipo3.mp3']);
		this.load.audio('typ1-U', [this.caminho+'UV1AV1UD2OA2-Utipo1.mp3']);
		this.load.audio('typ2-U', [this.caminho+'UV1AV1UD2OA2-Utipo2.mp3']);
		this.load.audio('typ3-U', [this.caminho+'UV1AV1UD2OA2-Utipo3.mp3']);

		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
