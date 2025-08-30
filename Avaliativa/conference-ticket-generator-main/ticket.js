document.addEventListener('DOMContentLoaded', () => {
  const ticketDataString = sessionStorage.getItem('ticketData');
  
  if (ticketDataString) {
    const ticketData = JSON.parse(ticketDataString);

   
    // Seleciona os elementos pelas suas CLASSES usando querySelector
    const tituloElement = document.querySelector('.titulo-ticket');
    const emailElement = document.querySelector('.email-address'); // O e-mail no h3
    const avatarElement = document.querySelector('.ticket-avatar');
    const nameElement = document.querySelector('.ticket-name');
    const githubElement = document.querySelector('.ticket-github');
    const ticketIdElement = document.querySelector('.ticket-id');

    // Preenche os elementos com os dados
    if (tituloElement) {
      tituloElement.textContent = `Congrats, ${ticketData.name}! Your ticket is ready.`;
    }
    if (emailElement) {
      emailElement.textContent = ticketData.email;
    }
    if (avatarElement) {
      avatarElement.src = ticketData.avatarDataUrl;
    }
    if (nameElement) {
      nameElement.textContent = ticketData.name;
    }
    if (githubElement) {
      githubElement.textContent = ticketData.github;
    }
    if (ticketIdElement) {
      ticketIdElement.textContent = '#' + Math.floor(10000 + Math.random() * 90000); // Gera um ID novo aqui
    }
    
    
    // sessionStorage.removeItem('ticketData'); 
  } else {
    // Se não houver dados, você pode exibir uma mensagem ou redirecionar
    console.log("Nenhum dado de ticket encontrado.");
    const mainElement = document.querySelector('.main-ticket');
    if (mainElement) {
      mainElement.innerHTML = '<h1>Oops! Ticket data not found. Please generate your ticket again.</h1>';
    }
  }
});