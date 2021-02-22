var buttons = document.getElementsByClassName('update-cart')

for(i = 0; i < buttons.length; i++)
{
    buttons[i].addEventListener('click',function(){
        var productID = this.dataset.attribute
        var action = this.dataset.action
        if(user == "AnonymousUser")
        {
            console.log("AnonymouseUser")
        }else{
            updateUserOrder(productID, action)
        }
    })
}

function updateUserOrder(productId, action){
    // Create a response, a JSON page that is
    // It will have the productId and action so that the python view
    // that is mapped to take care of every data that comes its place
    //
    var url = '/database/update_item/'

    // As this is a call to the promise API, two .then methods have been created
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productID': productId, 'action':action})})
    // When the asynchronous call above completes, these guys are called only once
        .then((response) => {
            return response.json()
        })
    // This only gets called if the above response is executed
        .then((data) => {
            console.log('data:', data)
            location.reload()
        })
}
