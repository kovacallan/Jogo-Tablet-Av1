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

		this.caminho = getPathFile(UV1AV1UD3OA01);

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('shapes', this.caminho+'shapes.png', this.caminho+'shapes.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('piece1', this.caminho+'piece1.png');
		this.load.image('piece2', this.caminho+'piece2.png');
		this.load.image('piece3', this.caminho+'piece3.png');

		this.load.image('animal1-1', this.caminho+'animal1-1.png');
		this.load.image('animal1-2', this.caminho+'animal1-2.png');
		this.load.image('animal1-3', this.caminho+'animal1-3.png');
		this.load.image('animal1-4', this.caminho+'animal1-4.png');
		this.load.image('animal1-5', this.caminho+'animal1-5.png');

		this.load.image('animal2-1', this.caminho+'animal2-1.png');
		this.load.image('animal2-2', this.caminho+'animal2-2.png');
		this.load.image('animal2-3', this.caminho+'animal2-3.png');
		this.load.image('animal2-4', this.caminho+'animal2-4.png');
		this.load.image('animal2-5', this.caminho+'animal2-5.png');

		this.load.image('animal3-1', this.caminho+'animal3-1.png');
		this.load.image('animal3-2', this.caminho+'animal3-2.png');
		this.load.image('animal3-3', this.caminho+'animal3-3.png');
		this.load.image('animal3-4', this.caminho+'animal3-4.png');
		this.load.image('animal3-5', this.caminho+'animal3-5.png');
		
		this.load.image('animalTutorial', this.caminho+'animal_tutorial.png');
		this.load.spritesheet('button', this.caminho+'buttonModel.png', 151,142);

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD3OA01);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD3OA01-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD3OA01-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD3OA01-P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD3OA01-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD3OA01-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD3OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD3OA01-INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
