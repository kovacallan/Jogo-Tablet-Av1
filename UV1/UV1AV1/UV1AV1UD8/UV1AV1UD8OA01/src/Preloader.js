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

        this.caminho = getPathFile(UV1AV1UD8OA01);

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('arrow', this.caminho+'arrow.png');
		this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.load.atlas('bumba_idle', this.caminho+'anim_bumba_idle.png', this.caminho+'anim_bumba_idle.json');
		this.load.atlas('bumba_happy', this.caminho+'anim_bumba_happy.png', this.caminho+'anim_bumba_happy.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('imgResumo', this.caminho+'resumo_img.png');
		this.load.image('vidro', this.caminho+'vidro.png');
		this.load.image('bolas', this.caminho+'bolas.png');
		this.load.image('bolas1', this.caminho+'bolas1.png');
		this.load.image('15', this.caminho+'15.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD8OA01);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD8OA03_P1.mp3']);
	
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD8OA03_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD8OA03_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD8OA03_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD8OA03_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
	

};
