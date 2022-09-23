const urlApi = 'https://dtw.azurewebsites.net/api'
const urlApiLinks = urlApi +  '/links';
let currentPage = 1;
let isSearchMode = false;
let addEditModal = new bootstrap.Modal(document.getElementById('addLinkModal'), {});

//LOADER
// const loader = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';


function getLinks(perPage = 10, page = 1) {
    // document.getElementById('linksContainer').innerHTML = loader;
    isSearchMode = false;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const init  = {
        method: 'GET',
        headers: headers,
    };

    const urlRequete = urlApiLinks + '?perPage=' + perPage + '&page=' + page;
    fetch(urlRequete, init)
        .then(response => {
            return response.json();
        })
        .then(response => {
            let myHtml = '';
            response.forEach(element => {
        myHtml += getCard(element.idLink,element.title, element.description, element.link, element.author.surName, element.author.foreName);
        
            });
            if(page == 1) {
                document.getElementById('linksContainer').innerHTML = myHtml;
            }
            else{
                document.getElementById('linksContainer').innerHTML += myHtml;
            }
        })
        .catch(error => {
            alert(error);
        })
}

function paginate() {
    currentPage ++;
    getLinks(15, currentPage);
}

function searchLinks() {
    isSearchMode = true;
    currentPage = 1;

    const search = document.getElementById('searchBarInput').value;

    if(search == ''|| search == undefined || search == ' ') {
        getLinks(15, currentPage);
    }
    else {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
    
        const init  = {
            method: 'GET',
            headers: headers,
        };
    
        //https://dtw.azurewebsites.net/api/links/search?search=orce
        const urlRequete = urlApiLinks + '/search?search='+search;
    
        fetch(urlRequete, init)
            .then(response => {
                    return response.json();
            })
            .then(response => {
                let myHtml = '';
                response.forEach(element => {
            myHtml += getCard(element.idLink, element.title, element.description, element.link, element.author.surName, element.author.foreName);
                });
    
                if(myHtml != '') {
                    document.getElementById('linksContainer').innerHTML = myHtml;
                }
                else {
                    document.getElementById('linksContainer').innerHTML = '<span class="text-danger">Fin d\'affichage des résultats</span>';
                }
            })
            .catch(error => {
                alert(error);
            })
    }
}


function editLinkModal(idLink) {
    document.getElementById('addLinkModalLabel').innerText = "Modifier un lien";
    document.getElementById('btnValidationAddModal').hidden = true;
    document.getElementById('btnValidationEditModal').hidden = false;
    //element de mon lien dans la modale et l'afficher
    //récupérer les val de l'util et les passer dans la modale

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const init  = {
        method: 'GET',
        headers: headers,
    };

    const urlRequete = urlApiLinks + '/' + idLink;
    fetch(urlRequete, init)
        .then(response => {
            return response.json();
        })
        .then(monLien => {
            document.getElementById('idLinkInput').value = monLien.idLink;
            document.getElementById('titreInput').value = monLien.title;
            document.getElementById('descriptionInput').value = monLien.description;
            document.getElementById('linksInput').value = monLien.link;
            document.getElementById('idAuthorInput').value = monLien.author.idUser;
        })
        .catch(error => {
            alert(error);
        })

    addEditModal.show();

}

function editLinkAction () {
    let myForm = document.getElementById('addLinkForm');
    let formObj = new FormData(myForm);

    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=UTF-8")

    const body = JSON.stringify({
        idLink: +(formObj.get('idLink')),        
        title: formObj.get('title'),
        description: formObj.get('description'),
        link: formObj.get('link'),
        idAuthor: +(formObj.get('idAuthor'))
    });

    const init = {
        method: 'PUT',
        headers: headers,
        body: body
    };

    //https://dtw.azurewebsites.net/api/links
    const urlRequete = urlApiLinks + '/'+ formObj.get('idLink');

    fetch(urlRequete, init)
        .then((response) => {
            if(response.status == 200) {
                return response.json();
            }
            else{
                alert('une erreur est survenue');
                return response;
            }
        })
        .then(element => {
            //suppr dans la page la card du lien avant modif
            document.getElementById("cardLink"+element.idLink).remove();
            //genere la card et ajoute la nouvelle dans HTML
            var myCard = getCard(element.idLink, element.title, element.description, element.link, 'Vous-même', 'A l\'instant');
            
            var html = myCard + document.getElementById('linksContainer').innerHTML;
            document.getElementById('linksContainer').innerHTML = html;
            //reset form
            myForm.reset();
            //fermeture modale
            addEditModal.hide();
        })
        .catch(error => {
            alert('Erreur : ' + error)
        });
}

