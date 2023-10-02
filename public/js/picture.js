const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const capturedPhoto = document.getElementById('capturedPhoto');
const captureButton = document.getElementById('captureButton');

captureButton.addEventListener('click', function() {
    // Solicitar acesso à câmera e tirar a foto
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Parar o streaming de vídeo
                    stream.getTracks().forEach(track => track.stop());

                    // Exibir a foto capturada
                    capturedPhoto.src = canvas.toDataURL('image/jpeg');

                    // Ocultar o vídeo e mostrar a foto
                    video.style.display = 'none';
                    capturedPhoto.style.display = 'block';

                    resolve();
                };
                video.play();
            });
        })
        .catch(function(error) {
            console.error('Erro ao acessar a câmera:', error);
        });
});
