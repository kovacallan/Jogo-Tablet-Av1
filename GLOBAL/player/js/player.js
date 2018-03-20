
var unidadeVideoId  = parent.document.getElementById('video_box').name;
var videoGames = new Array();

console.log("***> Player: "+unidadeVideoId);

//******************************************AVENTURA 1*************************************************************************************
var PATH_UV1AV1_CN01 = "../../ASSETS/GLOBAL/player/videos/UV1AV1/CN01/"+unidadeVideoId+".mp4";
var PATH_UV1AV1_CN02 = "../../ASSETS/GLOBAL/player/videos/UV1AV1/CN02/"+unidadeVideoId+".mp4";
var PATH_UV1AV1_VC01 = "../../ASSETS/GLOBAL/player/videos/UV1AV1/VC01/"+unidadeVideoId+".mp4";
var PATH_UV1AV1_MAPA = "../../UV1/UV1AV1/UV1AV1MAPA/";

//UV1AV1UD1
videoGames['UV1AV1UD1CN01']= new Array();
videoGames['UV1AV1UD1CN01'][0]= "../../UV1AV1UD1/UV1AV1UD1MAPA/";
videoGames['UV1AV1UD1CN01'][1]= "https://www.youtube.com/embed/jvBKDnWrxPw?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD1CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD1CN01'][3]= "B1S1CI";
videoGames['UV1AV1UD1CN01'][4]= false;

videoGames['UV1AV1UD1CN02']= new Array();
videoGames['UV1AV1UD1CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD1CN02'][1]= "https://www.youtube.com/embed/7xfHQ28fMgI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD1CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD1CN02'][3]= "B1S1CF";
videoGames['UV1AV1UD1CN02'][4]= true;

videoGames['UV1AV1UD1VC01']= new Array();
videoGames['UV1AV1UD1VC01'][0] = "../../UV1AV1UD2/UV1AV1UD1MAPA/";
videoGames['UV1AV1UD1VC01'][1] =  "https://www.youtube.com/embed/iLleqniXNbw?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD1VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD1VC01'][3] = "B1S1VC";
videoGames['UV1AV1UD1VC01'][4] = false;

//UV1AV1UD2
videoGames['UV1AV1UD2CN01']= new Array();
videoGames['UV1AV1UD2CN01'][0]= "../../UV1AV1UD2/UV1AV1UD2MAPA/";
videoGames['UV1AV1UD2CN01'][1]= "https://www.youtube.com/embed/dTlZc4UDpN8?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD2CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD2CN01'][3]= "B1S2CI";
videoGames['UV1AV1UD2CN01'][4]= false;

videoGames['UV1AV1UD2CN02']= new Array();
videoGames['UV1AV1UD2CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD2CN02'][1]= "https://www.youtube.com/embed/zzWC0h9xdHM?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD2CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD2CN02'][3]= "B1S2CF";
videoGames['UV1AV1UD2CN02'][4]= true;

videoGames['UV1AV1UD2VC01']= new Array();
videoGames['UV1AV1UD2VC01'][0] = "../../UV1AV1UD2/UV1AV1UD2MAPA/";
videoGames['UV1AV1UD2VC01'][1] =  "https://www.youtube.com/embed/c2fv0CCKIKA?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD2VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD2VC01'][3] = "B1S2VC";
videoGames['UV1AV1UD2VC01'][4] = false;

//UV1AV1UD3
videoGames['UV1AV1UD3CN01']= new Array();
videoGames['UV1AV1UD3CN01'][0]= "../../UV1AV1UD3/UV1AV1UD3MAPA/";
videoGames['UV1AV1UD3CN01'][1]= "https://www.youtube.com/embed/sRqn0miaJXI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD3CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD3CN01'][3]= "B1S3CI";
videoGames['UV1AV1UD3CN01'][4]= false;

videoGames['UV1AV1UD3CN02']= new Array();
videoGames['UV1AV1UD3CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD3CN02'][1]= "https://www.youtube.com/embed/jkOIJoxxrHk?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD3CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD3CN02'][3]= "B1S3CF";
videoGames['UV1AV1UD3CN02'][4]= true;

