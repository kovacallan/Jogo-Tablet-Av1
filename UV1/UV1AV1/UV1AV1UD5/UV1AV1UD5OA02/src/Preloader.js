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
        ///this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
        this.caminho = getPathFile(UV1AV1UD5OA02);
		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.atlas('introExemplo', this.caminho+'exemplo-intro.png', this.caminho+'exemplo-intro.json');

		//QUESTIONS
		this.load.image('pergunta1', this.caminho+'pergunta1.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');



		//PALAVRAS (BOTÕES)
		this.load.image('J1', this.caminho+'J1.png');
		this.load.image('J2', this.caminho+'J2.png');
		this.load.image('J3', this.caminho+'J3.png');
		this.load.image('J4', this.caminho+'J4.png');
		this.load.image('J5', this.caminho+'J5.png');
		this.load.image('J6', this.caminho+'J6.png');
		this.load.image('J7', this.caminho+'J7.png');
		this.load.image('J8', this.caminho+'J8.png');
		this.load.image('J9', this.caminho+'J9.png');
		this.load.image('M1', this.caminho+'M1.png');
		this.load.image('M2', this.caminho+'M2.png');
		this.load.image('M3', this.caminho+'M3.png');
		this.load.image('M4', this.caminho+'M4.png');
		this.load.image('M5', this.caminho+'M5.png');
		this.load.image('M6', this.caminho+'M6.png');
		this.load.image('M7', this.caminho+'M7.png');
		this.load.image('M8', this.caminho+'M8.png');
		this.load.image('M9', this.caminho+'M9.png');
		this.load.image('N1', this.caminho+'N1.png');
		this.load.image('N2', this.caminho+'N2.png');
		this.load.image('N3', this.caminho+'N3.png');
		this.load.image('N4', this.caminho+'N4.png');
		this.load.image('N5', this.caminho+'N5.png');
		this.load.image('N6', this.caminho+'N6.png');
		this.load.image('N7', this.caminho+'N7.png');
		this.load.image('N8', this.caminho+'N8.png');
		this.load.image('N9', this.caminho+'N9.png');


		this.load.image('base1', this.caminho+'porta_J.png');
		this.load.image('base2', this.caminho+'porta_M.png');
		this.load.image('base3', this.caminho+'porta_N.png');

		this.load.image('imgResumo', this.caminho+'txt-resumo.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD5OA02);	


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD5OA02_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD5OA02_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD5OA02_P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD5OA02_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD5OA02_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD5OA02_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD5OA02_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
