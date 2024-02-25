let index = 0;
const dataQuest = $('#motivos').attr('data-quest');
const dataObject = JSON.parse(dataQuest);
const sendRes = {}
nextLevel(index);

$('.center').hide();
$('.loading-container').hide();

$('#yes').click(() => {
    let currentQuest = $('.checklist-container h2').text();
    sendRes[index] = { pergunta: currentQuest, correta: true, motivo: null, foto: null };
    index++;

    nextLevel(index);
});

$('#no').click(() => {
    mostrarMotivos();
});

$('#sendall').click(() => {
    $('.checklist-container img').css('display', 'none');
    $('.checklist-container .buttons').css('display', 'none');
    $('.checklist-container h2').text('Parabéns completou o Check List');
    $('.center').fadeOut(700);
    const hori = $('#horimetro').val();
    sendRes[index] = { horimetro: hori};
    $.ajax({
        type: 'POST',
        url: '/checklist/sendres',
        dataType: 'json',
        async: false,
        data: { info: JSON.stringify(sendRes) },
        success: function (response) {
            if (response.error == false) {
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 5000);
            } else {

            }
        },
        error: function (result) {
            console.log("ERROR :" + JSON.stringify(result))
        }
    });
})

$('#enviar-problemas').click(() => {
    let motivo = $('#problema').val();
    let foto = $('#capturedPhoto').attr('src');
    enviarMotivo(motivo, foto);
});

let stream;
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

$('#captureButton').click(() => {
    capturarFoto();
});

$('#capture').click(() => {
    $('.camera').show();

    // Verifique se há um stream existente e pare todas as faixas de mídia se houver
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
        });
    }

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (newStream) {
        stream = newStream;
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.log("Erro ao acessar a câmera: " + error);
    });
});

function capturarFoto() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let foto = canvas.toDataURL('image/jpeg', 1.0);

    document.getElementById('capturedPhoto').src = foto;
    document.getElementById('capturedPhoto').style.display = 'block';

    setTimeout(() => {
        $('.camera').hide();
        document.getElementById('capturedPhoto').style.display = 'none';
        document.getElementById('capturedErro').src = foto;
        document.getElementById('capturedErro').style.display = 'block';
    }, 1000);
}

function mostrarMotivos() {
    $('#motivos').css('display', 'block');
    $('.checklist-container').css('display', 'none');
}


function enviarFoto(foto) {
    $('.loading-container').show();
    document.getElementById('capturedErro').style.display = 'none';
    $('#problema').val('');
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/checklist/enviar-foto',
            dataType: 'json',
            data: { foto: foto },
            success: function (response) {
                $('.loading-container').hide();
                if (response.error == false) {
                    resolve(response.fotoName); // Resolva a Promise com o nome da foto
                } else {
                    reject('Erro ao enviar a foto'); // Rejeite a Promise com uma mensagem de erro
                }
            },
            error: function (result) {
                $('.loading-container').hide();
                reject('Erro na requisição AJAX'); // Rejeite a Promise com uma mensagem de erro
            }
        });
    });
}

async function enviarMotivo(motivo, foto) {
    try {
        let nomeFoto = await enviarFoto(foto);

        let currentQuest = $('.checklist-container h2').text();
        sendRes[index] = { pergunta: currentQuest, correta: false, motivo: motivo, foto: nomeFoto };
        index++;
        $('#motivos').css('display', 'none');
        $('.checklist-container').css('display', 'block');
        nextLevel(index);
    } catch (error) {
        console.error('Erro ao enviar motivo:', error);
        // Lidar com o erro de forma apropriada, por exemplo, exibindo uma mensagem para o usuário
    }
}

async function nextLevel(i) {
    if (i >= dataObject.length) {
        $('.center').fadeIn(700);
    } else {
        await updateChecklistContainer(i);
    }
}

async function updateChecklistContainer(i) {
    // Exibir elemento de carregamento
    $('.loading-container').show();

    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = function() {
                // Atualizar o conteúdo do contêiner de checklist
                $('.checklist-container img').attr('src', dataObject[i].img);
                $('.checklist-container h2').text(dataObject[i].quest);

                // Esconder elemento de carregamento após a conclusão da atualização
                $('.loading-container').hide();
                resolve();
            };
            img.onerror = function() {
                // Em caso de erro ao carregar a imagem, rejeitar a Promise
                $('.loading-container').hide();
                reject(new Error('Erro ao carregar imagem'));
            };
            img.src = dataObject[i].img; // Define a URL da imagem para carregamento
        } catch (error) {
            // Em caso de erro, esconder elemento de carregamento e rejeitar a Promise
            $('.loading-container').hide();
            reject(error);
        }
    });
}