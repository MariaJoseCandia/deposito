saveDocumento.addEventListener('click', deleteData)

function deleteData(){
    console.log(id.value)

    fetch(url + 'api/documentos/' + id.value, {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json'
        }  
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response))
}
