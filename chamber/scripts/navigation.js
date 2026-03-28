const mainnav = document.querySelector('#navigation');
const hambutton = document.querySelector('#menu');

hambutton.addEventListener('click', () =>{
    mainnav.classList.toggle('show');

    hambutton.classList.toggle('show');
})


const links = document.querySelectorAll('nav a');
const current = window.location.pathname.split("/").pop();

links.forEach(link => {
  if(link.getAttribute('href') === current){
    link.parentElement.style.backgroundColor="black";
    link.style.color="white";
  
  }
});