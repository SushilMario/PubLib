var submitButtons = document.querySelectorAll(".submitButton");
var deleteForms = document.querySelectorAll(".delete");

for (let index = 0; index < submitButtons.length; index++) 
{
    submitButtons[index].onclick = function ()
    {
        console.log("Clicked");
        deleteForms[index].submit();
    }
}

