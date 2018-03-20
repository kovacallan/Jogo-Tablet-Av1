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

		this.caminho = getPathFile(UV1AV1UD1OA02);

		this.load.image('resumoText', this.caminho+'resumoText.png');

		this.load.image('tutorialText1', this.caminho+'tutorial_texto1.png');
		this.load.image('tutorialText2', this.caminho+'tutorial_texto2.png');
		this.load.image('tutorialText3', this.caminho+'tutorial_texto3.png');

		this.load.image('initialText', this.caminho+'initialText.png');
		
		this.load.atlas('sprites', this.caminho+'JC-UV1AV1UD1OA02-Por-sprites.png', this.caminho+'JC-UV1AV1UD1OA02-Por-sprites.json');

		this.load.atlas('bumba', this.caminho+'JC-UV1AV1UD1OA02-Por-bumba.png', this.caminho+'JC-UV1AV1UD1OA02-Por-bumba.json');
		this.load.atlas('fred', this.caminho+'JC-UV1AV1UD1OA02-Por-fred.png', this.caminho+'JC-UV1AV1UD1OA02-Por-fred.json');
		this.load.atlas('poly', this.caminho+'JC-UV1AV1UD1OA02-Por-poly.png', this.caminho+'JC-UV1AV1UD1OA02-Por-poly.json');
		this.load.atlas('walter_jr', this.caminho+'JC-UV1AV1UD1OA02-Por-walter_jr.png', this.caminho+'JC-UV1AV1UD1OA02-Por-walter_jr.json');

		

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD1OA02);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD1OA2-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD1OA2-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD1OA2-P3.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV1UD1OA2-P4.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD1OA2-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD1OA2-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD1OA2-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD1OA2-INTRO.mp3']);

		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
