const mainnav = document.querySelector('#navigation');
const hambutton = document.querySelector('#menu');

hambutton.addEventListener('click', () =>{
    mainnav.classList.toggle('show');

    hambutton.classList.toggle('show');
})


const links = document.querySelectorAll('nav a');
let current = window.location.pathname.split("/").pop();

if(current === "" || current === "index.html"){
  current = "index.html";
}

links.forEach(link => {
  if(link.getAttribute('href') === current){
    if(link.parentElement) {
      link.parentElement.style.backgroundColor = "black";
      link.parentElement.style.borderRadius = "25px";
    }
    link.style.color = "white";
  }
});