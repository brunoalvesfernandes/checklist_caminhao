// Acesse os valores dos atributos data-inspec e data-check usando jQuery
const inspecData = $('#inspec').data('inspec');
const checkData = $('#check').data('check');
let quest = []
let active = false
async function carregar(){
    try {
        quest = await getQuest()
    } catch (error) {
        console.log(error)
    }
    quest = JSON.parse(quest.quest)
    async function getQuest() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: '/checklist/select-quest',
                dataType: 'json',
                success: function (response) {
                    if (response.error == false) {
                        resolve(response.quest);
                    } else {
                        reject('Erro ao enviar os dados');
                    }
                },
                error: function (result) {
                    console.log("ERROR :" + JSON.stringify(result))
                    reject('Erro ao enviar os dados');
                }
            });
        });
        
    }

    $('.loading-container').hide();
    let html = '<h1>PERGUNTAS</h1><div class="separador"></div>';
    if(quest){
        for (let index = 0; index < quest.length; index++) {
            html += `<div>
                <h5>NUMERO ${quest[index].id} </h5>
                <div class="separador"></div></br>
                <div class="image-container">
                    <i class="bi bi-camera-fill icon-camera" onclick="editImg(${quest[index].id})"></i>
                    <img src="${quest[index].img}">
                </div>
                <h4>${quest[index].quest}</h4></br>
                <div class="btn-quest">
                    <button id="edit" onclick="editQuest(${quest[index].id})">EDITAR</button>
                    <button id="del" onclick="delQuest(${quest[index].id})">EXCLUIR</button>
                </div>
                <div class="separador"></div></div>
            `
        }

        html += `<button id="add" onclick="addQuest(${quest.length + 1})">ADICIONAR</button>`;
    }else {
        html += `<button id="add" onclick="addQuest(1)">ADICIONAR</button>`;
    }

    $('.questionario').html(html)

    $('.menu-amburguer').click(() => {
        active = !active
        active ? $('.menu_').fadeIn(200) : $('.menu_').fadeOut(200)
    })

    $('#quest').click((event) => {
        removeClass()
        $(event.currentTarget).addClass('active');

        if (window.innerWidth < 1151) {
            active = !active
            $('.menu_').fadeOut(200)
        }
        displayNoneAll()
        $('.questionario').show()
    })

    $('#logout'). click(()=>{
        window.location.href = 'dashboard/logout';
    })

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
}

function displayNoneAll() {
    $('.center > div').css('display', 'none');
}

function removeClass() {
    $('.menu_ li.active').removeClass('active');
}

function showConfirm() {
    $('.confirm').css('display', 'block');
    $('.overlay').css('display', 'block');
    return new Promise(resolve => {
        $('#yes').click(() => {
            resolve(true); // Resolvendo a promessa com true se o botão "Sim" for clicado
        });
        $('#no').click(() => {
            resolve(false); // Resolvendo a promessa com false se o botão "Não" for clicado
        });
    });
}

function showEdit() {
    $('.editP').css('display', 'block');
    $('.overlay').css('display', 'block');
    return new Promise((resolve, reject) => {
        $('#save').click(() => {
            const newValue = $('#questX').val();
            resolve(newValue);
        });
        $('#cancel').click(() => {
            reject(false);
        });
    });
}

function hideConfirm() {
    $('.confirm').css('display', 'none');
    $('.overlay').css('display', 'none');
}

function hideEdit() {
    $('.editP').css('display', 'none');
    $('.overlay').css('display', 'none');
}

async function addQuest(ultimo) {
    try {
        let data = await addQuestModal(ultimo);
        if(data){
            quest.push(data);
            updateDisplay();
        }
    } catch (error) {
        console.log("Error: "+ error)
    }
}

async function editQuest(id) {
    let i = id - 1;
    $('.questA').html(quest[i].quest);

    try {
        const index = quest.findIndex(item => item.id === id);
        if (index !== -1) {
            try {
                let edit = await showEdit();
                if(edit){
                    quest[index].quest = edit;
                    updateDisplay();
                    hideEdit();
                    $('.questA').html('');
                    $('#questX').val('');
                }
            } catch (error) {
                hideEdit();
                $('.questA').html('');
                $('#questX').val('');
            }
            
        } else {
            console.error("Questão com ID não encontrada:", id);
        }
    } catch (error) {
        console.error("Erro ao editar imagem:", error);
        // Handle any errors, e.g., display an error message to the user
    }
}

