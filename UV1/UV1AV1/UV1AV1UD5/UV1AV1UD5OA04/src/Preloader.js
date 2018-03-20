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
		this.caminho = getPathFile(UV1AV1UD5OA04);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.atlas('introExemplo', this.caminho+'exemplo-intro.png', this.caminho+'exemplo-intro.json');

		//QUESTIONS
		this.load.image('pergunta1', this.caminho+'pergunta1.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');

		//BOTÕES
		this.load.spritesheet('btM', this.caminho+'bt_M.png', 53,44);
		this.load.spritesheet('btS', this.caminho+'bt_S.png', 32,42);
		this.load.spritesheet('btC', this.caminho+'bt_C.png', 34,44);
		this.load.spritesheet('btJ', this.caminho+'bt_J.png', 31,41);
		this.load.spritesheet('btN', this.caminho+'bt_N.png', 40,41);
		this.load.spritesheet('btD', this.caminho+'bt_D.png', 34,40);
		this.load.spritesheet('btB', this.caminho+'bt_B.png', 34,42);
		this.load.spritesheet('btT', this.caminho+'bt_T.png', 33,40);
		this.load.spritesheet('btG', this.caminho+'bt_G.png', 37,42);
		this.load.spritesheet('btP', this.caminho+'bt_P.png', 34,42);
		this.load.spritesheet('btL', this.caminho+'bt_L.png', 27,39);
		this.load.spritesheet('btW', this.caminho+'bt_W.png', 52,41);
		this.load.spritesheet('btR', this.caminho+'bt_R.png', 35,41);
		this.load.spritesheet('btK', this.caminho+'bt_K.png', 37,43);


		
		this.load.image('imgResumo', this.caminho+'txt-resumo.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		
		this.load.atlas('juninho_level', this.caminho+'juninho_fixo.png', this.caminho+'juninho_fixo.json');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD5OA04);	

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD5OA4_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD5OA4_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD5OA4_P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD5OA4_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD5OA4_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD5OA4_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD5OA4_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};