videoGames['UV1AV1UD3VC01']= new Array();
videoGames['UV1AV1UD3VC01'][0] = "../../UV1AV1UD3/UV1AV1UD3MAPA/";
videoGames['UV1AV1UD3VC01'][1] =  "https://www.youtube.com/embed/du0GkJeV5XM?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD3VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD3VC01'][3] = "B1S3VC";
videoGames['UV1AV1UD3VC01'][4] = false;

//UV1AV1UD4

videoGames['UV1AV1UD4CN01']= new Array();
videoGames['UV1AV1UD4CN01'][0]= "../../UV1AV1UD4/UV1AV1UD4MAPA/";
videoGames['UV1AV1UD4CN01'][1]= "https://www.youtube.com/embed/UwVybN7qJ-c?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD4CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD4CN01'][3]= "B1S4CI";
videoGames['UV1AV1UD4CN01'][4]= false;

videoGames['UV1AV1UD4CN02']= new Array();
videoGames['UV1AV1UD4CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD4CN02'][1]= "https://www.youtube.com/embed/YjoNcICW9lQ?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD4CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD4CN02'][3]= "B1S4CF";
videoGames['UV1AV1UD4CN02'][4]= true;

videoGames['UV1AV1UD4VC01']= new Array();
videoGames['UV1AV1UD4VC01'][0] = "../../UV1AV1UD4/UV1AV1UD4MAPA/";
videoGames['UV1AV1UD4VC01'][1] =  "https://www.youtube.com/embed/3bbdtrtJSng?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD4VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD4VC01'][3] = "B1S4VC";
videoGames['UV1AV1UD4VC01'][4] = false;

//UV1AV1UD5
videoGames['UV1AV1UD5CN01']= new Array();
videoGames['UV1AV1UD5CN01'][0]= "../../UV1AV1UD5/UV1AV1UD5MAPA/";
videoGames['UV1AV1UD5CN01'][1]= "https://www.youtube.com/embed/ZCRlQCYIaYw?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD5CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD5CN01'][3]= "B1S5CI";
videoGames['UV1AV1UD5CN01'][4]= false;

//"VDFIM1"
videoGames['UV1AV1UD5CN02']= new Array();
videoGames['UV1AV1UD5CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD5CN02'][1]= "https://www.youtube.com/embed/XoI0q4BLQ6s?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD5CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD5CN02'][3]= "B1S5CF";
videoGames['UV1AV1UD5CN02'][4]= true;

videoGames['UV1AV1UD5VC01']= new Array();
videoGames['UV1AV1UD5VC01'][0] = "../../UV1AV1UD5/UV1AV1UD5MAPA/";
videoGames['UV1AV1UD5VC01'][1] =  "https://www.youtube.com/embed/GhDBpYjrX4c?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD5VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD5VC01'][3] = "B1S5VC";
videoGames['UV1AV1UD5VC01'][4] = false;

//UV1AV1UD6

videoGames['UV1AV1UD6CN01']= new Array();
videoGames['UV1AV1UD6CN01'][0]= "../../UV1AV1UD6/UV1AV1UD6MAPA/";
videoGames['UV1AV1UD6CN01'][1]= "https://www.youtube.com/embed/vR5sNEJKMDY?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD6CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD6CN01'][3]= "B1S6CI";
videoGames['UV1AV1UD6CN01'][4]= false;

videoGames['UV1AV1UD6CN02']= new Array();
videoGames['UV1AV1UD6CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD6CN02'][1]= "https://www.youtube.com/embed/yLjvY9BbeqE?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD6CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD6CN02'][3]= "B1S6CF";
videoGames['UV1AV1UD6CN02'][4]= true;

videoGames['UV1AV1UD6VC01']= new Array();
videoGames['UV1AV1UD6VC01'][0] = "../../UV1AV1UD6/UV1AV1UD6MAPA/";
videoGames['UV1AV1UD6VC01'][1] =  "https://www.youtube.com/embed/4M4UP2MV26s?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD6VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD6VC01'][3] = "B1S6VC";
videoGames['UV1AV1UD6VC01'][4] = false;

