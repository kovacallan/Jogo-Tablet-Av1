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
		//this.load.atlas('hud', '../../../../GLOBAL/images/hud.png', '../../../../GLOBAL/images/hud.json');
        //this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
			
		//INITIAL
		this.caminho = getPathFile(UV1AV1UD3OA03);

		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		//this.load.atlas('sprites', this.caminho+'JC-UV1AV1UD1OA01-Mat-sprites.png', this.caminho+'JC-UV1AV1UD1OA01-Mat-sprites.json');
		this.load.atlas('fotos', this.caminho+'fotos.png', this.caminho+'fotos.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('buttonModel', this.caminho+'buttonModel.png');

		this.load.image('quadros3', this.caminho+'quadros3.png');
		this.load.image('quadros4', this.caminho+'quadros4.png');
		this.load.image('quadros5', this.caminho+'quadros5.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD3OA03);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD3OA03_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD3OA03_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD3OA03_P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD3OA03_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD3OA03_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD3OA03_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD3OA03_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
