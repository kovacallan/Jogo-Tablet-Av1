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
        this.caminho = getPathFile(UV1AV1UD5OA01);

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.load.atlas('bumba', this.caminho+'bumba.png', this.caminho+'bumba.json');

		this.load.atlas('sprites', this.caminho+'sprites.png', this.caminho+'sprites.json');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD5OA01);	


		this.load.audio('soundP123', [this.caminho+'UV1AV1UD5OA1_P1_2_3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD5OA1_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD5OA1_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD5OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD5OA1_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
	
};
