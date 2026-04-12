window.onload = function () {
    document.querySelector("form").reset();
};


const outputDiv = document.getElementById("output");

// get query string from URL
const params = new URLSearchParams(window.location.search);

// extract values
const name = params.get("name");
const email = params.get("email");
const purpose = params.get("select");
const message = params.get("message");

// display in div
outputDiv.innerHTML = `
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Purpose:</strong> ${purpose}</p>
  <p><strong>Message:</strong> ${message}</p>
`;