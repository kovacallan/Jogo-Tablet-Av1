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
		this.caminho = getPathFile(UV1AV1UD1OA05);

		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('backgroundFrente', this.caminho+'background_frente.png');

		// CHARACTER ANIMATION

		this.load.atlas('bumba', this.caminho+'bumba.png', this.caminho+'bumba.json');
		this.load.atlas('poly', this.caminho+'poly.png', this.caminho+'poly.json');
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');
		this.load.atlas('walter', this.caminho+'walter.png', this.caminho+'walter.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('tutorial1', this.caminho+'tutorial_p.png');
		this.load.image('tutorial2', this.caminho+'tutorial_m.png');
		this.load.image('tutorial3', this.caminho+'tutorial_g.png');
		this.load.image('tutorialText', this.caminho+'tutorial_text.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.load.spritesheet('frutaBanana', this.caminho+'fruta_banana.png', 233,158);
		this.load.spritesheet('frutaLaranja', this.caminho+'fruta_laranja.png', 126,132);
		this.load.spritesheet('frutaMaca', this.caminho+'fruta_maca.png', 133,135);
		this.load.spritesheet('frutaMorango', this.caminho+'fruta_morango.png', 107,95);

		this.load.image('bandeja', this.caminho+'bandeja.png');


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD1OA05);


		this.load.audio('soundP1', [this.caminho+'JC-UV1AV1UD1OA05-Mat-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'JC-UV1AV1UD1OA05-Mat-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'JC-UV1AV1UD1OA05-Mat-P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'JC-UV1AV1UD1OA05-Mat-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'JC-UV1AV1UD1OA05-Mat-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'JC-UV1AV1UD1OA05-Mat-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'JC-UV1AV1UD1OA05-Mat-INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
