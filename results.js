// results.js
const params = new URLSearchParams(window.location.search);
const avg = params.get('avg');

document.getElementById('result').textContent = 
  avg
    ? `Your average artist popularity is: ${parseFloat(avg).toFixed(2)}`
    : "No popularity score available.";
