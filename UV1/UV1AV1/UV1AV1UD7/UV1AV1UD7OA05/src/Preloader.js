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

		//INITIAL

		this.caminho = getPathFile(UV1AV1UD7OA05);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('arrow', this.caminho+'arrow.png');
		this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('sombra_maze',this.caminho+'sombra_maze.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');


		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.load.image('maze_1', this.caminho+'maze_1.png');
		this.load.image('maze_2', this.caminho+'maze_2.png');
		this.load.image('maze_3', this.caminho+'maze_3.png');
		
		this.load.atlas('caminho_1', this.caminho+'maze_caminho_11.png', this.caminho+'maze_caminho_11.json');
		this.load.atlas('caminho_2', this.caminho+'maze_caminho_2.png', this.caminho+'maze_caminho_2.json');
		this.load.atlas('caminho_3', this.caminho+'maze_caminho_31.png', this.caminho+'maze_caminho_31.json');
		
		this.load.atlas('joaninha', this.caminho+'joaninha.png',this.caminho+'joaninha.json');
		this.load.atlas('joaninha1', this.caminho+'joaninha1.png',this.caminho+'joaninha.json');

		this.load.atlas('teste', this.caminho+'teste.png', this.caminho+'teste.json');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD7OA05);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD7OA05_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD7OA05_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD7OA05_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD7OA05_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD7OA05_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD7OA05_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD7OA05_INTRO.mp3']);
	},
	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
