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
		this.caminho = getPathFile(UV1AV1UD7OA01);
		

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText22.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('background1', this.caminho+'background1.png');
		
		this.load.atlas('fred_idle', this.caminho+'fred_idle.png', this.caminho+'fred_idle.json');
		this.load.atlas('fred_happy', this.caminho+'fred_happy.png', this.caminho+'fred_happy.json');

		// GAMEPLAY
		this.load.image('marca', this.caminho+'marca.png');

		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p1.png');
		this.load.image('pergunta3', this.caminho+'texto_p1.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		// 20/04/2015

		this.load.atlas('1', this.caminho+'H1.png', this.caminho+'H1.json');
		this.load.atlas('2', this.caminho+'H2.png', this.caminho+'H2.json');
		this.load.atlas('3', this.caminho+'H3.png', this.caminho+'H3.json');
		this.load.atlas('4', this.caminho+'H4.png', this.caminho+'H4.json');
		this.load.atlas('5', this.caminho+'H5.png', this.caminho+'H5.json');
		this.load.atlas('6', this.caminho+'H6.png', this.caminho+'H6.json');
		this.load.atlas('7', this.caminho+'H7.png', this.caminho+'H7.json');
		this.load.atlas('8', this.caminho+'H8.png', this.caminho+'H8.json');
		this.load.atlas('9', this.caminho+'H9.png', this.caminho+'H9.json');
		this.load.atlas('10', this.caminho+'H10.png', this.caminho+'H10.json');
		this.load.atlas('11', this.caminho+'H11.png', this.caminho+'H11.json');
		this.load.atlas('12', this.caminho+'H12.png', this.caminho+'H12.json');
		this.load.atlas('13', this.caminho+'H13.png', this.caminho+'H13.json');
		this.load.atlas('14', this.caminho+'H14.png', this.caminho+'H14.json');
		this.load.atlas('15', this.caminho+'H15.png', this.caminho+'H15.json');
		this.load.atlas('16', this.caminho+'H16.png', this.caminho+'H16.json');
		this.load.atlas('17', this.caminho+'H17.png', this.caminho+'H17.json');
		this.load.atlas('18', this.caminho+'H18.png', this.caminho+'H18.json');
		this.load.atlas('19', this.caminho+'H19.png', this.caminho+'H19.json');
		this.load.atlas('20', this.caminho+'H20.png', this.caminho+'H20.json');


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD7OA01);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD7OA01_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD7OA01_P1.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD7OA01_P1.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD7OA01_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD7OA01_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD7OA01_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD7OA01_INTRO.mp3']);
		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
