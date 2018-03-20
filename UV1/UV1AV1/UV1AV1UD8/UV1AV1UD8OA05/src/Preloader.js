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
		
		this.caminho = getPathFile(UV1AV1UD8OA05);

		this.load.atlas('omega', this.caminho+'anim_omega.png', this.caminho+'anim_omega.json');

		//INITIAL
		this.load.image('initialText',  this.caminho+'initialText.png');
		this.load.image('initialText2',  this.caminho+'initialText2.png');
		
		
		// SCENE
		this.load.image('background',  this.caminho+'background.png');

		this.load.atlas('bumba_idle',  this.caminho+'anim_bumba_idle.png',  this.caminho+'anim_bumba_idle.json');
		this.load.atlas('bumba_happy',  this.caminho+'anim_bumba_happy.png',  this.caminho+'anim_bumba_happy.json');

		// GAMEPLAY
		this.load.image('marca',  this.caminho+'marca1.png');

		this.load.image('tutorial_1',  this.caminho+'tutorial_1.png');
		this.load.image('tutorial_2',  this.caminho+'tutorial_2.png');
		this.load.image('tutorial_3',  this.caminho+'tutorial_3.png');

		this.load.image('final',  this.caminho+'pontofinal.png');
		this.load.image('exclamacao',  this.caminho+'exclamacao.png');
		this.load.image('interrogacao',  this.caminho+'interrogacao.png');

		this.load.image('pergunta1',  this.caminho+'texto_p1.png');
		this.load.image('frase_p1_1', this.caminho+'frase_p11.png');
		this.load.image('frase_p1_2', this.caminho+'frase_p12.png');
		this.load.image('frase_p1_3', this.caminho+'frase_p13.png');

		this.load.image('texto_p1_1',  this.caminho+'texto_p11.png');
		this.load.image('texto_p1_2',  this.caminho+'texto_p12.png');
		this.load.image('texto_p1_3',  this.caminho+'texto_p13.png');

		this.load.image('pergunta2',  this.caminho+'texto_p2.png');
		this.load.image('frase_p2_1',  this.caminho+'frase_p21.png');
		this.load.image('frase_p2_2',  this.caminho+'frase_p22.png');
		this.load.image('frase_p2_3',  this.caminho+'frase_p23.png');

		this.load.image('texto_p2_1',  this.caminho+'texto_p21.png');
		this.load.image('texto_p2_2',  this.caminho+'texto_p22.png');
		this.load.image('texto_p2_3',  this.caminho+'texto_p23.png');
		
		this.load.image('pergunta3',  this.caminho+'texto_p3.png');
		this.load.image('frase_p3_1',  this.caminho+'frase_p31.png');
		this.load.image('frase_p3_2',  this.caminho+'frase_p32.png');
		this.load.image('frase_p3_3',  this.caminho+'frase_p33.png');

		this.load.image('texto_p3_1',  this.caminho+'texto_p31.png');
		this.load.image('texto_p3_2',  this.caminho+'texto_p32.png');
		this.load.image('texto_p3_3',  this.caminho+'texto_p33.png');

		this.load.image('imgResumo',  this.caminho+'resumo_img.png');
		this.load.image('imgResumo2',  this.caminho+'resumo_img2.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD8OA05);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD8OA06_P1.mp3']);
		this.load.audio('soundP11', [this.caminho+'UV1AV1UD8OA06_P1_1.mp3']);
		this.load.audio('soundP12', [this.caminho+'UV1AV1UD8OA06_P1_2.mp3']);
		this.load.audio('soundP13', [this.caminho+'UV1AV1UD8OA06_P1_3.mp3']);

		this.load.audio('soundP2', [this.caminho+'UV1AV1UD8OA06_P2.mp3']);
		this.load.audio('soundP21', [this.caminho+'UV1AV1UD8OA06_P2_1.mp3']);
		this.load.audio('soundP22', [this.caminho+'UV1AV1UD8OA06_P2_2.mp3']);
		this.load.audio('soundP23', [this.caminho+'UV1AV1UD8OA06_P2_3.mp3']);

		this.load.audio('soundP3', [this.caminho+'UV1AV1UD8OA06_P3.mp3']);
		this.load.audio('soundP31', [this.caminho+'UV1AV1UD8OA06_P3_1.mp3']);
		this.load.audio('soundP32', [this.caminho+'UV1AV1UD8OA06_P3_2.mp3']);
		this.load.audio('soundP33', [this.caminho+'UV1AV1UD8OA06_P3_3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD8OA06_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD8OA06_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD8OA06_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD8OA06_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