//UV1AV1UD7
videoGames['UV1AV1UD7CN01']= new Array();
videoGames['UV1AV1UD7CN01'][0]= "../../UV1AV1UD7/UV1AV1UD7MAPA/";
videoGames['UV1AV1UD7CN01'][1]= "https://www.youtube.com/embed/CYwfon0K34Y?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD7CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD7CN01'][3]= "B1S7CI";
videoGames['UV1AV1UD7CN01'][4]= false;

videoGames['UV1AV1UD7CN02']= new Array();
videoGames['UV1AV1UD7CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD7CN02'][1]= "https://www.youtube.com/embed/ilt67YMO0Xk?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD7CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD7CN02'][3]= "B1S7CF";
videoGames['UV1AV1UD7CN02'][4]= true;

videoGames['UV1AV1UD7VC01']= new Array();
videoGames['UV1AV1UD7VC01'][0] = "../../UV1AV1UD7/UV1AV1UD7MAPA/";
videoGames['UV1AV1UD7VC01'][1] =  "https://www.youtube.com/embed/NNKQ-h2yHXo?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD7VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD7VC01'][3] = "B1S7VC";
videoGames['UV1AV1UD7VC01'][4] = false;

//UV1AV1UD8
videoGames['UV1AV1UD8CN01']= new Array();
videoGames['UV1AV1UD8CN01'][0]= "../../UV1AV8UD8/UV1AV1UD8MAPA/";
videoGames['UV1AV1UD8CN01'][1]= "https://www.youtube.com/embed/7CloFIow31A?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD8CN01'][2]= PATH_UV1AV1_CN01;
videoGames['UV1AV1UD8CN01'][3]= "B1S8CI";
videoGames['UV1AV1UD8CN01'][4]= false;

videoGames['UV1AV1UD8CN02']= new Array();
videoGames['UV1AV1UD8CN02'][0]= PATH_UV1AV1_MAPA;
videoGames['UV1AV1UD8CN02'][1]= "https://www.youtube.com/embed/Yj4zhZzUzjA?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD8CN02'][2]= PATH_UV1AV1_CN02;
videoGames['UV1AV1UD8CN02'][3]= "B1S8CF";
videoGames['UV1AV1UD8CN02'][4]= true;

videoGames['UV1AV1UD8VC01']= new Array();
videoGames['UV1AV1UD8VC01'][0] = "../../UV1AV1UD8/UV1AV1UD8MAPA/";
videoGames['UV1AV1UD8VC01'][1] =  "https://www.youtube.com/embed/ViVN8Oryov0?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV1UD8VC01'][2] = PATH_UV1AV1_VC01;
videoGames['UV1AV1UD8VC01'][3] = "B1S8VC";
videoGames['UV1AV1UD8VC01'][4] = false;

//******************************************AVENTURA 2*************************************************************************************

var PATH_UV1AV2_CN01 = "../../ASSETS/GLOBAL/player/videos/UV1AV2/CN01/"+unidadeVideoId+".mp4";
var PATH_UV1AV2_CN02 = "../../ASSETS/GLOBAL/player/videos/UV1AV2/CN02/"+unidadeVideoId+".mp4";
var PATH_UV1AV2_VC01 = "../../ASSETS/GLOBAL/player/videos/UV1AV2/VC01/"+unidadeVideoId+".mp4";
var PATH_UV1AV2_MAPA = "../../UV1/UV1AV2/UV1AV2MAPA/";

//UV1AV2UD1
videoGames['UV1AV2UD1CN01']= new Array();
videoGames['UV1AV2UD1CN01'][0]= "../../UV1AV2UD1/UV1AV2UD1MAPA/";
videoGames['UV1AV2UD1CN01'][1]= "https://www.youtube.com/embed/z951U_iS3D4?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD1CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD1CN01'][3]= "B2S1CI";
videoGames['UV1AV2UD1CN01'][4]= false;

videoGames['UV1AV2UD1CN02']= new Array();
videoGames['UV1AV2UD1CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD1CN02'][1]= "https://www.youtube.com/embed/bXZxQ7a_3Tc?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD1CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD1CN02'][3]= "B2S1CF";
videoGames['UV1AV2UD1CN02'][4]= true;