function showAddLinkModal(idLink) {

    document.getElementById('btnValidationAddModal').hidden = false;
    document.getElementById('btnValidationEditModal').hidden = true;;
    document.getElementById('addLinkModalLabel').innerText = "Ajouter un lien";
//afficher la modale
    document.getElementById('idLinkInput').value = '';
    document.getElementById('titreInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('linksInput').value = '';
    document.getElementById('idAuthorInput').value = '';

    addEditModal.show();
}

function addLink(){
    let myForm = document.getElementById('addLinkForm');
    let formObj = new FormData(myForm);

    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=UTF-8")

    const body = JSON.stringify({
        title: formObj.get('title'),
        description: formObj.get('description'),
        link: formObj.get('link'),
        idAuthor: +(formObj.get('idAuthor'))
    });

    const init = {
        method: 'POST',
        headers: headers,
        body: body
    };

    //https://dtw.azurewebsites.net/api/links
    const urlRequete = urlApiLinks;

    fetch(urlRequete, init)
        .then((response) => {
            if(response.status == 201) {
                return response.json();
            }
            else{
                alert('une erreur est survenue');
                return response;
            }
        })
        .then(element => {

            var myCard = getCard(element.idLink, element.title, element.description, element.link, 'Vous-même', 'A l\'instant');
            
            var html = myCard + document.getElementById('linksContainer').innerHTML;
            document.getElementById('linksContainer').innerHTML = html;
            myForm.reset();
            addEditModal.hide();
        })
        .catch(error => {
            alert('Erreur : ' + error)
        });
}

function deleteLink(idLink) {
    if(confirm('Are you sure you want to delete this link?')) {
        //si ok appel ajax
        const headers = new Headers();

        const init  = {
            method: 'DELETE',
            headers: headers,
        };

        const urlRequete = urlApiLinks+"/"+idLink;
        
        fetch(urlRequete, init)
            .then((response) => {
                if (response.status == 200) {
                    //suppprimer le lien dans le HTML
                    document.getElementById("cardLink"+idLink).remove();

                    alert('le lien a bien été supprimé');
                }
                else {
                    alert('impossible de supprimer');
                }
            })
            .catch(error => {
                alert(error);
            });
    }
}

function getCard(idLink,title, description, link, surName, foreName){
    let myHtml = 
    `<div class="cardLinks" id="cardLink${idLink}">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">
                ${description}
                </p>
                <a href="${link}" class="btn btn-primary">
                    Go somewhere
                </a>
            </div>
            <div class="card-footer">
                <small class="text-muted">By ${surName} ${foreName}</small>
                <button onclick="deleteLink(${idLink})" class="btn btn-danger btn-delete-link"><i class="bi bi-trash"></i></button>
                <button onclick="editLinkModal(${idLink})" class="btn btn-info btn-delete-link me-3"><i class="bi bi-pencil-square"></i></button>

            </div>

        </div>
    </div>`;

        return myHtml;
}


document.addEventListener('DOMContentLoaded', function() {
    getLinks(10,1);

    window.addEventListener('scroll', () => {
        const {
            scrollTop, //ce qui est au dessus de mon écran actuel (on a déjà scroll cette partie)
            scrollHeight,//hauteur totale de mon site avec le scroll
            clientHeight,//hauteur de la zone d'affichage (de mon écran)
        } = document.documentElement;

        if (!isSearchMode) {
            //ici on va voir si on a scroll tout l'écran cela veut dire qu'on est arrivé en bas de mon écran
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                paginate();
            }
        }
            
    });

}, false);



