function treatAllData(data) {
	var players = {};
	for (var i = 0; i < data.length; i++) {
		for (var j = 0 ; j < data[i]["games"].length ; j++) {
			for (const[key,value] of Object.entries(data[i]["games"][j])) {
				if (!(key in players)) {
					players[key] = [0];
					for (var k = 0 ; k <= i ; k++) {
						players[key].push(0);
					}
				} else if (players[key].length <= i + 1) {
					players[key].push(players[key][players[key].length-1])
				}
				players[key][i+1] += value;
			}
		}
	}
	return players;
}

function treatAllData(data) {
	var allData = [];
	var players = {};
	var allDates = [new Date(2025,3,20)];
	for (var i = 0; i < data.length; i++) {
		var rawDate = data[i]["date"].split("/");
		allDates.push(new Date(rawDate[2],rawDate[1]-1,rawDate[0]));
		for (var j = 0 ; j < data[i]["games"].length ; j++) {
			for (const[key,value] of Object.entries(data[i]["games"][j])) {
				if (!(key in players)) {
					players[key] = [0];
					for (var k = 0 ; k <= i ; k++) {
						players[key].push(0);
					}
				} else if (players[key].length <= i + 1) {
					players[key].push(players[key][players[key].length-1])
				}
				players[key][i+1] += value;
			}
		}
	}
	for (var i = 0 ; i < allDates.length ; i++) {
		for (var player in players) {
			allData.push({date:allDates[i],player:player,score:players[player][i]});
		}
	}
	return [allData,players];
}



// LDATA
function getDateSpan(data) {
	const todayTMP = new Date();
	const today = new Date(todayTMP.getFullYear(),todayTMP.getMonth(),todayTMP.getDate())
	var res = [];
	for (var i = 0; i < data.length; i++) {
		var rawDate = data[i]["date"].split("/");
		var date = new Date(rawDate[2],rawDate[1]-1,rawDate[0]);
		console.log(date);
		console.log(today);
		const span = new Date(today-date);
		console.log(span);
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
		var score = data[scores][data[scores].length-1];
		min = Math.min(min,score);
		max = Math.max(max,score);
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
	}
]`;















const LDATA = JSON.parse(DATA);
console.log(LDATA);

const res = treatAllData(LDATA);
const allData = res[0];
const players = res[1];
const leaderboard = getLeaderboard(players);
