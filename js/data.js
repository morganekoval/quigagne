var colors = ["#E97C1D","#1530BA","#e83f6f","#2274a5","#32936f","#251f47","#BEB2C8","#df2935", "#9000b3", "#9000b3","#F774B1","#00A6FB"];
shuffleArray(colors);
var colorsFor = {};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function attackWon(playerName,scores) {
	const score = scores[playerName];
	if (score <= 0) {
		return false;
	}
	var nbSame = 0;
	for (const[key,value] of Object.entries(scores)) {
		if (key != playerName) {
			if (value > 0) {
				nbSame++;
			}
			if (value >= score) {
				return false;
			}
		}
	}
	if (nbSame >= 2) {
		return false;
	}
	return true;
}

function attackLost(playerName,scores) {
	const score = scores[playerName];
	if (score >= 0) {
		return false;
	}
	var nbSame = 0;
	for (const[key,value] of Object.entries(scores)) {
		if (key != playerName) {
			if (value < 0) {
				nbSame++;
			}
			if (value <= score) {
				return false;
			}
		}
	}
	if (nbSame >= 2) {
		return false;
	}
	return true;
}


function treatAllData(data=LDATA) {
	var allData = [];
	var players = {};
	allStats = {players:{},totalNbGames:0};
	var allDates = [new Date(2025,3,20)];
	for (var i = 0; i < data.length; i++) {
		var rawDate = data[i]["date"].split("/");
		allDates.push(new Date(rawDate[2],rawDate[1]-1,rawDate[0]));
		for (var j = 0 ; j < data[i]["games"].length ; j++) {
			allStats.totalNbGames++;
			for (const[key,value] of Object.entries(data[i]["games"][j])) {
				if (!(key in players)) {
					players[key] = [0];
					allStats.players[key] = {"nbGames":0,"nbAttacks":0,"includingSuccess":0,"includingDefeat":0};
					for (var k = 0 ; k <= i ; k++) {
						players[key].push(0);
					}
				} else if (players[key].length <= i + 1) {
					players[key].push(players[key][players[key].length-1])
				}
				players[key][i+1] += value;
				allStats.players[key].nbGames++;
				if (attackWon(key,data[i]["games"][j])) {
					allStats.players[key].nbAttacks++;
					allStats.players[key].includingSuccess++;
				} else if (attackLost(key,data[i]["games"][j])) {
					allStats.players[key].nbAttacks++;
					allStats.players[key].includingDefeat++;
				}

			}
		}
		for (var player in players) {
			while (players[player].length <= i + 1) {
				players[player].push(players[player][players[player].length-1]);
			}
		}
	}
	for (var i = 0 ; i < allDates.length ; i++) {
		for (var player in players) {
			allData.push({date:allDates[i],player:player,score:players[player][i],round:i});
		}
	}
	var k = 0;
	for (var player in players) {
		colorsFor[player] = colors[k];
		k++;
		allData.push({date:undefined,player:player,score:players[player][allDates.length-1],round:allDates.length});
	}
	console.log(allStats);
	return [allData,players];
}

