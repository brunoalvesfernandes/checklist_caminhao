$('.disconnect').click(() => {
    window.location.href = 'dashboard/logout';
})

$('.inspection').click(() =>{
    window.location.href = '/checklist';
})

$.ajax({
    type: "GET",
    url: '/dashboard/inspec',
    dataType: 'json',
    success: function (response) {
        if (response.error == false) {
            $('.inspecionado').css('color', 'green')
            $('.inspecionado').text("Parabens, você já fez a inspeção de hoje!")
        } else {
            $('.inspecionado').css('color', 'red')
            $('.inspecionado').text(response.error)
        }
    },
    error: function (result) {
        console.log("ERROR :" + JSON.stringify(result))
        // Se houver um erro de rede ou outro tipo de erro
    }
});

$(".menu img").click(() => {
    $(".menu input").click();
});

$(".menu input").change((event) => {
    const file = event.target.files[0];
    if (file) {
        convertImageToBase64(file, function(base64data) {
            // Envie a imagem
            $.ajax({
                type: 'POST',
                url: '/checklist/updatePerfilImg',
                dataType: 'json',
                data: { foto: base64data },
                success: function(response) {
                    if (response.error == false) {
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 1000);
                    } else {
                        console.log(response.error)
                    }
                },
                error: function(result) {
                    console.error('Erro ao enviar o arquivo:', result);
                    // Trate o erro, se necessário
                }
            });
        });
    }
});

// Função para converter uma imagem para base64
function convertImageToBase64(file, callback) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const base64data = canvas.toDataURL('image/jpeg');

            callback(base64data);
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}