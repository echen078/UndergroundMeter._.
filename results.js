// results.js
const params = new URLSearchParams(window.location.search);
const avg = params.get('avg');

document.getElementById('result').textContent = avg;
//  avg
//    ? `Your popularity score is: ${parseFloat(avg).toFixed(2)}%`
//    : "No popularity score available.";
  if(avg)
  {
    const pop = parseFloat(avg).toFixed(2);
    const imageElement = document.getElementById('resultimg');
    if(pop >= 76)
    {
      imageElement.style.opacity = 0;
      setTimeout(() => {
<<<<<<< Updated upstream
        imageElement.src = "pleaser.jpeg";
=======
        imageElement.src = "img/based.jpeg";
>>>>>>> Stashed changes
        imageElement.style.opacity = 1;
      }, 100);
    }
    else if(pop >= 41)
    {
      imageElement.style.opacity = 0;
      setTimeout(() => {
<<<<<<< Updated upstream
        imageElement.src = "almostcool.jpg";
=======
        imageElement.src = "img/pleaser.jpeg";
>>>>>>> Stashed changes
        imageElement.style.opacity = 1;
      }, 100);
    }
    else if(pop >= 0)
    {
      imageElement.style.opacity = 0;
      setTimeout(() => {
        imageElement.src = "img/tappedin.jpeg";
        imageElement.style.opacity = 1;
      }, 100);
    }
    else
    {
      label = "NO SCORE";
    }
    document.getElementById('result').textContent = `Your top 5 artists' popularity score is: ${pop}%`;
    imageElement.style.display = "block";
  }