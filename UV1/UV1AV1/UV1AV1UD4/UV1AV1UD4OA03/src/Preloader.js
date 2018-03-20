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

        this.caminho = getPathFile(UV1AV1UD4OA03);

		this.load.atlas('fredFixo', this.caminho+'fred_fixo.png', this.caminho+'fred_fixo.json');
		this.load.atlas('efeitoClique', this.caminho+'intro_efeito_clique.png', this.caminho+'intro_efeito_clique.json');

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		//IMAGENS
		this.load.image('mouseIntro', this.caminho+'intro_mouse.png');



		// BUTTONS
		this.load.spritesheet('azuis1', this.caminho+'azuis_1.png', 105,51);
		this.load.spritesheet('azuis2', this.caminho+'azuis_2.png', 88,53);
		this.load.spritesheet('azuis3', this.caminho+'azuis_3.png', 174,46);
		this.load.spritesheet('azuis4', this.caminho+'azuis_4.png', 145,80);
		this.load.spritesheet('azuis5', this.caminho+'azuis_5.png', 199,145);
		this.load.spritesheet('azuis6', this.caminho+'azuis_6.png', 177,93);
		this.load.spritesheet('azuis7', this.caminho+'azuis_7.png', 207,147);
		this.load.spritesheet('azuis8', this.caminho+'azuis_8.png', 166,100);
		this.load.spritesheet('azuis9', this.caminho+'azuis_9.png', 194,135);
		this.load.spritesheet('verdes1', this.caminho+'verdes_1.png', 168,120);
		this.load.spritesheet('verdes2', this.caminho+'verdes_2.png', 129,120);
		this.load.spritesheet('verdes3', this.caminho+'verdes_3.png', 227,107);
		this.load.spritesheet('verdes4', this.caminho+'verdes_4.png', 166,95);
		this.load.spritesheet('verdes5', this.caminho+'verdes_5.png', 186,107);
		this.load.spritesheet('verdes6', this.caminho+'verdes_6.png', 167,107);
		this.load.spritesheet('vermelhas1', this.caminho+'vermelhas_1.png', 228,76);
		this.load.spritesheet('vermelhas2', this.caminho+'vermelhas_2.png', 173,76);
		this.load.spritesheet('vermelhas3', this.caminho+'vermelhas_3.png', 129,76);
		this.load.spritesheet('vermelhas4', this.caminho+'vermelhas_4.png', 177,76);
		this.load.spritesheet('vermelhas5', this.caminho+'vermelhas_5.png', 174,80);
		this.load.spritesheet('vermelhas6', this.caminho+'vermelhas_6.png', 184,93);

		// CHARACTER ANIMATION
		//this.load.atlas('sprites', this.caminho+'JC-UV1AV1UD1OA01-Mat-sprites.png', this.caminho+'JC-UV1AV1UD1OA01-Mat-sprites.json');
		this.load.atlas('poly', this.caminho+'JC-UV1AV1UD1OA03-Mat-poly.png', this.caminho+'JC-UV1AV1UD1OA03-Mat-poly.json');

		// GAMEPLAY
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');
		this.load.image('pergunta1p1', this.caminho+'pergunta1p1.png');
		this.load.image('pergunta1p2', this.caminho+'pergunta1p2.png');
		this.load.image('pergunta1p3', this.caminho+'pergunta1p3.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');

		this.load.image('resGrande', this.caminho+'resumo_grande.png');
		this.load.image('resPequeno', this.caminho+'resumo_pequeno.png');
		this.load.image('resMais', this.caminho+'resumo_mais.png');
		this.load.image('resMenos', this.caminho+'resumo_menos.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD4OA03);


		this.load.audio('pergunta1p1', [this.caminho+'UV1AV1UD4OA03_P1_opcao1.mp3']);
		this.load.audio('pergunta1p2', [this.caminho+'UV1AV1UD4OA03_P1_opcao2.mp3']);
		this.load.audio('pergunta1p3', [this.caminho+'UV1AV1UD4OA03_P1_opcao3.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD4OA03_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD4OA03_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD4OA03_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD4OA03_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD4OA03_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD4OA03_INTRO.mp3']);


	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
