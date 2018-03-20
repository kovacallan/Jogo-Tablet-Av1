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
		this.caminho = getPathFile(UV1AV1UD5OA03);
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText11', this.caminho+'initialText1-1.png');
		this.load.image('initialText12', this.caminho+'initialText1-2.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('arrow', this.caminho+'seta_baixo.png');
		this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('abelha', this.caminho+'abelha.png', this.caminho+'abelha.json');
		this.load.atlas('bumba', this.caminho+'bumba.png', this.caminho+'bumba.json');
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');
		this.load.atlas('poly', this.caminho+'poly.png', this.caminho+'poly.json');
		this.load.atlas('junior', this.caminho+'junior.png', this.caminho+'junior.json');

		this.load.spritesheet('radio1', this.caminho+'radio1.png', 163, 24);
		this.load.spritesheet('radio2', this.caminho+'radio2.png', 85, 114);
		this.load.spritesheet('radio3', this.caminho+'radio3.png', 87, 114);
		this.load.spritesheet('radio4', this.caminho+'radio4.png', 110, 110);
		this.load.spritesheet('radio5', this.caminho+'radio5.png', 58, 58);
		this.load.spritesheet('radio6', this.caminho+'radio6.png', 256, 108);
		this.load.spritesheet('radio7', this.caminho+'radio7.png', 85, 114);

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('tutorial1', this.caminho+'tutorial1.png');
		this.load.image('tutorial2', this.caminho+'tutorial2.png');
		this.load.image('tutorial3', this.caminho+'tutorial3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');
		this.load.image('imgResumo2', this.caminho+'resumo_img2.png');

		this.load.image('caixaFrente', this.caminho+'caixa_frente.png');
		this.load.image('caixaFundo', this.caminho+'caixa_fundo.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD5OA03);	

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD5OA3_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD5OA3_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD5OA3_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD5OA3_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD5OA3_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD5OA3_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD5OA3_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