videoGames['UV1AV2UD1VC01']= new Array();
videoGames['UV1AV2UD1VC01'][0] = "../../UV1AV2UD1/UV1AV2UD1MAPA/";
videoGames['UV1AV2UD1VC01'][1] = "https://www.youtube.com/embed/Upd1RIcFxyw?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV2UD1VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD1VC01'][3] = "B2S1VC";
videoGames['UV1AV2UD1VC01'][4]= false;

//UV1AV2UD2
videoGames['UV1AV2UD2CN01']= new Array();
videoGames['UV1AV2UD2CN01'][0]= "../../UV1AV2UD2/UV1AV2UD2MAPA/";
videoGames['UV1AV2UD2CN01'][1]= "https://www.youtube.com/embed/mDlAOD2aV2o?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD2CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD2CN01'][3]= "B2S2CI";
videoGames['UV1AV2UD2CN01'][4]= false;

videoGames['UV1AV2UD2CN02']= new Array();
videoGames['UV1AV2UD2CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD2CN02'][1]= "https://www.youtube.com/embed/-3BDZY7eqRU?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD2CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD2CN02'][3]= "B2S2CF";
videoGames['UV1AV2UD2CN02'][4]= true;

videoGames['UV1AV2UD2VC01']= new Array();
videoGames['UV1AV2UD2VC01'][0] = "../../UV1AV2UD2/UV1AV2UD2MAPA/";
videoGames['UV1AV2UD2VC01'][1] = "https://www.youtube.com/embed/T3EoEpSEqk0?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD2VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD2VC01'][3] = "B2S2VC";
videoGames['UV1AV2UD2VC01'][4] = false;

//UV1AV2UD3
videoGames['UV1AV2UD3CN01']= new Array();
videoGames['UV1AV2UD3CN01'][0]= "../../UV1AV2UD2/UV1AV2UD3MAPA/";
videoGames['UV1AV2UD3CN01'][1]= "https://www.youtube.com/embed/za_e6RSjCZ4?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD3CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD3CN01'][3]= "B2S3CI";
videoGames['UV1AV2UD3CN01'][4]= false;

videoGames['UV1AV2UD3CN02']= new Array();
videoGames['UV1AV2UD3CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD3CN02'][1]= "https://www.youtube.com/embed/SxtLuk-k-DY?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD3CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD3CN02'][3]= "B2S3CF";
videoGames['UV1AV2UD3CN02'][4]= true;

videoGames['UV1AV2UD3VC01']= new Array();
videoGames['UV1AV2UD3VC01'][0] = "../../UV1AV2UD2/UV1AV2UD3MAPA/";
videoGames['UV1AV2UD3VC01'][1] = "https://www.youtube.com/embed/DHbNfIEYhzE?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD3VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD3VC01'][3] = "B2S3VC";
videoGames['UV1AV2UD3VC01'][4] = false;

//UV1AV2UD4
videoGames['UV1AV2UD4CN01']= new Array();
videoGames['UV1AV2UD4CN01'][0]= "../../UV1AV2UD2/UV1AV2UD4MAPA/";
videoGames['UV1AV2UD4CN01'][1]= "https://www.youtube.com/embed/gC72IH1FkdI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD4CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD4CN01'][3]= "B2S4CI";
videoGames['UV1AV2UD4CN01'][4]= false;

videoGames['UV1AV2UD4CN02']= new Array();
videoGames['UV1AV2UD4CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD4CN02'][1]= "https://www.youtube.com/embed/J8SDXOkhjoI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD4CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD4CN02'][3]= "B2S4CF";
videoGames['UV1AV2UD4CN02'][4]= true;

videoGames['UV1AV2UD4VC01']= new Array();
videoGames['UV1AV2UD4VC01'][0] = "../../UV1AV2UD2/UV1AV2UD4MAPA/";
videoGames['UV1AV2UD4VC01'][1] = "https://www.youtube.com/embed/m3kFxKN_yKU?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD4VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD4VC01'][3] = "B2S4VC";
videoGames['UV1AV2UD4VC01'][4] = false;