function treatDataDate(index,data=LDATA,) {
	var allDataRaw = [];
	var playersRaw = {};
	var rawDate = data[index]["date"].split("/");
	;
	// var allDates = [new Date(2025,3,20)];

	for (var j = 0 ; j < data[index]["games"].length ; j++) {
		for (const[key,value] of Object.entries(data[index]["games"][j])) {
			if (!(key in playersRaw)) {
				playersRaw[key] = [0];
			}
		}
	}

	const playersName = Object.keys(playersRaw);

	for (var j = 0 ; j < data[index]["games"].length ; j++) {
		for (var k = 0 ; k < playersName.length ; k++) {
			if (playersName[k] in data[index]["games"][j]) {
				playersRaw[playersName[k]].push(playersRaw[playersName[k]][playersRaw[playersName[k]].length-1]+data[index]["games"][j][playersName[k]]);
			} else {
				playersRaw[playersName[k]].push(playersRaw[playersName[k]][playersRaw[playersName[k]].length-1]);
			}
		}
	}

	// for (var j = 0 ; j < data[index]["games"].length ; j++) {
	// 	console.log(data[index]["games"][j])
	// 	for (const[key,value] of Object.entries(data[index]["games"][j])) {
	// 		if (!(key in playersRaw)) {
	// 			playersRaw[key] = [0];
	// 			for (var k = 0 ; k < j ; k++) {
	// 				playersRaw[key].push(playersRaw[key][playersRaw[key].length-1]);
	// 			}
	// 		} 
	// 		// else if (playersRaw[key].length <= j + 1) {
	// 		// 	playersRaw[key].push(playersRaw[key][playersRaw[key].length-1])
	// 		// }
	// 		playersRaw[key].push(playersRaw[key][playersRaw[key].length-1]+value);
	// 	}
	// }

	for (var i = 0 ; i <= data[index]["games"].length ; i++) {
		for (var player in playersRaw) {
			allDataRaw.push({date:new Date(rawDate[2],rawDate[1]-1,rawDate[0]),player:player,score:playersRaw[player][i],round:i});
		}
	}

	for (var player in playersRaw) {
		allDataRaw.push({date:rawDate,player:player,score:playersRaw[player][playersRaw[player].length-1],round:data[index]["games"].length+1});
	}

	return [allDataRaw,playersRaw];

}



// LDATA
function getDateSpan(data) {
	const todayTMP = new Date();
	const today = new Date(todayTMP.getFullYear(),todayTMP.getMonth(),todayTMP.getDate())
	var res = [];
	for (var i = 0; i < data.length; i++) {
		var rawDate = data[i]["date"].split("/");
		var date = new Date(rawDate[2],rawDate[1]-1,rawDate[0]);
		const span = new Date(today-date);
		res.push(span.getDate()-1);
	}
	res.push(0);
	res.reverse()
	return res;
}

// players
function getMinMaxScores(data) {
	var min = 0;
	var max = 0;
	for (var scores in data) {
		for (var i = 0 ; i < data[scores].length ; i++) {
			var score = data[scores][i];
			min = Math.min(min,score);
			max = Math.max(max,score);
		}
	}
	return [min,max];
}

