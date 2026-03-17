const currentyear = document.querySelector("#current-year");

const today = new Date();
currentyear.innerHTML = `${today.getFullYear()}`;

const lastmodified = document.querySelector("#last-modif");

lastmodified.innerHTML = `Last Modification: ${document.lastModified}`;