//UV1AV2UD5
videoGames['UV1AV2UD5CN01']= new Array();
videoGames['UV1AV2UD5CN01'][0]= "../../UV1AV2UD2/UV1AV2UD5MAPA/";
videoGames['UV1AV2UD5CN01'][1]= "https://www.youtube.com/embed/QV35jRSOr4g?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD5CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD5CN01'][3]= "B2S5CI";
videoGames['UV1AV2UD5CN01'][4]= false;

videoGames['UV1AV2UD5CN02']= new Array();
videoGames['UV1AV2UD5CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD5CN02'][1]= "https://www.youtube.com/embed/Yie73QBN73M?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD5CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD5CN02'][3]= "B2S5CF";
videoGames['UV1AV2UD5CN02'][4]= true;

videoGames['UV1AV2UD5VC01']= new Array();
videoGames['UV1AV2UD5VC01'][0] = "../../UV1AV2UD2/UV1AV2UD5MAPA/";
videoGames['UV1AV2UD5VC01'][1] = "https://www.youtube.com/embed/GlxDTABxfZY?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD5VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD5VC01'][3] = "B2S5VC";
videoGames['UV1AV2UD5VC01'][4] = false;

//UV1AV2UD6
videoGames['UV1AV2UD6CN01']= new Array();
videoGames['UV1AV2UD6CN01'][0]= "../../UV1AV2UD2/UV1AV2UD6MAPA/";
videoGames['UV1AV2UD6CN01'][1]= "https://www.youtube.com/embed/_IyivzWj5-g?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD6CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD6CN01'][3]= "B2S6CI";
videoGames['UV1AV2UD6CN01'][4]= false;

videoGames['UV1AV2UD6CN02']= new Array();
videoGames['UV1AV2UD6CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD6CN02'][1]= "https://www.youtube.com/embed/j4oZrWtGi0A?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD6CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD6CN02'][3]= "B2S6CF";
videoGames['UV1AV2UD6CN02'][4]= true;

videoGames['UV1AV2UD6VC01']= new Array();
videoGames['UV1AV2UD6VC01'][0] = "../../UV1AV2UD2/UV1AV2UD6MAPA/";
videoGames['UV1AV2UD6VC01'][1] = "https://www.youtube.com/embed/jQ3zQhicceg?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD6VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD6VC01'][3] = "B2S6VC";
videoGames['UV1AV2UD6VC01'][4] = false;

//UV1AV2UD7
videoGames['UV1AV2UD7CN01']= new Array();
videoGames['UV1AV2UD7CN01'][0]= "../../UV1AV2UD1/UV1AV2UD7MAPA/";
videoGames['UV1AV2UD7CN01'][1]= "https://www.youtube.com/embed/Et0TYPg3nF4?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD7CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD7CN01'][3]= "B2S7CI";
videoGames['UV1AV2UD7CN01'][4]= false;

videoGames['UV1AV2UD7CN02']= new Array();
videoGames['UV1AV2UD7CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD7CN02'][1]= "https://www.youtube.com/embed/_O3pvkwNpdI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD7CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD7CN02'][3]= "B2S7CF";
videoGames['UV1AV2UD7CN02'][4]= true;

videoGames['UV1AV2UD7VC01']= new Array();
videoGames['UV1AV2UD7VC01'][0] = "../../UV1AV2UD1/UV1AV2UD7MAPA/";
videoGames['UV1AV2UD7VC01'][1] = "https://www.youtube.com/embed/376Wn60Bkj4?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV2UD7VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD7VC01'][3] = "B2S7VC";
videoGames['UV1AV2UD7VC01'][4]= false;

//UV1AV2UD8
videoGames['UV1AV2UD8CN01']= new Array();
videoGames['UV1AV2UD8CN01'][0]= "../../UV1AV2UD2/UV1AV2UD8MAPA/";
videoGames['UV1AV2UD8CN01'][1]= "https://www.youtube.com/embed/DPqZ9eGShqI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD8CN01'][2]= PATH_UV1AV2_CN01;
videoGames['UV1AV2UD8CN01'][3]= "B2S8CI";
videoGames['UV1AV2UD8CN01'][4]= false;