//players
function getLeaderboard(data) {

	// Create items array
	var items = Object.keys(data).map(function(key) {
	  return [key, data[key][data[key].length-1]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
	  return second[1] - first[1];
	});

	return items;
}

function getRank(leaderboard,player) {
	for (var i = 0 ; i < leaderboard.length ; i++) {
		if (leaderboard[i][0] == player) {
			return i;
		}
	}
	return -1;
}

function filterByPlayer(data,playerName) {
	var res = []
	for (var i = 0 ; i < data.length ; i++) {
		if (data[i].player == playerName) {
			res.push(data[i]);
		}
	}
	return res;
}



const DATA = `[
	{
		"date":"23/04/2025",
		"games": [
			{"Aurélien":204,
			"Mani":-102,
			"Barbara":-102,
			"Moko":102,
			"Alex":-102},
			{"Aurélien":-140,
			"Mani":-70,
			"Barbara":70,
			"Moko":70,
			"Alex":70},
			{"Aurélien":136,
			"Mani":-136,
			"Barbara":272,
			"Moko":-136,
			"Alex":-136},
			{"Aurélien":-80,
			"Mani":-80,
			"Barbara":160,
			"Moko":80,
			"Alex":-80},
			{"Aurélien":54,
			"Mani":-54,
			"Barbara":-54,
			"Moko":108,
			"Alex":-54},
			{"Aurélien":-100,
			"Mani":200,
			"Barbara":-100,
			"Moko":-100,
			"Alex":100}
		]
	},
	{
		"date":"27/04/2025",
		"games": [
			{"Barbara":114,
			"Baptiste":-22,
			"Romane":-72,
			"Erwan":-72,
			"Moko":52},
			{"Barbara":-26,
			"Baptiste":26,
			"Romane":26,
			"Erwan":26,
			"Moko":-52},
			{"Barbara":84,
			"Baptiste":-84,
			"Romane":-84,
			"Erwan":-84,
			"Moko":168},
			{"Barbara":-156,
			"Baptiste":-38,
			"Romane":98,
			"Erwan":48,
			"Moko":48},
			{"Barbara":-232,
			"Baptiste":116,
			"Romane":116,
			"Erwan":-116,
			"Moko":116},
			{"Barbara":-52,
			"Baptiste":-104,
			"Romane":52,
			"Erwan":52,
			"Moko":52},
			{"Barbara":94,
			"Baptiste":-94,
			"Romane":-94,
			"Erwan":-94,
			"Moko":188},
			{"Barbara":120,
			"Baptiste":-120,
			"Romane":-120,
			"Erwan":-120,
			"Moko":240},
			{"Barbara":-218,
			"Baptiste":42,
			"Romane":42,
			"Erwan":42,
			"Moko":92},
			{"Barbara":444,
			"Baptiste":-1776,
			"Romane":444,
			"Erwan":444,
			"Moko":444}
		]
	},
	{
		"date":"18/05/2025",
		"games": [
			{"Louise":-94,
			"Aurélien":188,
			"Alex":-94,
			"Erwan":94,
			"Moko":-94},
			{"Louise":-50,
			"Barbara":100,
			"Alex":-50,
			"Erwan":50,
			"Moko":-50},
			{"Louise":-60,
			"Barbara":60,
			"Aurélien":-60,
			"Erwan":120,
			"Moko":-60},
			{"Alex":39,
			"Barbara":-39,
			"Aurélien":39,
			"Erwan":39,
			"Moko":-78},
			{"Alex":236,
			"Barbara":-236,
			"Aurélien":-236,
			"Erwan":-236,
			"Louise":472},
			{"Alex":74,
			"Barbara":74,
			"Aurélien":-74,
			"Moko":-148,
			"Louise":74},
			{"Alex":140,
			"Erwan":-140,
			"Aurélien":-140,
			"Moko":-140,
			"Louise":280},
			{"Alex":-180,
			"Erwan":180,
			"Barbara":-180,
			"Moko":-180,
			"Louise":360},
			{"Aurélien":-42,
			"Erwan":42,
			"Barbara":42,
			"Moko":-84,
			"Alex":42},
			{"Aurélien":-106,
			"Erwan":106,
			"Barbara":-106,
			"Moko":212,
			"Alex":-106},
			{"Aurélien":-160,
			"Erwan":-80,
			"Barbara":80,
			"Moko":80,
			"Alex":80},
			{"Aurélien":-150,
			"Erwan":150,
			"Barbara":-150,
			"Moko":-150,
			"Alex":300}
		]
	}
]`;















const LDATA = JSON.parse(DATA);
console.log(LDATA);

var allStats = {};
const res = treatAllData(LDATA);
var allData = res[0];
var players = res[1];
const leaderboard = getLeaderboard(players);
console.log(leaderboard);
console.log(allData);

// const res2 = treatDataDate(0);
// console.log(res2[0]);
// console.log(res2[1]);

const ragebait = [`c'est ${leaderboard[0][0]} qui gagne mais tu me fais chier avec ton tout petit écran c'est bon regarde sur ton ordi avec une fenêtre de taille normale c'est quoi ton problème t'as besoin de prouver que t'es un nomade ou quoi t'es littéralement tout ce qui va pas avec notre génération on nous a donné toutes ces technologies pour que tu regardes des vidéos youtube sur ton smartphone à la merde`,
				`bravo ${leaderboard[0][0]} la star par contre mon con tu crois que mon site est optimisé pour un écran de cette taille ? pourquoi tu vis la slow life comme un abruti ?`,
				`c'est bon j'ai même pas envie de te dire qui gagne avec ton écran minuscule mets toi à jour autrement ça me regarde pas`,
				`gros loser : toi`,
				`c'est trop la honte d'essayer d'accéder à cette page avec un écran de cette taille comme si j'avais que ça à foutre de rendre mon site responsive excuse-moi de vivre en fait je pense (c'est ${leaderboard[0][0]} qui gagne)`,
				`tellement dur de rester courtoise quand un plouc veut se niquer les yeux avec une mini fenêtre de merde non je ne peux pas t'afficher les résultats parce que le style de la page va être tout déglingué et ça me fait extrêmement chier de régler ce problème voilà c'est tout mais bravo à ${leaderboard[0][0]}`]


