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
		this.caminho = getPathFile(UV1AV1UD8OA06);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('textResumo', this.caminho+'texto_resumo.png');
		this.load.image('arrow', this.caminho+'arrow.png');
		this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('pergunta1_1', this.caminho+'texto_p1_1.png');
		this.load.image('pergunta1_2', this.caminho+'texto_p1_2.png');
		this.load.image('pergunta1_3', this.caminho+'texto_p1_3.png');
		this.load.image('pergunta2_1', this.caminho+'texto_p2_1.png');
		this.load.image('pergunta2_2', this.caminho+'texto_p2_2.png');
		this.load.image('pergunta2_3', this.caminho+'texto_p2_3.png');
		//this.load.atlasJSONHash('jr_idle', 'images/juninho_animation.png','images/juninho_animation.json');
		this.load.atlas('numbers', this.caminho+'numbers.png',this.caminho+'numbers.json');
		
		// BUTTONS

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD8OA06);
		
		this.load.audio('pergunta1_1aud', [this.caminho+'UV1AV1UD8OA06_P1_1.mp3']);
		this.load.audio('pergunta1_2aud', [this.caminho+'UV1AV1UD8OA06_P1_2.mp3']);
		this.load.audio('pergunta1_3aud', [this.caminho+'UV1AV1UD8OA06_P1_3.mp3']);
		this.load.audio('pergunta2_1aud', [this.caminho+'UV1AV1UD8OA06_P2_1.mp3']);
		this.load.audio('pergunta2_2aud', [this.caminho+'UV1AV1UD8OA06_P2_2.mp3']);
		this.load.audio('pergunta2_3aud', [this.caminho+'UV1AV1UD8OA06_P2_3.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD8OA06_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD8OA06_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD8OA06_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD8OA06_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
