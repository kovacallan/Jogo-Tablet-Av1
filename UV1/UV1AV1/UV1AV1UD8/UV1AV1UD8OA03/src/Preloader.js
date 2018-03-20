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
		this.caminho = getPathFile(UV1AV1UD8OA03);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('arrow', this.caminho+'arrow.png');
		this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.load.atlas('fred_idle', this.caminho+'anim_fred_idle.png', this.caminho+'anim_fred_idle.json');
		this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');

		this.load.atlas('poly_idle', this.caminho+'anim_poly_idle.png', this.caminho+'anim_poly_idle.json');
		this.load.atlas('poly_happy', this.caminho+'anim_poly_happy.png', this.caminho+'anim_poly_happy.json');
		this.load.atlas('sprites', this.caminho+'sprites.png', this.caminho+'sprites.json');

		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');
		this.load.image('imgResumo2', this.caminho+'resumo_img2.png');

		// GAMEPLAY
		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD8OA03);

		
	
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD8OA01_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD8OA01_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD8OA01_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD8OA01_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD8OA01_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD8OA01_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD8OA01_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
