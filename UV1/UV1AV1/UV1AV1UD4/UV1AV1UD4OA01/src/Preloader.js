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
        this.caminho = getPathFile(UV1AV1UD4OA01);

		this.load.atlas('bumbaFixo', this.caminho+'bumba_fixo.png', this.caminho+'bumba_fixo.json');
		this.load.atlas('efeitoClique', this.caminho+'intro_efeito_clique.png', this.caminho+'intro_efeito_clique.json');

		this.load.atlas('efParafuso1', this.caminho+'efeito_parafuso_1.png', this.caminho+'efeito_parafuso_1.json');
		this.load.atlas('efParafuso2', this.caminho+'efeito_parafuso_2.png', this.caminho+'efeito_parafuso_2.json');
		this.load.atlas('efParafuso3', this.caminho+'efeito_parafuso_3.png', this.caminho+'efeito_parafuso_3.json');
		this.load.atlas('efParafuso4', this.caminho+'efeito_parafuso_4.png', this.caminho+'efeito_parafuso_4.json');
		this.load.atlas('efParafuso5', this.caminho+'efeito_parafuso_5.png', this.caminho+'efeito_parafuso_5.json');
		this.load.atlas('efParafuso6', this.caminho+'efeito_parafuso_6.png', this.caminho+'efeito_parafuso_6.json');
		this.load.atlas('efParafuso7', this.caminho+'efeito_parafuso_7.png', this.caminho+'efeito_parafuso_7.json');
		this.load.atlas('efParafuso8', this.caminho+'efeito_parafuso_8.png', this.caminho+'efeito_parafuso_8.json');
		this.load.atlas('efParafuso9', this.caminho+'efeito_parafuso_9.png', this.caminho+'efeito_parafuso_9.json');
		this.load.atlas('efParafuso10', this.caminho+'efeito_parafuso_10.png', this.caminho+'efeito_parafuso_10.json');


		this.load.spritesheet('parafuso1', this.caminho+'parafuso_1.png', 58, 60);
		this.load.spritesheet('parafuso2', this.caminho+'parafuso_2.png', 58, 60);
		this.load.spritesheet('parafuso3', this.caminho+'parafuso_3.png', 58, 60);
		this.load.spritesheet('parafuso4', this.caminho+'parafuso_4.png', 58, 60);
		this.load.spritesheet('parafuso5', this.caminho+'parafuso_5.png', 58, 60);
		this.load.spritesheet('parafuso6', this.caminho+'parafuso_6.png', 58, 60);
		this.load.spritesheet('parafuso7', this.caminho+'parafuso_7.png', 58, 60);
		this.load.spritesheet('parafuso8', this.caminho+'parafuso_8.png', 58, 60);
		this.load.spritesheet('parafuso9', this.caminho+'parafuso_9.png', 58, 60);
		this.load.spritesheet('parafuso10', this.caminho+'parafuso_10.png', 58, 60);

			
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');

		// SCENE
		this.load.image('background', this.caminho+'background.png');

		//IMAGENS
		this.load.image('mouseIntro', this.caminho+'intro_mouse.png');

		// CHARACTER ANIMATION
		this.load.atlas('poly', this.caminho+'JC-UV1AV1UD1OA03-Mat-poly.png', this.caminho+'JC-UV1AV1UD1OA03-Mat-poly.json');

		// GAMEPLAY
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD4OA01);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD4OA01_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD4OA01_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD4OA01_P3.mp3']);
		this.load.audio('soundF-3', [this.caminho+'UV1AV1UD4OA01_1-2.mp3']);
		this.load.audio('soundF-4', [this.caminho+'UV1AV1UD4OA01_1-3.mp3']);
		this.load.audio('soundF-5', [this.caminho+'UV1AV1UD4OA01_1-4.mp3']);
		this.load.audio('soundM-6', [this.caminho+'UV1AV1UD4OA01_1-5.mp3']);
		this.load.audio('soundM-7', [this.caminho+'UV1AV1UD4OA01_1-6.mp3']);
		this.load.audio('soundM-8', [this.caminho+'UV1AV1UD4OA01_1-7.mp3']);
		this.load.audio('soundD-9', [this.caminho+'UV1AV1UD4OA01_1-8.mp3']);
		this.load.audio('soundD-10', [this.caminho+'UV1AV1UD4OA01_1-9.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD4OA01_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD4OA01_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD4OA01_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD4OA01_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
