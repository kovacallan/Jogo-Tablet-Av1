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
		this.load.atlas('robot_idle', this.caminho+'robot_idle.png',this.caminho+'robot_idle.json');

		//INITIAL
		this.caminho = getPathFile(UV1AV1UD7OA04);

		this.load.image('initialText', this.caminho+'texto_intro.png');
		this.load.image('initialText2', this.caminho+'texto_intro2.png');
		
		// END GAME
		this.load.image('background', this.caminho+'background.png');

		// GAMEPLAY
		
		this.load.image('holder', this.caminho+'words_Holder.png');
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		
		this.load.image('p1_verso1txt', this.caminho+'p1_verso1.png');
		this.load.image('p1_verso2txt', this.caminho+'p1_verso2.png');
		this.load.image('p1_verso3txt', this.caminho+'p1_verso3.png');
		
		this.load.image('p2_verso1txt', this.caminho+'p2_verso1.png');
		this.load.image('p2_verso2txt', this.caminho+'p2_verso2.png');
		this.load.image('p2_verso3txt', this.caminho+'p2_verso3.png');
		
		this.load.image('p3_verso1txt', this.caminho+'p3_verso1.png');
		this.load.image('p3_verso2txt', this.caminho+'p3_verso2.png');
		this.load.image('p3_verso3txt', this.caminho+'p3_verso3.png');
		
		this.load.atlas('rhymes', this.caminho+'rima.png', this.caminho+'rima.json');
		this.load.atlas('words', this.caminho+'words_Empty.png',this.caminho+'words_Empty.json');
		
		this.load.image('imgResumo2', this.caminho+'texto_resumo2.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD7OA04);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD7OA04_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD7OA04_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD7OA04_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD7OA04_INTRO.mp3']);
		this.load.audio('CallToAction', [this.caminho+'UV1AV1UD7OA04_CALL_TO_ACTION.mp3']);
		
		this.load.audio('level1_1_1', [this.caminho+'UV1AV1UD7OA04_P1_VAO.mp3']);
		this.load.audio('level1_1_2', [this.caminho+'UV1AV1UD7OA04_P1_VAI.mp3']);
		this.load.audio('level1_1_3', [this.caminho+'UV1AV1UD7OA04_P1_FOI.mp3']);
		this.load.audio('level1_2_1', [this.caminho+'UV1AV1UD7OA04_P1_ACREDITAR.mp3']);
		this.load.audio('level1_2_2', [this.caminho+'UV1AV1UD7OA04_P1_SABER.mp3']);
		this.load.audio('level1_2_3', [this.caminho+'UV1AV1UD7OA04_P1_FUGIR.mp3']);
		this.load.audio('level1_3_1', [this.caminho+'UV1AV1UD7OA04_P1_SORRINDO.mp3']);
		this.load.audio('level1_3_2', [this.caminho+'UV1AV1UD7OA04_P1_RIR.mp3']);
		this.load.audio('level1_3_3', [this.caminho+'UV1AV1UD7OA04_P1_SORRIU.mp3']);
		
		this.load.audio('level2_1_1', [this.caminho+'UV1AV1UD7OA04_P2_VOANDO.mp3']);
		this.load.audio('level2_1_2', [this.caminho+'UV1AV1UD7OA04_P2_VOOU.mp3']);
		this.load.audio('level2_1_3', [this.caminho+'UV1AV1UD7OA04_P2_VOAR.mp3']);
		this.load.audio('level2_2_1', [this.caminho+'UV1AV1UD7OA04_P2_SEGUNDO.mp3']);
		this.load.audio('level2_2_2', [this.caminho+'UV1AV1UD7OA04_P2_MINUTO.mp3']);
		this.load.audio('level2_2_3', [this.caminho+'UV1AV1UD7OA04_P2_HORA.mp3'])
		this.load.audio('level2_3_1', [this.caminho+'UV1AV1UD7OA04_P2_FOR.mp3']);
		this.load.audio('level2_3_2', [this.caminho+'UV1AV1UD7OA04_P2_LUGAR.mp3']);
		this.load.audio('level2_3_3', [this.caminho+'UV1AV1UD7OA04_P2_ALI.mp3']);
		
		this.load.audio('level3_1_1', [this.caminho+'UV1AV1UD7OA04_P3_PALHACADA.mp3']);
		this.load.audio('level3_1_2', [this.caminho+'UV1AV1UD7OA04_P3_BRINCADEIRA.mp3']);
		this.load.audio('level3_1_3', [this.caminho+'UV1AV1UD7OA04_P3_DANCAR.mp3']);
		this.load.audio('level3_2_1', [this.caminho+'UV1AV1UD7OA04_P3_ALEGRIA.mp3']);
		this.load.audio('level3_2_2', [this.caminho+'UV1AV1UD7OA04_P3_FELICIDADE.mp3']);
		this.load.audio('level3_2_3', [this.caminho+'UV1AV1UD7OA04_P3_PAZ.mp3']);
		this.load.audio('level3_3_1', [this.caminho+'UV1AV1UD7OA04_P3_PERIGOS.mp3']);
		this.load.audio('level3_3_2', [this.caminho+'UV1AV1UD7OA04_P3_OBSTACULOS.mp3']);
		this.load.audio('level3_3_3', [this.caminho+'UV1AV1UD7OA04_P3_EXERCICIOS.mp3']);

		this.load.audio('p1_verso1', [this.caminho+'UV1AV1UD7OA04_P1_VERSO1.mp3']);
		this.load.audio('p1_verso2', [this.caminho+'UV1AV1UD7OA04_P1_VERSO2.mp3']);
		this.load.audio('p1_verso3', [this.caminho+'UV1AV1UD7OA04_P1_VERSO3.mp3']);
		this.load.audio('p2_verso1', [this.caminho+'UV1AV1UD7OA04_P2_VERSO1.mp3']);
		this.load.audio('p2_verso2', [this.caminho+'UV1AV1UD7OA04_P2_VERSO2.mp3']);
		this.load.audio('p2_verso3', [this.caminho+'UV1AV1UD7OA04_P2_VERSO3.mp3']);
		this.load.audio('p3_verso1', [this.caminho+'UV1AV1UD7OA04_P3_VERSO1.mp3']);
		this.load.audio('p3_verso3', [this.caminho+'UV1AV1UD7OA04_P3_VERSO3.mp3']);
		this.load.audio('p3_verso2', [this.caminho+'UV1AV1UD7OA04_P3_VERSO2.mp3']);
		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
