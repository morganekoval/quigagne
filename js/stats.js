const scrollMaxValue = () => {
  const body = document.body;
  const html = document.documentElement;

  const documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  const windowHeight = window.innerHeight;

  return documentHeight - windowHeight;
};

function createProfilesDiv() {
	// console.log("truc");
	// const contentHolder = document.getElementById("content-holder");
	// contentHolder.innerHTML += `<div id="profiles"></div>`;
	for (var i = 0 ; i < leaderboard.length ; i++) {
		addProfile(i);
	}
	const aProfile = document.getElementById(`profile-${leaderboard[0][0]}`);
	var style = aProfile.currentStyle || window.getComputedStyle(aProfile);
	for (var i = 0 ; i < leaderboard.length ; i++) {
		document.getElementById(`profile-${leaderboard[i][0]}`).style.marginBottom = style.marginRight;
	}
}

function addProfile(index) {
	const profiles = document.getElementById("profiles");

	// TO BE CHANGED
	const playerName = leaderboard[index][0];
	profiles.innerHTML += `<div id="profile-${playerName}" class="profile">
							<h1>${playerName}</h1>
							<div class="stats">
								<div class="statName">SCORE</div>
								<div class="statValue">${leaderboard[index][1]}</div>
							</div>
						</div>`;
	const headerName = document.querySelector(`#n${index+1} div.player`);
	console.log(index+1);
	console.log(playerName);
	console.log(headerName);
	headerName.innerHTML = `<a id="link-to-${playerName}" href="#profile-${playerName}">${playerName}</a>`;

	document.getElementById(`link-to-${playerName}`).addEventListener("click", function(event) {
		setTimeout(function() {
			var scrollPosition = (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
    		if (scrollPosition < scrollMaxValue()) {
				window.scrollBy(0,-document.getElementById("falseheader").getBoundingClientRect().height-5);
			}
		},50);
		
	    

	});
}