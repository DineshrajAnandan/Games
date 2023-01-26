document.onreadystatechange = () => {
  if (document.readyState == 'complete') {
    generateProjectGrid();
  }
};

function generateProjectGrid() {
  const projectData = JSON.parse(JSON.stringify(data));
  let projectGridView = '';
  projectData.forEach((item) => {
    projectGridView += getGridItemHtmlText(item);
  });

  let container = document.querySelector('div.portfolio-container');
  container.innerHTML = projectGridView;
}

function getGridItemHtmlText(itemData) {
  const siteLink = itemData.siteLink
    ? `
  <a href="${itemData.siteLink}">
    <div class="view-sol-button"> <i class="fas fa-link"></i> View solution</div>
  </a>
  `
    : '';
  return `
    <div class="portfolio-item">
        <div class="title">${itemData.title}</div>
        <div class="challenge-flex">
        </div>
       ${siteLink}
        <div class="view-code">
            <a href="${itemData.codeLink}" target="blank">
                <i class="fab fa-github fa-lg"></i>
            </a>
        </div>
    </div>
    `;
}
