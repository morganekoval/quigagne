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

function newColorFor(playerName) {
	const newColor = getRandomColor();
	document.getElementById(`circle-${playerName}`).style.backgroundColor = newColor;
	colorsFor[playerName] = newColor;
	document.getElementById(`line-${playerName}`).style.stroke = newColor;
	document.getElementById(`line-text-${playerName}`).style.fill = newColor;
}

function isToggled(playerName) {
	try {
		if (document.getElementById(`display${playerName}`).checked) {
			return "";
		}
		return "invisible";
	} catch(e) {
		return "";
	}
}

// function cursorPointer(change) {
// 	// console.log(change);
// 	// if (change) {
// 	// 	document.getElementsByTagName("body")[0].style.cursor = "pointer";
// 	// } else {
// 	// 	document.getElementsByTagName("body")[0].style.cursor = "default";
// 	// }
// }

function findPositionInLDBPlayer(playerName) {
	for(var i = 0 ; i < leaderboard.length ; i++) {
		if (leaderboard[i][0] == playerName) {
			return i+1;
		}
	}
	return -1;
}


function togglePlayer(playerName) {
	// console.log(leaderboard);
	console.log(playerName);
	const toggle = document.getElementById(`display${playerName}`).checked;
	const line = document.getElementById(`line-${playerName}`);
	const linetext = document.getElementById(`line-text-${playerName}`);
	const playerLDB = document.getElementById(`n${findPositionInLDBPlayer(playerName)}`);
	try {
		if (toggle) {
			line.classList.remove("invisible");
			linetext.classList.remove("invisible");
			playerLDB.style.visibility = "visible";
			playerLDB.style.display = "inline-flex";
		} else {
			line.classList.add("invisible");
			linetext.classList.add("invisible");
			playerLDB.style.visibility = "hidden";
			playerLDB.style.display = "none";
		}
	} catch(e) {
		console.log('player not displayed');
	}
}

function hoverOnName(i) {
  document.getElementById(`n${i+1}`).addEventListener("mouseenter",() => {
    const playerDiv = document.querySelector(`#n${i+1} div.player`);
    playerDiv.innerHTML = i+1;
    playerDiv.style.color = colorsFor[leaderboard[i][0]];
  });
  document.getElementById(`n${i+1}`).addEventListener("mouseleave",() => {
    const playerDiv = document.querySelector(`#n${i+1} div.player`);
    playerDiv.innerHTML = leaderboard[i][0];
    playerDiv.style.color = "black";
  });
}

function createProfilesDiv() {
	// console.log("truc");
	// const contentHolder = document.getElementById("content-holder");
	// contentHolder.innerHTML += `<div id="profiles"></div>`;
	for (var i = 0 ; i < leaderboard.length ; i++) {
		addProfile(i);
		hoverOnName(i);
	}

	if (leaderboard.length%2 != 0) {
		document.getElementById("profiles").innerHTML += `<div id="profile-null" class="profile bordered invisible"></div>`;
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
	// profiles.innerHTML += `<div id="profile-${playerName}" class="profile bordered">
	// 						<h1>${playerName} <span class="circleplayer" id="circle-${playerName}" style="background-color:${colorsFor[playerName]};"></span></h1>
	// 						<div class="stats">
	// 							<div class="statName">SCORE</div>
	// 							<div class="statValue">${leaderboard[index][1]}</div>
	// 						</div>
	// 						<div class="stats">
	// 							<div class="statName">NOMBRE DE PARTIES</div>
	// 							<div class="statValue"><span>${allStats.players[playerName].nbGames}</span> <span class="substat">(${Math.round(allStats.players[playerName].nbGames/allStats.totalNbGames*100)}%)</span></div>
	// 						</div>
	// 						<div class="stats">
	// 							<div class="statName">NOMBRE DE PRISES</div>
	// 							<div class="statValue"><span>${allStats.players[playerName].nbAttacks}</span> <span class="substat">(${Math.round(allStats.players[playerName].nbAttacks/allStats.totalNbGames*100)}%)</span> dont <span class="greenstat">${allStats.players[playerName].includingSuccess}</span> <span class="substat">(${Math.round(allStats.players[playerName].includingSuccess/allStats.players[playerName].nbAttacks*100) || 0}%)</span> / <span class="redstat">${allStats.players[playerName].includingDefeat}</span> <span class="substat">(${Math.round(allStats.players[playerName].includingDefeat/allStats.players[playerName].nbAttacks*100) || 0}%)</span></div>
	// 						</div>
	// 					</div>`;
	profiles.innerHTML += `<div id="profile-${playerName}" class="profile bordered">
							<h1><span class="playernameh1" onclick="newColorFor('${playerName}')"><span>${playerName}</span> <span class="circleplayer" id="circle-${playerName}" style="background-color:${colorsFor[playerName]};"></span></span><span class="checkdisplay"><input type="checkbox" id="display${playerName}" onclick="togglePlayer('${playerName}')" checked/></span></h1>
							<div class="stats">
								<div class="statName">SCORE</div>
								<div class="statValue">${leaderboard[index][1]}</div>
							</div>
							<div class="stats">
								<div class="statName">NOMBRE DE PARTIES</div>
								<div class="statValue"><span>${allStats.players[playerName].nbGames}</span> <span class="substat">(${Math.round(allStats.players[playerName].nbGames/allStats.totalNbGames*100)}%)</span></div>
							</div>
							<div class="stats">
								<div class="statName">NOMBRE DE PRISES</div>
								<div class="statValue"><span>${allStats.players[playerName].nbAttacks}</span> <span class="substat">(${Math.round(allStats.players[playerName].nbAttacks/allStats.players[playerName].nbGames*100)}%)</span> / <span class="greenstat">${allStats.players[playerName].includingSuccess}</span>:<span class="redstat">${allStats.players[playerName].includingDefeat}</span></div>
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
				window.scrollBy(0,-document.getElementById("falseheader").getBoundingClientRect().height-15);
			}
		},50);    

	});

	
	// console.log(document.getElementById(`display${playerName}`));
	// document.getElementById(`display${playerName}`).addEventListener("change", function(event) {
	// 	console.log(this.checked);
	// 	console.log('wsh');
	// });
}








