// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el
    // this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.chars = 'qwertyuiopasdfghjklzxcvbnm!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    try {
      const length = Math.max(oldText.length, newText.length)
      const promise = new Promise((resolve) => this.resolve = resolve)
      this.queue = []
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''
        const to = newText[i] || ''
        const start = Math.floor(Math.random() * 15)
        const end = start + Math.floor(Math.random() * 15)
        this.queue.push({ from, to, start, end })
      }
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
      return promise
    }
    catch (error) {
      console.log("done");
    }
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud"> ${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

var phrases = [];
for (var i = leaderboard.length-1 ; i >= 0 ; i--) {
  phrases.push(`${leaderboard[i][0]}`);
}

const el = document.querySelector('#winner');
const fx = new TextScramble(el);

async function addPlayer(i) {
  const tmp = `<div id="n${i+1}" class="ldb notwinner">
                        <div class="title invisible">
                          QUI GAGNE ? </div>
                        <div class="player">${leaderboard[i][0]}</div>
                        <div class="score">${leaderboard[i][1]}</div>
                      </div>`;
  setTimeout(() => document.getElementById("title-holder").innerHTML+=tmp, 150*i);
  setTimeout(() => document.getElementById(`n${i}`).classList.remove("notwinner"), 150*i);

}

let counter = 0
  const next = () => {
    try {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 50)
    })
  } catch (error) {

    document.getElementById("n1").innerHTML += `<div class="score">${leaderboard[0][1]}</div>`;
    const scorewinner = document.querySelector(`#n1 div.score`);
    // const scorepos = document.querySelector(`#n1 div.score`).getBoundingClientRect();
    document.getElementById("n1").classList.add("header");
    // scorewinner.style.position = `fixed`;
    // scorewinner.style.width = "100%";
    // scorewinner.style.objectPosition = `left ${scorepos.x}px top ${scorepos.y}px`;
    // const th = document.getElementById("title-holder");
    for (var i = 1 ; i < leaderboard.length ; i++) {
      addPlayer(i);
    }

    console.log(scorepos);
  }
    counter = (counter + 1);
  }


next()