videoGames['UV1AV2UD8CN02']= new Array();
videoGames['UV1AV2UD8CN02'][0]= PATH_UV1AV2_MAPA;
videoGames['UV1AV2UD8CN02'][1]= "https://www.youtube.com/embed/BCffJ-KkF3c?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD8CN02'][2]= PATH_UV1AV2_CN02;
videoGames['UV1AV2UD8CN02'][3]= "B2S8CF";
videoGames['UV1AV2UD8CN02'][4]= true;

videoGames['UV1AV2UD8VC01']= new Array();
videoGames['UV1AV2UD8VC01'][0] = "../../UV1AV2UD2/UV1AV2UD8MAPA/";
videoGames['UV1AV2UD8VC01'][1] = "https://www.youtube.com/embed/A9fxua3PSCY?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV2UD8VC01'][2] = PATH_UV1AV2_VC01;
videoGames['UV1AV2UD8VC01'][3] = "B2S8VC";
videoGames['UV1AV2UD8VC01'][4] = false;


//******************************************AVENTURA 3*************************************************************************************
var PATH_UV1AV3_CN01 = "../../ASSETS_2/GLOBAL/player/videos/UV1AV3/CN01/"+unidadeVideoId+".mp4";
var PATH_UV1AV3_CN02 = "../../ASSETS_2/GLOBAL/player/videos/UV1AV3/CN02/"+unidadeVideoId+".mp4";
var PATH_UV1AV3_VC01 = "../../ASSETS_2/GLOBAL/player/videos/UV1AV3/VC01/"+unidadeVideoId+".mp4";
var PATH_UV1AV3_MAPA = "../../UV1/UV1AV3/UV1AV3MAPA/";

//UV1AV3UD1
videoGames['UV1AV3UD1CN01']= new Array();
videoGames['UV1AV3UD1CN01'][0]= "../../UV1AV3UD1/UV1AV3UD1MAPA/";
videoGames['UV1AV3UD1CN01'][1]= "https://www.youtube.com/embed/_SWy99LlAVQ?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD1CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD1CN01'][3]= "B3S1CI";
videoGames['UV1AV3UD1CN01'][4]= false;

videoGames['UV1AV3UD1CN02']= new Array();
videoGames['UV1AV3UD1CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD1CN02'][1]= "https://www.youtube.com/embed/MhwIsvmrswc?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD1CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD1CN02'][3]= "B3S1CF";
videoGames['UV1AV3UD1CN02'][4]= true;

videoGames['UV1AV3UD1VC01']= new Array();
videoGames['UV1AV3UD1VC01'][0] = "../../UV1AV3UD1/UV1AV3UD1MAPA/";
videoGames['UV1AV3UD1VC01'][1] = "https://www.youtube.com/embed/O4I79Nnn8yo?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD1VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD1VC01'][3] = "B3S1VC";
videoGames['UV1AV3UD1VC01'][4]= false;

//UV1AV3UD2
videoGames['UV1AV3UD2CN01']= new Array();
videoGames['UV1AV3UD2CN01'][0]= "../../UV1AV3UD2/UV1AV3UD2MAPA/";
videoGames['UV1AV3UD2CN01'][1]= "https://www.youtube.com/embed/jpUKzHPCmes?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD2CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD2CN01'][3]= "B3S2CI";
videoGames['UV1AV3UD2CN01'][4]= false;

videoGames['UV1AV3UD2CN02']= new Array();
videoGames['UV1AV3UD2CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD2CN02'][1]= "https://www.youtube.com/embed/pzI4kjJPkJY?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD2CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD2CN02'][3]= "B3S2CF";
videoGames['UV1AV3UD2CN02'][4]= true;

videoGames['UV1AV3UD2VC01']= new Array();
videoGames['UV1AV3UD2VC01'][0] = "../../UV1AV3UD2/UV1AV3UD2MAPA/";
videoGames['UV1AV3UD2VC01'][1] = "https://www.youtube.com/embed/ovCnOrGjQ8k?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD2VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD2VC01'][3] = "B3S2VC";
videoGames['UV1AV3UD2VC01'][4]= false;

