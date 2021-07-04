var submitButtons = document.querySelectorAll(".submitButton");
var deleteForms = document.querySelectorAll(".delete");
var field = document.querySelector("input");

for (let index = 0; index < submitButtons.length; index++) 
{
    submitButtons[index].onclick = function ()
    {
        console.log("Clicked");
        deleteForms[index].submit();
    }
}

const debounce = (func, delay = 1000) =>
{
    let timeOutID;
    return (...args) =>
    {
        if(timeOutID)
        {
            clearTimeout(timeOutID);
        }
        timeOutID = setTimeout(() => 
        {
            func.apply(null, args);
        }, delay);
    };
};

const fetchData = async (searchTerm) =>
{
    const response = await axios.get(`/entries/search/${searchTerm}`);

    return response.data.result;
};

const onInput = async ({target}) =>
{
    if(target.value)
    {
        const entries = await fetchData(target.value);
        console.log(entries);
    }
};

field.addEventListener("input", debounce(onInput, 500));
