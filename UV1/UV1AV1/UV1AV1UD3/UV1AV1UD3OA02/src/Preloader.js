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
		this.caminho = getPathFile(UV1AV1UD3OA02);

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.load.image('bolachaTutorial1', this.caminho+'bolachaTutorial1.png');
		this.load.image('bolachaTutorial2', this.caminho+'bolachaTutorial2.png');

		// CHARACTER ANIMATION
		this.load.atlas('sprites', this.caminho+'sprites.png', this.caminho+'sprites.json');
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');

		this.load.atlas('poeira', this.caminho+'poeira.png', this.caminho+'poeira.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');
		
		this.load.spritesheet('buttonModel', this.caminho+'buttonModel.png', 151,142);

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD3OA02);


		this.load.audiosprite('audiosprite', this.caminho+'output.mp3',  this.caminho+"output.json");

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD3OA02_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD3OA02_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD3OA02_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD3OA02_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD3OA02_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD3OA02_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD3OA02_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
