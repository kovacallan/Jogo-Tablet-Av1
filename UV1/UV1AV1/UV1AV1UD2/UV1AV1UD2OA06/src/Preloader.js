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
			
		
        this.caminho = getPathFile(UV1AV1UD2OA06);

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');

		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('nuvem', this.caminho+'nuvem.png');

		// CHARACTER ANIMATION
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');


		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD2OA06);

		this.load.audiosprite("soundItens", this.caminho+"output.mp3", this.caminho+"output.json"); 
		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD2OA6-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD2OA6-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD2OA6-P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD2OA6-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD2OA6-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD2OA6-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD2OA6-INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