async function editImg(id) {
    try {
        const index = quest.findIndex(item => item.id === id);
        if (index !== -1) {
            try {
                const newImgSrc = await showImageEditModal();
                if (newImgSrc) {
                    quest[index].img = newImgSrc;
                    updateDisplay();
                }
            } catch (error) {
                console.log(error)
            }
            
        } else {
            console.error("Questão com ID não encontrada:", id);
        }
    } catch (error) {
        console.error("Erro ao editar imagem:", error);
        // Handle any errors, e.g., display an error message to the user
    }
}

async function addQuestModal(id) {
    return new Promise((resolve, reject) => {
        const modal = createModal();
        modal.showQuest()
        // Tab 1: Link
        const linkTab = $('#link-tab');
        const linkInput = $('#link-input');
        const linkPreview = $('#link-preview');
        const questInput = $('#quest-input')

        linkInput.on('input', () => {
            const imgSrc = linkInput.val();
            linkPreview.attr('src', imgSrc); // Update preview image
        });

        // Tab 2: Upload
        const uploadTab = $('#upload-tab');
        const uploadInput = $('#upload-input');
        const uploadPreview = $('#upload-preview');

        uploadInput.on('change', () => {
            const file = uploadInput[0].files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const imgSrc = reader.result;
                uploadPreview.attr('src', imgSrc); // Update preview image
            };

            reader.readAsDataURL(file);
        });

        // Modal buttons
        const cancelButton = $('#cancel-button');
        const confirmButton = $('#confirm-button');

        cancelButton.on('click', () => {
            modal.closeQuest();
            reject("Operação cancelada");
        });
        confirmButton.on('click', async () => {
            let imgSrc;
            let qInput = questInput.val()

            if (linkTab.hasClass('active')) {
                imgSrc = linkInput.val();
            } else if (uploadTab.hasClass('active')) {
                const file = uploadInput[0].files[0];
                imgSrc = await uploadImage(file); // Upload image and return its URL
            }

            if (imgSrc) {
                modal.closeQuest(); // Close modal and return image source
                resolve({
                    "id": id,
                    "img": imgSrc,
                    "quest": qInput
                });
            } else {
                // Display error message
                modal.closeQuest(); 
                alert("Erro ao obter a imagem. Tente novamente.");
                reject("Erro ao obter a imagem. Tente novamente.");
            }
        });
    });
}


async function showImageEditModal() {
    return new Promise((resolve, reject) => {
        const modal = createModal();
        modal.show()
        // Tab 1: Link
        const linkTab = $('#link-tab');
        const linkInput = $('#link-input');
        const linkPreview = $('#link-preview');

        linkInput.on('input', () => {
            const imgSrc = linkInput.val();
            linkPreview.attr('src', imgSrc); // Update preview image
        });

        // Tab 2: Upload
        const uploadTab = $('#upload-tab');
        const uploadInput = $('#upload-input');
        const uploadPreview = $('#upload-preview');

        uploadInput.on('change', () => {
            const file = uploadInput[0].files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const imgSrc = reader.result;
                uploadPreview.attr('src', imgSrc); // Update preview image
            };

            reader.readAsDataURL(file);
        });

        // Modal buttons
        const cancelButton = $('#cancel-button');
        const confirmButton = $('#confirm-button');

        cancelButton.on('click', () => {
            modal.close();
            reject("Operação cancelada");
        });
        confirmButton.on('click', async () => {
            let imgSrc;

            if (linkTab.hasClass('active')) {
                imgSrc = linkInput.val();
            } else if (uploadTab.hasClass('active')) {
                const file = uploadInput[0].files[0];
                imgSrc = await uploadImage(file); // Upload image and return its URL
            }

            if (imgSrc) {
                modal.close(); // Close modal and return image source
                resolve(imgSrc);
            } else {
                // Display error message
                modal.close(); 
                alert("Erro ao obter a imagem. Tente novamente.");
                reject("Erro ao obter a imagem. Tente novamente.");
            }
        });
    });
}


