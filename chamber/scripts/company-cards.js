  async function loadCompanyCards() {
      try {
        const response = await fetch('data/members.json');
        if(!response.ok) throw new Error('Failed to load members.json');
        const companies = await response.json();

        // Pick 3 random companies
        const shuffled = companies.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        const grid = document.getElementById('companyGrid');

        selected.forEach(company => {
          const card = document.createElement('div');
          card.classList.add('company-card');

          card.innerHTML = `
            <h2>${company.company_name}</h2>
            <div class="company-content">
              <img src="${company.image_file}" alt="${company.company_name} logo">
              <div>
                <span><strong>Address:</strong> ${company.address}</span>
                <span><strong>Phone:</strong> ${company.phone}</span>
                <span><strong>Url:</strong> ${company.website}</span>
              </div>
            </div>
          `;

          grid.appendChild(card);
        });

      } catch (error) {
        console.error(error);
        document.getElementById('companyGrid').innerHTML = '<p>Failed to load company cards.</p>';
      }
    }

    loadCompanyCards();