//UV1AV3UD3
videoGames['UV1AV3UD3CN01']= new Array();
videoGames['UV1AV3UD3CN01'][0]= "../../UV1AV3UD3/UV1AV3UD3MAPA/";
videoGames['UV1AV3UD3CN01'][1]= "https://www.youtube.com/embed/RenZnIDXZC4?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD3CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD3CN01'][3]= "B3S3CI";
videoGames['UV1AV3UD3CN01'][4]= false;

videoGames['UV1AV3UD3CN02']= new Array();
videoGames['UV1AV3UD3CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD3CN02'][1]= "https://www.youtube.com/embed/_Nz7UdBWZBQ?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD3CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD3CN02'][3]= "B3S3CF";
videoGames['UV1AV3UD3CN02'][4]= true;

videoGames['UV1AV3UD3VC01']= new Array();
videoGames['UV1AV3UD3VC01'][0] = "../../UV1AV3UD3/UV1AV3UD3MAPA/";
videoGames['UV1AV3UD3VC01'][1] = "https://www.youtube.com/embed/P0vzrxNDvX0?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD3VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD3VC01'][3] = "B3S3VC";
videoGames['UV1AV3UD3VC01'][4]= false;


//UV1AV3UD4
videoGames['UV1AV3UD4CN01']= new Array();
videoGames['UV1AV3UD4CN01'][0]= "../../UV1AV3UD4/UV1AV3UD4MAPA/";
videoGames['UV1AV3UD4CN01'][1]= "https://www.youtube.com/embed/Vhw4UyF8Wd8?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD4CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD4CN01'][3]= "B3S4CI";
videoGames['UV1AV3UD4CN01'][4]= false;

videoGames['UV1AV3UD4CN02']= new Array();
videoGames['UV1AV3UD4CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD4CN02'][1]= "https://www.youtube.com/embed/YiPxKgtd16o?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD4CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD4CN02'][3]= "B3S4CF";
videoGames['UV1AV3UD4CN02'][4]= true;

videoGames['UV1AV3UD4VC01']= new Array();
videoGames['UV1AV3UD4VC01'][0] = "../../UV1AV3UD4/UV1AV3UD4MAPA/";
videoGames['UV1AV3UD4VC01'][1] = "https://www.youtube.com/embed/uW2ZJ5QZmNs?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD4VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD4VC01'][3] = "B3S4VC";
videoGames['UV1AV3UD4VC01'][4]= false;


//UV1AV3UD5
videoGames['UV1AV3UD5CN01']= new Array();
videoGames['UV1AV3UD5CN01'][0]= "../../UV1AV3UD5/UV1AV3UD5MAPA/";
videoGames['UV1AV3UD5CN01'][1]= "https://www.youtube.com/embed/uNUTXPfWNRI?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD5CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD5CN01'][3]= "B3S5CI";
videoGames['UV1AV3UD5CN01'][4]= false;

videoGames['UV1AV3UD5CN02']= new Array();
videoGames['UV1AV3UD5CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD5CN02'][1]= "https://www.youtube.com/embed/Y9bYMhJpiiU?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD5CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD5CN02'][3]= "B3S5CF";
videoGames['UV1AV3UD5CN02'][4]= true;

videoGames['UV1AV3UD5VC01']= new Array();
videoGames['UV1AV3UD5VC01'][0] = "../../UV1AV3UD5/UV1AV3UD5MAPA/";
videoGames['UV1AV3UD5VC01'][1] = "https://www.youtube.com/embed/TedJnMYP0vk?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD5VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD5VC01'][3] = "B3S5VC";
videoGames['UV1AV3UD5VC01'][4]= false;

//UV1AV3UD6
videoGames['UV1AV3UD6CN01']= new Array();
videoGames['UV1AV3UD6CN01'][0]= "../../UV1AV3UD6/UV1AV3UD6MAPA/";
videoGames['UV1AV3UD6CN01'][1]= "https://www.youtube.com/embed/EXUAhFCtnLs?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD6CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD6CN01'][3]= "B3S6CI";
videoGames['UV1AV3UD6CN01'][4]= false;

videoGames['UV1AV3UD6CN02']= new Array();
videoGames['UV1AV3UD6CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD6CN02'][1]= "https://www.youtube.com/embed/FIwHWB1kgng?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD6CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD6CN02'][3]= "B3S6CF";
videoGames['UV1AV3UD6CN02'][4]= true;