function createModal() {
    if ($('.modal').length) {
        // Remove o modal existente
        $('.modal').remove();
    }
    const modal = $('<div class="modal fade"></div>');
    modal.html(`
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Imagem</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="link-tab" data-bs-toggle="pill" data-bs-target="#link-content" type="button" role="tab" aria-controls="link-content" aria-selected="true">Link</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="upload-tab" data-bs-toggle="pill" data-bs-target="#upload-content" type="button" role="tab" aria-controls="upload-content" aria-selected="false">Upload</button>
                        </li>
                    </ul>
                    
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="link-content" role="tabpanel" aria-labelledby="link-tab">
                            <div class="mb-3">
                                <input type="text" placeholder="https://link.com/imagem.png" id="link-input" class="form-control">
                            </div>
                            <img id="link-preview" class="img-thumbnail d-none" alt="Imagem de pré-visualização">
                        </div>
                        
                        <div class="tab-pane fade" id="upload-content" role="tabpanel" aria-labelledby="upload-tab">
                            <div class="mb-3">
                                <input type="file" id="upload-input" class="form-control">
                            </div>
                            <img id="upload-preview" class="img-thumbnail d-none" alt="Imagem de pré-visualização">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="confirm-button">Confirmar</button>
                </div>
            </div>
        </div>
    `);
    const modal2 = $('<div class="modal fade"></div>');
    modal2.html(`
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar pergunta</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="quest-input">Coloque a pergunta desejada abaixo:</label>
                        <input type="text" id="quest-input" class="form-control">
                    </div>
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="link-tab" data-bs-toggle="pill" data-bs-target="#link-content" type="button" role="tab" aria-controls="link-content" aria-selected="true">Link</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="upload-tab" data-bs-toggle="pill" data-bs-target="#upload-content" type="button" role="tab" aria-controls="upload-content" aria-selected="false">Upload</button>
                        </li>
                    </ul>
                    
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="link-content" role="tabpanel" aria-labelledby="link-tab">
                            <div class="mb-3">
                                <input type="text" placeholder="https://link.com/imagem.png" id="link-input" class="form-control">
                            </div>
                            <img id="link-preview" class="img-thumbnail d-none" alt="Imagem de pré-visualização">
                        </div>
                        
                        <div class="tab-pane fade" id="upload-content" role="tabpanel" aria-labelledby="upload-tab">
                            <div class="mb-3">
                                <label for="upload-input">Selecione uma imagem:</label>
                                <input type="file" id="upload-input" class="form-control">
                            </div>
                            <img id="upload-preview" class="img-thumbnail d-none" alt="Imagem de pré-visualização">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="confirm-button">Confirmar</button>
                </div>
            </div>
        </div>
    `);

    // Funções para mostrar e fechar o modal
    modal.show = () => $('body').append(modal);
    modal.close = () => modal.hide();
    modal.showQuest = () => $('body').append(modal2);
    modal.closeQuest = () => modal2.hide();

    return modal;
}

async function uploadImage(foto) {
    $('.loading-container').show();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function() {
            convertImageToBase64(foto, function(base64data) {
                // Envie a imagem
                $.ajax({
                    type: 'POST',
                    url: '/checklist/enviar-foto',
                    dataType: 'json',
                    data: { foto: base64data },
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
            
        };

        // Ler o arquivo como um URL de dados
        reader.readAsDataURL(foto);
    });
}

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

async function delQuest(id) {
    if (await showConfirm()) {
        const index = quest.findIndex(item => item.id === id);
        if (index !== -1) {
            quest.splice(index, 1);
            for (let i = index; i < quest.length; i++) {
                quest[i].id = i + 1;
            }
            hideConfirm()
            updateDisplay();
        }
    } else {
        hideConfirm()
    }
}

async function updateDisplay() {
    let html = '<h1>PERGUNTAS</h1><div class="separador"></div>';
    for (let index = 0; index < quest.length; index++) {
        html += `<div>
            <h5>NUMERO ${quest[index].id} </h5>
            <div class="separador"></div></br>
            <div class="image-container">
                <i class="bi bi-camera-fill icon-camera" onclick="editImg(${quest[index].id})"></i>
                <img src="${quest[index].img}">
            </div>
            <h4>${quest[index].quest}</h4></br>
            <div class="btn-quest">
                <button id="edit" onclick="editQuest(${quest[index].id})">EDITAR</button>
                <button id="del" onclick="delQuest(${quest[index].id})">EXCLUIR</button>
            </div>
            <div class="separador"></div></div>
        `;
    }
    html += `<button id="add" onclick="addQuest(${quest.length + 1})">ADICIONAR</button>`;
    $('.questionario').html(html);

    await updateBD();
}

async function updateBD() {
    $('.loading-container').show();
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/checklist/update-quest',
            dataType: 'json',
            data: { quest: JSON.stringify(quest) },
            success: function (response) {
                $('.loading-container').hide();
                if (response.error == false) {
                    resolve('Sucesso'); // Resolva a Promise com o nome da foto
                } else {
                    reject('Erro ao enviar os dados'); // Rejeite a Promise com uma mensagem de erro
                }
            },
            error: function (result) {
                $('.loading-container').hide();
                reject('Erro na requisição AJAX'); // Rejeite a Promise com uma mensagem de erro
            }
        });
    });
}
carregar()