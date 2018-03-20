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

		this.caminho = getPathFile(GLOBAL);
        // ROBO
		this.load.atlas('robot_idle', this.caminho+'robot_idle.png',this.caminho+'robot_idle.json');


		//INITIAL
		this.caminho = getPathFile(UV1AV1UD7OA02);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		

		// CHARACTER ANIMATION
		
		// GAMEPLAY

		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'texto_resumo.png');
		
		// BUTTONS
		this.load.atlas('S1', this.caminho+'S1.png', this.caminho+'S1.json');
		this.load.atlas('S2', this.caminho+'S2.png', this.caminho+'S2.json');
		this.load.atlas('S3', this.caminho+'S3.png', this.caminho+'S3.json');
		this.load.atlas('S4', this.caminho+'S4.png', this.caminho+'S4.json');
		this.load.atlas('S5', this.caminho+'S5.png', this.caminho+'S5.json');
		this.load.atlas('S6', this.caminho+'S6.png', this.caminho+'S6.json');
		this.load.atlas('S7', this.caminho+'S7.png', this.caminho+'S7.json');
		this.load.atlas('S8', this.caminho+'S8.png', this.caminho+'S8.json');
		this.load.atlas('S9', this.caminho+'S9.png', this.caminho+'S9.json');
		this.load.atlas('S10', this.caminho+'S10.png', this.caminho+'S10.json');
		this.load.atlas('S11', this.caminho+'S11.png', this.caminho+'S11.json');
		this.load.atlas('S12', this.caminho+'S12.png', this.caminho+'S12.json');
		
		this.load.atlas('L1', this.caminho+'L1.png', this.caminho+'L1.json');
		this.load.atlas('L2', this.caminho+'L2.png', this.caminho+'L2.json');
		this.load.atlas('L3', this.caminho+'L3.png', this.caminho+'L3.json');
		this.load.atlas('L4', this.caminho+'L4.png', this.caminho+'L4.json');
		this.load.atlas('L5', this.caminho+'L5.png', this.caminho+'L5.json');
		this.load.atlas('L6', this.caminho+'L6.png', this.caminho+'L6.json');
		this.load.atlas('L7', this.caminho+'L7.png', this.caminho+'L7.json');
		this.load.atlas('L8', this.caminho+'L8.png', this.caminho+'L8.json');
		this.load.atlas('L9', this.caminho+'L9.png', this.caminho+'L9.json');
		this.load.atlas('L10', this.caminho+'L10.png',this.caminho+'L10.json');
		this.load.atlas('L11', this.caminho+'L11.png', this.caminho+'L11.json');
		this.load.atlas('L12', this.caminho+'L12.png', this.caminho+'L12.json');
		
		this.load.atlas('Z1', this.caminho+'Z1.png', this.caminho+'Z1.json');
		this.load.atlas('Z2', this.caminho+'Z2.png', this.caminho+'Z2.json');
		this.load.atlas('Z3', this.caminho+'Z3.png', this.caminho+'Z3.json');
		this.load.atlas('Z4', this.caminho+'Z4.png', this.caminho+'Z4.json');
		this.load.atlas('Z5', this.caminho+'Z5.png', this.caminho+'Z5.json');
		this.load.atlas('Z6', this.caminho+'Z6.png', this.caminho+'Z6.json');
		this.load.atlas('Z7', this.caminho+'Z7.png', this.caminho+'Z7.json');
		this.load.atlas('Z8', this.caminho+'Z8.png', this.caminho+'Z8.json');
		this.load.atlas('Z9', this.caminho+'Z9.png', this.caminho+'Z9.json');
		this.load.atlas('Z10', this.caminho+'Z10.png', this.caminho+'Z10.json');
		this.load.atlas('Z11', this.caminho+'Z11.png', this.caminho+'Z11.json');
		this.load.atlas('Z12', this.caminho+'Z12.png', this.caminho+'Z11.json');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD7OA02);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD7OA02_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD7OA02_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD7OA02_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD7OA02_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD7OA02_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD7OA02_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD7OA02_INTRO.mp3']);
	},

	
	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
