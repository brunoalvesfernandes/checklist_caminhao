$('#yes').click(()=>{
    nextLevel();
});
$('#no').click(()=>{
    mostrarMotivos();
});

function mostrarMotivos() {
    const motivosDiv = document.getElementById('motivos');
    motivosDiv.style.display = 'block';
}
function nextLevel() {

}