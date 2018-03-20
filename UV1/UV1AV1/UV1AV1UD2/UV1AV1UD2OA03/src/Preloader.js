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

       	// this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');

			
		//INITIAL
		this.caminho = getPathFile(UV1AV1UD2OA03);

		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('backgroundFront', this.caminho+'background_front.png');

		// CHARACTER ANIMATION
		this.load.atlas('junior', this.caminho+'junior.png', this.caminho+'junior.json');
		
		this.load.atlas('estrela_azul', this.caminho+'estrela_azul.png', this.caminho+'estrela_azul.json');
		this.load.atlas('estrela_amarela', this.caminho+'estrela_amarela.png', this.caminho+'estrela_amarela.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.image('pergunta4', this.caminho+'texto_p4.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD2OA03);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD2OA3-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD2OA3-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD2OA3-P3.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV1UD2OA3-P4.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD2OA3-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD2OA3-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD2OA3-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD2OA3-INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
