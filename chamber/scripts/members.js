 async function displayMembers(format) {
    try {
      const response = await fetch('data/members.json'); // path to your JSON file
      const companies = await response.json();

      const container = document.getElementById('cards');
      const table = document.createElement('table');
      container.innerHTML = '';

      companies.forEach(company => { 
        if(format == "grid"){
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
          <img loading="lazy" src="${company.image_file}" alt="${company.company_name} Logo">
          <h3>${company.company_name}</h3>
          <p>${company.address}</p>
          <p>${company.phone}</p>
          <p><a>${company.website}</a></p>
          <p class="membership"><strong>Membership Level:</strong> ${company.membership_level}</p>
        `;
          container.appendChild(card);
        }
        else if(format =="list"){
            const row = document.createElement("tr");
            row.innerHTML = `
            <td><strong>${company.company_name}</strong></td>
            <td>${company.address}</td>
            <td>${company.phone}</td>
            <td><a>${company.website}</a></td>`;

            table.appendChild(row);
           
        }
        container.appendChild(table);


      });

    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  }

  displayMembers("grid");


  const listButton = document.getElementById("list");
  const gridButton = document.getElementById("grid");
  const container = document.getElementById('cards');
  listButton.addEventListener('click', () =>{
    displayMembers("list");
    container.classList.add("list");
  })
  gridButton.addEventListener('click', () =>{
    displayMembers("grid");
    container.classList.remove("list");
  })