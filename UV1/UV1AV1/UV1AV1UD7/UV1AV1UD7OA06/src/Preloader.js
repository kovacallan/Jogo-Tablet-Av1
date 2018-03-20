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
        // ROBO
        this.caminho = getPathFile(GLOBAL);
		this.load.atlas('robot_idle', this.caminho+'robot_idle.png',this.caminho+'robot_idle.json');


		//INITIAL
		this.caminho = getPathFile(UV1AV1UD7OA06);
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		

		// CHARACTER ANIMATION

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('textResumo', this.caminho+'texto_resumo.png');
		this.load.atlas('words', this.caminho+'words.png', this.caminho+'words.json');
		this.load.image('B_letter', this.caminho+'B.png');
		this.load.image('P_letter', this.caminho+'P.png');
		
		// BUTTONS
		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD7OA06);

		this.load.audio('P1_B_0', [this.caminho+'UV1AV1UD7OA06_P1_B_0.mp3']);
		this.load.audio('P1_B_1', [this.caminho+'UV1AV1UD7OA06_P1_B_1.mp3']);
		this.load.audio('P1_B_2', [this.caminho+'UV1AV1UD7OA06_P1_B_2.mp3']);
		this.load.audio('P1_P_3', [this.caminho+'UV1AV1UD7OA06_P1_P_3.mp3']);
		this.load.audio('P1_P_4', [this.caminho+'UV1AV1UD7OA06_P1_P_4.mp3']);
		this.load.audio('P1_P_5', [this.caminho+'UV1AV1UD7OA06_P1_P_5.mp3']);
		
		this.load.audio('P2_B_0', [this.caminho+'UV1AV1UD7OA06_P2_B_0.mp3']);
		this.load.audio('P2_B_1', [this.caminho+'UV1AV1UD7OA06_P2_B_1.mp3']);
		this.load.audio('P2_B_2', [this.caminho+'UV1AV1UD7OA06_P2_B_2.mp3']);
		this.load.audio('P2_P_3', [this.caminho+'UV1AV1UD7OA06_P2_P_3.mp3']);
		this.load.audio('P2_P_4', [this.caminho+'UV1AV1UD7OA06_P2_P_4.mp3']);
		this.load.audio('P2_P_5', [this.caminho+'UV1AV1UD7OA06_P2_P_5.mp3']);
		
		this.load.audio('P3_B_0', [this.caminho+'UV1AV1UD7OA06_P3_B_0.mp3']);
		this.load.audio('P3_B_1', [this.caminho+'UV1AV1UD7OA06_P3_B_1.mp3']);
		this.load.audio('P3_B_2', [this.caminho+'UV1AV1UD7OA06_P3_B_2.mp3']);
		this.load.audio('P3_P_3', [this.caminho+'UV1AV1UD7OA06_P3_P_3.mp3']);
		this.load.audio('P3_P_4', [this.caminho+'UV1AV1UD7OA06_P3_P_4.mp3']);
		this.load.audio('P3_P_5', [this.caminho+'UV1AV1UD7OA06_P3_P_5.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD7OA06_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD7OA06_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD7OA06_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD7OA06_INTRO.mp3']);

		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
	

};
