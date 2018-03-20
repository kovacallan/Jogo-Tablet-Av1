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
		
		this.caminho = getPathFile(UV1AV1UD6OA03);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		this.load.atlas('passaro1', this.caminho+'passaro1.png', this.caminho+'passaro1.json');
		this.load.atlas('passaro2', this.caminho+'passaro2.png', this.caminho+'passaro2.json');

		this.load.image('poste', this.caminho+'poste.png');
		this.load.image('folhas', this.caminho+'folhas.png');
		this.load.image('nuvem', this.caminho+'nuvem.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD6OA03);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD6OA3_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD6OA3_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD6OA3_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD6OA3_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
