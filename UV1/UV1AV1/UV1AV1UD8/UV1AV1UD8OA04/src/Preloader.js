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
		this.caminho = getPathFile(UV1AV1UD8OA04);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('textResumo', this.caminho+'texto_resumo.png');
	
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.atlas('door_1', this.caminho+'/door_1.png',this.caminho+'door_1.json');
		this.load.atlas('door_2', this.caminho+'door_2.png', this.caminho+'door_2.json');
		this.load.atlas('door_3', this.caminho+'door_3.png', this.caminho+'door_3.json');
		this.load.atlas('jr_idle', this.caminho+'juninho_animation.png',this.caminho+'juninho_animation.json');
		this.load.atlas('words', this.caminho+'palavras.png',this.caminho+'palavras.json');
		
		// BUTTONS
		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD8OA04);
		
		this.load.audio('pergunta1aud', [this.caminho+'UV1AV1UD8OA04_P1.mp3']);
		this.load.audio('pergunta2aud', [this.caminho+'UV1AV1UD8OA04_P2.mp3']);
		this.load.audio('pergunta3aud', [this.caminho+'UV1AV1UD8OA04_P3.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD8OA04_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD8OA04_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD8OA04_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD8OA04_INTRO.mp3']);

		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
