const timerText = document.querySelector("p.timer");
let active = 0;
const time = 1000;
const timer = () => {
  active++;
  timerText.textContent = `Grasz już ${active} sekund!`;
};
setInterval(timer, time);

class Wallet {
  constructor(money) {
    let _money = money;
    this.getMoneyValue = () => _money;
    this.changeWallet = (bid, type = "+") => {
      if (type === "+") {
        return (_money += bid);
      } else if (type === "-") {
        return (_money -= bid);
      }
    };
  }
}

class Draw {
  constructor() {
    this.options = ["red", "green", "blue", "lawngreen"];
    let _result = this.drawResult();
    this.getDrawResult = () => _result;
  }
  drawResult() {
    let colors = [];
    for (let i = 0; i < this.options.length; i++) {
      const index = Math.floor(Math.random() * this.options.length);
      const color = this.options[index];
      colors.push(color);
    }
    return colors;
  }
}

class Statistics {
  constructor() {
    let _totalGames = 0;
    let _wins = 0;
    let _losses = 0;

    this.getTotalGames = () => _totalGames;
    this.getWins = () => _wins;
    this.getLosses = () => _losses;

    this.addTotalGames = () => {
      return ++_totalGames;
    };

    this.addWin = (result) => {
      if (result === "win") {
        return ++_wins;
      }
    };
    this.addLoss = (result) => {
      if (result === "loss") {
        return ++_losses;
      }
    };
  }
}

class Result {
  static whoWin = (draw) => {
    if (
      (draw[0] === draw[1] && draw[1] === draw[2] && draw[2] === draw[3]) ||
      (draw[0] !== draw[1] &&
        draw[1] !== draw[2] &&
        draw[2] !== draw[3] &&
        draw[0] !== draw[2] &&
        draw[0] !== draw[3] &&
        draw[1] !== draw[3])
    ) {
      return "win";
    } else return "loss";
  };
  static howMuchWin = (result, bid) => {
    if (result === "win") {
      return bid * Math.floor(Math.random() * (10 - 7) + 7);
    } else {
      return 0;
    }
  };
}

class Game {
  constructor() {
    this.wallet = new Wallet(200);
    this.draw = new Draw();
    this.stats = new Statistics();

    document
      .querySelector(".playGame")
      .addEventListener("click", this.startGame.bind(this));
    this.spanWallet = document.querySelector(".wallet");
    this.boards = [...document.querySelectorAll("div.color")];
    this.inputBid = document.querySelector(".bid");
    this.spanGames = document.querySelector(".games");
    this.spanWins = document.querySelector(".wins");
    this.spanLosses = document.querySelector(".loss");
    this.spanResult = document.querySelector(".yourscore");
    this.inputMoney = document.querySelector(".money");
    this.render();
  }
  render(
    colors = ["#2ee", "#2ee", "#2ee", "#2ee"],
    money = this.wallet.getMoneyValue(),
    totalGames = this.stats.getTotalGames(),
    wins = this.stats.getWins(),
    losses = this.stats.getLosses()
  ) {
    this.boards.forEach((board, i) => {
      board.style.backgroundColor = colors[i];
    });

    this.spanWallet.textContent = money + "$";
    this.spanGames.textContent = totalGames;
    this.spanWins.textContent = wins;
    this.spanLosses.textContent = losses;
  }

  startGame() {
    event.preventDefault();
    if (this.inputBid.value > this.wallet.getMoneyValue()) {
      this.inputBid.value = "";
      return alert("Nie masz tylu pieniędzy");
    } else if (this.inputBid.value <= 1.99) {
      this.inputBid.value = "";
      return alert("Możesz obstawiać tylko powyżej 1.99");
    }
    // event.preventDefault();
    const bid = this.inputBid.value;
    this.wallet.changeWallet(bid, "-");
    const colors = this.draw.drawResult();
    const result = Result.whoWin(colors);
    const wonMoney = Result.howMuchWin(result, bid);
    if (result === "win") {
      this.stats.addWin(result);
      this.wallet.changeWallet(wonMoney, "+");
      this.spanResult.textContent = `Wygrałeś ${wonMoney}$`;
    } else if (result === "loss") {
      this.stats.addLoss(result);
      this.spanResult.textContent = `Przegrałeś ${bid}$`;
    }

    this.render(
      colors,
      this.wallet.getMoneyValue(),
      this.stats.addTotalGames()
    );

    this.inputBid.value = "";
  }
}

const game = new Game();
