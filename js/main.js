

function setPageElements() {
	setTimeout(() => createSVGTotalPlot(), 1500);
    setTimeout(() => createProfilesDiv(), 2000);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}