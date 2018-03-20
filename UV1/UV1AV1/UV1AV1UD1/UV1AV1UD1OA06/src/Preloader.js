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
		this.caminho = getPathFile(UV1AV1UD1OA06);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('marca', this.caminho+'marca.png');
	
		// SCENE

		this.load.image('background', this.caminho+'background.png');
		this.load.image('quadroTutorial', this.caminho+'quadro_tutorial.png');
		this.load.image('quadro1', this.caminho+'quadro1.png');
		this.load.image('quadro2', this.caminho+'quadro2.png');
		this.load.image('quadro3', this.caminho+'quadro3.png');


		// CHARACTER ANIMATION
		this.load.atlas('etiquetas', this.caminho+'etiquetas.png', this.caminho+'etiquetas.json');


		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD1OA06);

		
		this.load.audio('soundP1', [this.caminho+'JC-UV1AV1UD1OA06-Por-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'JC-UV1AV1UD1OA06-Por-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'JC-UV1AV1UD1OA06-Por-P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'JC-UV1AV1UD1OA06-Por-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'JC-UV1AV1UD1OA06-Por-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'JC-UV1AV1UD1OA06-Por-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'JC-UV1AV1UD1OA06-Por-INTRO.mp3']);

		this.load.audiosprite("soundEtiquetas", this.caminho+"output.mp3", this.caminho+"output.json"); 

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
