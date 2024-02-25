let frontCamera = true;
const inputElement = document.getElementById('horimetro');

$('#toggleCameraButton').click( () => {
    // Verifique se há um stream existente e pare todas as faixas de mídia se houver
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
        });
    }

    frontCamera = !frontCamera;
    initializeCamera();
});

function initializeCamera() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: (frontCamera ? 'user' : { exact: 'environment' })
        }
    })
    .then(newStream => {
        // Atribua o novo stream à variável stream
        stream = newStream;
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Erro ao acessar a câmera:', error);
    });
}