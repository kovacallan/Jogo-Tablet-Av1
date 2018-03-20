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
			
		this.caminho = getPathFile(UV1AV1UD1OA03);


		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		//this.load.image('marca', this.caminho+'marca.png');
		
		// SCENE
		this.load.image('cenarioBack', this.caminho+'cenario_back.png');
		this.load.image('cenarioFront', this.caminho+'cenario_frente.png');

		// CHARACTER ANIMATION
		
		this.load.atlas('poly', this.caminho+'JC-UV1AV1UD1OA03-Mat-poly.png', this.caminho+'JC-UV1AV1UD1OA03-Mat-poly.json')

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'pergunta1.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');

		this.load.atlas('spriteNumeros', this.caminho+'sprites-numeros.png', this.caminho+'sprites-numeros.json');
		this.load.image('regua', this.caminho+'regua_vazia.png');
		this.load.image('maos', this.caminho+'maos.png');
		this.load.image('numerosTutorial', this.caminho+'numeros.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD1OA03);


		this.load.audio('soundP1', [this.caminho+'JC-UV1AV1UD1OA03-Mat-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'JC-UV1AV1UD1OA03-Mat-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'JC-UV1AV1UD1OA03-Mat-P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'JC-UV1AV1UD1OA03-Mat-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'JC-UV1AV1UD1OA03-Mat-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'JC-UV1AV1UD1OA03-Mat-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'JC-UV1AV1UD1OA03-Mat-INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
