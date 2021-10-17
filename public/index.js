var PORT = process.env.PORT || 5000

//get the form by its id
const form = document.getElementById("contact-form");

//1. event listener for when the user submits the form.
const formEvent = form.addEventListener("submit", (event) => {
    event.preventDefault();

    //2.create a FormData object based on the input values and their name attributes in the form.
    let mail = new FormData(form);

    //3. uses Fetch API to post the mail to the url 
    sendMail(mail);
})


const sendMail = (mail) => {
    //1.
    fetch("https://contact-form.herokuapp.com/", {
      method: "post", //2.
      body: mail, //3.
  
    }).then((response) => {
      return response.json();
    });
  };
  