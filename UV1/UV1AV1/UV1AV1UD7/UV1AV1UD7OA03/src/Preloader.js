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

		this.caminho = getPathFile(UV1AV1UD7OA03);


		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('initialText3', this.caminho+'initialText3.png');
	
		// SCENE
		this.load.image('background', this.caminho+'background.png');


		this.load.atlas('poly', this.caminho+'poly.png', this.caminho+'poly.json');
		this.load.atlas('walter', this.caminho+'walter.png', this.caminho+'walter.json');
		//this.load.image('walter', 'images/walter.png');

		// itens 
		this.load.atlas('pacotes', this.caminho+'pacotes.png', this.caminho+'pacotes.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.image('pergunta4', this.caminho+'texto_p4.png');


		// resumo
		this.load.image('plus', this.caminho+'plus.png');
		this.load.image('equal', this.caminho+'equal.png');
		this.load.image('cinco', this.caminho+'cinco.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD7OA03);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD7OA03_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD7OA03_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD7OA03_P3.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV1UD7OA03_P4.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD7OA03_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD7OA03_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD7OA03_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD7OA03_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
