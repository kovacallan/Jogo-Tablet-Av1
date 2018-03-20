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
        this.caminho = getPathFile(GLOBAL_FONT);
        
        this.load.bitmapFont('Janda', this.caminho+'janda.png',this.caminho+'janda.fnt');
			
		//INITIAL
		this.caminho = getPathFile(UV1AV1UD5OA06);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.atlas('introExemplo', this.caminho+'exemplo-intro.png', this.caminho+'exemplo-intro.json');
		
		//QUESTIONS
		this.load.image('pergunta1', this.caminho+'pergunta1.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');
		
		//BOTÕES
		this.load.image('bgPalavra', this.caminho+'button.png');

		this.load.spritesheet('P', this.caminho+'bt_P.png', 31,53);
		this.load.spritesheet('p', this.caminho+'bt_Ppq.png', 29,63);
		this.load.spritesheet('F', this.caminho+'bt_F.png', 27,53);
		this.load.spritesheet('f', this.caminho+'bt_Fpq.png', 31,52);
		this.load.spritesheet('J', this.caminho+'bt_J.png', 33,52);
		this.load.spritesheet('j', this.caminho+'bt_Jpq.png', 29,73);
		this.load.spritesheet('B', this.caminho+'bt_B.png', 37,53);
		this.load.spritesheet('b', this.caminho+'bt_Bpq.png', 29,53);
		this.load.spritesheet('C', this.caminho+'bt_C.png', 35,53);
		this.load.spritesheet('c', this.caminho+'bt_Cpq.png', 25,41);
		this.load.spritesheet('M', this.caminho+'bt_M.png', 39,54);
		this.load.spritesheet('m', this.caminho+'bt_Mpq.png', 36,42);
		this.load.spritesheet('I', this.caminho+'bt_I.png', 29,52);
		this.load.spritesheet('i', this.caminho+'bt_Ipq.png', 14,54);
		this.load.spritesheet('A', this.caminho+'bt_A.png', 38,53);
		this.load.spritesheet('a', this.caminho+'bt_Apq.png', 29,43);
			
		this.load.image('imgResumo', this.caminho+'resumoImg1.png');
		this.load.image('imgResumo2',this.caminho+'resumoImg2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD5OA06);	

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD5OA6_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD5OA6_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD5OA6_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD5OA6_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD5OA6_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD5OA6_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD5OA6_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};