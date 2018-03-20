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
		this.caminho = getPathFile(UV1AV1UD8OA02);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('textResumo', this.caminho+'texto_resumo.png');
		this.load.image('arrow', this.caminho+'arrow.png');
		this.load.atlas('clickAnimation', this.caminho+'click_animation.png', this.caminho+'click_animation.json');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// GAMEPLAY
		
		this.load.image('P1_question1', this.caminho+'P1_question1.png');
		this.load.image('P1_question2', this.caminho+'P1_question2.png');
		this.load.image('P1_question3', this.caminho+'P1_question3.png');
		
		this.load.image('P2_question1', this.caminho+'P2_question1.png');
		this.load.image('P2_question2', this.caminho+'P2_question2.png');
		this.load.image('P2_question3', this.caminho+'P2_question3.png');
		
		this.load.image('P3_question1', this.caminho+'P3_question1.png');
		this.load.image('P3_question2', this.caminho+'P3_question2.png');
		this.load.image('P3_question3', this.caminho+'P3_question3.png');
		
		this.load.image('selectable_A', this.caminho+'selectable_A.png');
		this.load.image('selectable_E', this.caminho+'selectable_E.png');
		this.load.image('selectable_I', this.caminho+'selectable_I.png');
		this.load.image('selectable_O', this.caminho+'selectable_O.png');
		this.load.image('selectable_U', this.caminho+'selectable_U.png');
		
		this.load.image('underline', this.caminho+'underlined.png');
		
		// BUTTONS

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD8OA02);
		
		this.load.audio('P1_intro', [this.caminho+'UV1AV1UD8OA02_P1.mp3']);
		this.load.audio('P2_intro', [this.caminho+'UV1AV1UD8OA02_P2.mp3']);
		this.load.audio('P3_intro', [this.caminho+'UV1AV1UD8OA02_P3.mp3']);
		
		this.load.audio('P1_question2_Aud', [this.caminho+'UV1AV1UD8OA02_P1_ALEGRIA.mp3']);
		this.load.audio('P1_question1_Aud', [this.caminho+'UV1AV1UD8OA02_P1_CORAGEM.mp3']);
		this.load.audio('P1_question3_Aud', [this.caminho+'UV1AV1UD8OA02_P1_FELICIDADE.mp3']);
 
		this.load.audio('P2_question2_Aud', [this.caminho+'UV1AV1UD8OA02_P2_BONDADE.mp3']);
		this.load.audio('P2_question1_Aud', [this.caminho+'UV1AV1UD8OA02_P2_CARINHO.mp3']);
		this.load.audio('P2_question3_Aud', [this.caminho+'UV1AV1UD8OA02_P2_ENERGIA.mp3']);
		
		this.load.audio('P3_question1_Aud', [this.caminho+'UV1AV1UD8OA02_P3_AMIZADE.mp3']);
		this.load.audio('P3_question3_Aud', [this.caminho+'UV1AV1UD8OA02_P3_DOCURA.mp3']);
		this.load.audio('P3_question2_Aud', [this.caminho+'UV1AV1UD8OA02_P3_SORRISO.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD8OA02_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD8OA02_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD8OA02_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD8OA02_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
