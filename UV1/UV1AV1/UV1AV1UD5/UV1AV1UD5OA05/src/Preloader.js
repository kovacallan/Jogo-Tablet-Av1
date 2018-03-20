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
		this.caminho = getPathFile(UV1AV1UD5OA05);
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.atlas('introExemplo', this.caminho+'intro-exemplo.png', this.caminho+'intro-exemplo.json');

		//ANIMAÇÕES FIXAS
		this.load.atlas('juninhoFixo', 		this.caminho+'juninho_fixo.png', 	this.caminho+'juninho_fixo.json');
		this.load.atlas('polyFixo', 		this.caminho+'poly_fixa.png', 	this.caminho+'poly_fixa.json');
		this.load.atlas('juninhoCom', 		this.caminho+'juninho_comemoracao.png', 	this.caminho+'juninho_comemoracao.json');
		this.load.atlas('polyCom', 		this.caminho+'poly_comemoracao.png', 	this.caminho+'poly_comemoracao.json');

		//BOTÕES
		this.load.spritesheet('azul', this.caminho+'azul_apagado.png', 283,124);
		this.load.spritesheet('azulHover', this.caminho+'azul_aceso.png', 283,124);
		this.load.spritesheet('amarelo', this.caminho+'amarelo_apagado.png', 281,87);
		this.load.spritesheet('amareloHover', this.caminho+'amarelo_aceso.png', 281,87);
		this.load.spritesheet('verde', this.caminho+'verde_apagado.png', 281,93);
		this.load.spritesheet('verdeHover', this.caminho+'verde_aceso.png', 281,93);
		this.load.spritesheet('vermelho', this.caminho+'vermelho_apagado.png', 280,119); //apagado
		this.load.spritesheet('vermelhoHover', this.caminho+'vermelho_aceso.png', 280,119); //aceso
		
		this.load.image('imgResumo', this.caminho+'txt-resumo.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD5OA05);	

		this.load.audio('soundP', [this.caminho+'UV1AV1UD5OA5_P_1_2_3.mp3']);
		this.load.audio('amareloHover', [this.caminho+'UV1AV1UD5OA5_AMARELO.mp3']);
		this.load.audio('azulHover', [this.caminho+'UV1AV1UD5OA5_AZUL.mp3']);
		this.load.audio('verdeHover', [this.caminho+'UV1AV1UD5OA5_VERDE.mp3']);
		this.load.audio('vermelhoHover', [this.caminho+'UV1AV1UD5OA5_VERMELHO.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD5OA5_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD5OA5_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD5OA5_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD5OA5_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};