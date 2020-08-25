var audio_click;

$( document ).ready(function() {
    var btn_audio_click = document.getElementById('id_btn_click');
    audio_click = document.getElementById('id_audio_click');
    btn_audio_click.addEventListener('click', function() {play_sound();} );  
});

function play_sound()
{
    console.log("HI");
    audio_click.play();
}