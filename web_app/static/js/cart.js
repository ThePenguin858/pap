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
    var url = '/database/update_item/'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productID': productId, 'action':action})})
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log('data:', data)
            location.reload()
        })
}