videoGames['UV1AV3UD6VC01']= new Array();
videoGames['UV1AV3UD6VC01'][0] = "../../UV1AV3UD6/UV1AV3UD6MAPA/";
videoGames['UV1AV3UD6VC01'][1] = "https://www.youtube.com/embed/	?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD6VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD6VC01'][3] = "B3S6VC";
videoGames['UV1AV3UD6VC01'][4]= false;

//UV1AV3UD7
videoGames['UV1AV3UD7CN01']= new Array();
videoGames['UV1AV3UD7CN01'][0]= "../../UV1AV3UD7/UV1AV3UD7MAPA/";
videoGames['UV1AV3UD7CN01'][1]= "https://www.youtube.com/embed/kZdT__W-4Aw?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD7CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD7CN01'][3]= "B3S7CI";
videoGames['UV1AV3UD7CN01'][4]= false;

videoGames['UV1AV3UD7CN02']= new Array();
videoGames['UV1AV3UD7CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD7CN02'][1]= "https://www.youtube.com/embed/Ds31nO7Hqg0?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD7CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD7CN02'][3]= "B3S7CF";
videoGames['UV1AV3UD7CN02'][4]= true;

videoGames['UV1AV3UD7VC01']= new Array();
videoGames['UV1AV3UD7VC01'][0] = "../../UV1AV3UD7/UV1AV3UD7MAPA/";
videoGames['UV1AV3UD7VC01'][1] = "https://www.youtube.com/embed/tFM_d51je18?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD7VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD7VC01'][3] = "B3S7VC";
videoGames['UV1AV3UD7VC01'][4]= false;

//UV1AV3UD8
videoGames['UV1AV3UD8CN01']= new Array();
videoGames['UV1AV3UD8CN01'][0]= "../../UV1AV3UD8/UV1AV3UD8MAPA/";
videoGames['UV1AV3UD8CN01'][1]= "https://www.youtube.com/embed/oz-fsnEKs4g?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD8CN01'][2]= PATH_UV1AV3_CN01;
videoGames['UV1AV3UD8CN01'][3]= "B3S8CI";
videoGames['UV1AV3UD8CN01'][4]= false;

videoGames['UV1AV3UD8CN02']= new Array();
videoGames['UV1AV3UD8CN02'][0]= PATH_UV1AV3_MAPA;
videoGames['UV1AV3UD8CN02'][1]= "https://www.youtube.com/embed/lb0abd_XV4k?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0";
videoGames['UV1AV3UD8CN02'][2]= PATH_UV1AV3_CN02;
videoGames['UV1AV3UD8CN02'][3]= "B3S8CF";
videoGames['UV1AV3UD8CN02'][4]= true;

videoGames['UV1AV3UD8VC01']= new Array();
videoGames['UV1AV3UD8VC01'][0] = "../../UV1AV3UD8/UV1AV3UD8MAPA/";
videoGames['UV1AV3UD8VC01'][1] = "https://www.youtube.com/embed/freMX9ljs7Q?enablejsapi=1&html5=1&autoplay=1&showinfo=0&controls=0&rel=0"; 
videoGames['UV1AV3UD8VC01'][2] = PATH_UV1AV3_VC01;
videoGames['UV1AV3UD8VC01'][3] = "B3S8VC";
videoGames['UV1AV3UD8VC01'][4]= false;















var URL_MAPA = videoGames[unidadeVideoId][0];
var URL_YOUTUBE = videoGames[unidadeVideoId][1];
var URL_VIDEO = videoGames[unidadeVideoId][2];
var COOKIE_NAME = videoGames[unidadeVideoId][3];
var isFinalCinematic = videoGames[unidadeVideoId][4];


console.log("***  PLAYER ***");
	console.log("***> unidade: "+unidadeVideoId);
	console.log("***> URL_MAPA: "+URL_MAPA);
	console.log("***> URL_YOUTUBE: "+URL_YOUTUBE);
	console.log("***> URL_VIDEO: "+URL_VIDEO);
	console.log("***> COOKIE_NAME: "+COOKIE_NAME);
	console.log("***> isFinalCinematic: "+isFinalCinematic);






