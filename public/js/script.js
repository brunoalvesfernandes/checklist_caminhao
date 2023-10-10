$('#yes').click(()=>{
    nextLevel();
});
$('#no').click(()=>{
    mostrarMotivos();
});

function mostrarMotivos() {
    $('#motivos').css('display','block');
    $('.checklist-container').css('display','none');
}
function nextLevel() {

}