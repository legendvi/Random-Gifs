//Purpose------------------------------------------------------------------------------------
//This is the main script file which calls two APIs:
// 1.https://random-word-api.herokuapp.com/word?number=1 : to get a random word
// 2.https://api.giphy.com/v1/gifs/search?api_key={API_KEY}&q={randomWord}&limit=25&offset=0&lang=en
// to get a list of gifs related to the random word fetched

//End of Purpose

//Select All DOM Elements required for ----------------------------------------------------
//button user clicks
const btnClick = document.querySelector(".btn-random");
//div where word will be rendered
const word = document.querySelector(".word");
//grid where gifs will be rendered as columns
const gifGrid = document.querySelector(".gif");
const showError = document.querySelector(".error");

//End of selecting DOM---------------------------------------------------------------

//start of listening to Event-----------------------------------------------------
//Listen click event to fetch new word
btnClick.addEventListener("click", function (e) {
  word.innerHTML = "";
  gifGrid.innerHTML = "";
  showError.innerHTML = "";
  getGiphy();
});

//End of event Listeners------------------------------------------------------------------

// start of funtions required-------------------------------------------------------------

//This funtion fetches a random word from API call and displays it to user
getRandomWord = async function () {
  try {
    const res = await fetch(
      `https://random-word-api.herokuapp.com/word?number=1`
    );
    const data = await res.json();
    const html = `<p class="display-4">Random word generated is</p>
      <p class="h1">${data[0]}</p>`;
    word.insertAdjacentHTML("afterbegin", html);
    return data[0];
  } catch (error) {
    gifGrid.insertAdjacentText("afterbegin", "Some issue in getting a word");
  }
};

//getGiphy gets a random word by calling getrandomword()
//then it gets an array of gifs from Gipphy API and and displays to user
getGiphy = async function () {
  try {
    //get random word and awaits
    const randomWord = await getRandomWord();
    //requests giphy API with fetched word
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=T150oKJwi6hHK9HZsEMxwA7WfrzpdCyo&q=${randomWord}&limit=25&offset=0&lang=en`
    );
    const value = await res.json();
    //checks if array is emoty or not
    if (value.data.length === 0) throw new Error();
    //takes each element from array
    value.data.forEach((element) => {
      let html = getGifs(element); //getGifs generates html for each gifs and returns

      gifGrid.insertAdjacentHTML("afterbegin", html); //inserts the html code returned to display
    });
  } catch (error) {
    // catches any error thrown and displays message to user
    showError.insertAdjacentText("afterbegin", "No gif Found for this Word");
  }
};
//This is a helper function that helps renders a button on each GIf based on condition
const getButton = function (data) {
  if (data.source_post_url) {
    return `<a href=${data.source_post_url} target="_blank" class="btn btn-primary">Go To GIF Source</a>`;
  } else {
    return `<p><i>No Source Post Available</i></p>`;
  }
};

//This funtions returns the html code for a gif
const getGifs = function (data) {
  return `<div class="col">
  <div class="card " style="width: 18rem">
  <object height=280rem data=${data.images.original.url}></object>
  

  <div class="card-body">
    <h5 class="card-title">${
      data.title ? data.title : "Title is not Available"
    }</h5>
    <p class="card-text">
      <p><b>Type: </b>${data.type ? data.type : "Type is not Available"}</p>
      <p><b>Source: </b>${
        data.source_tld ? data.source_tld : "No Source Available"
      }</p>
      <p><b>Rating: </b>${data.rating ? data.rating : "No Rating Available"}</p>

      <p><b>Import Date: </b>${
        data.import_datetime
          ? data.import_datetime.substring(0, 10)
          : "No Import Date Available"
      }</p>
      <p><b>Trending Date: </b>${
        data.trending_datetime.substring(0, 3) === "000"
          ? "Not Available"
          : data.trending_datetime.substring(0, 10)
      }</p>
      ${getButton(data)}
      </div>
      </div>
`;
};

// End of All functions-----------------------------------------------------------------------

//End of script file---------------------------------------------------------------------------
