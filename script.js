var player1 = 'Player 1',
    player2 = 'Player 2';
var category = 'cat1';
var scores = [0, 0];
var totCat = 10;
var a = 0;
var p1flag = 0,
    p2flag = 0;
var flag_arr = [0, 0];
var currentplayer = 0;
document.getElementById("choose_category").style.display = "none";
document.getElementById("player_score1").style.display = "none";
document.getElementById("player_score2").style.display = "none";

let x = document.getElementById("player_names");
x.addEventListener("click", func_players);


function func_players() {
    player1 = document.getElementById("player1_name").value;
    player2 = document.getElementById("player2_name").value;
    if (player1 === "") {
        alert("Player 1 should enter name");
    } else {
        p1flag = 1;
        console.log(player1);
    }
    if (player2 === "") {
        alert("Player 2 should enter name");
    } else {
        p2flag = 1;
        console.log(player2);
    }
    if (p1flag === 1 && p2flag === 1) {
        document.getElementById("players_first").remove();
        document.getElementById("choose_category").style.display = "block";
        document.getElementById("choose_category").style.textAlign = "center";
        document.getElementById("player_score1").style.display = "none";
        document.getElementById("player_score2").style.display = "none";
    }

}

let catg = document.getElementById("btn-cat");
catg.addEventListener("click", function() {
    a = 1;
    category = document.getElementById("cat2").value;
    document.getElementById("player_cat").innerHTML = category;
    console.log(category);
    game_or_not();
});

function game_or_not() {
    document.getElementById("player_score1").style.display = "block";
    document.getElementById("player_score2").style.display = "block";
    if (a == 1) {
        a = 0;
        game();
    }
}

function players_style() {
    let p1 = document.querySelector(".player1");
    let p2 = document.querySelector(".player2");
    document.querySelector(".player1").style.display = "block";
    document.querySelector(".player2").style.display = "block";
    p1.style.backgroundColor = "grey";
    p2.style.backgroundColor = "grey";
    p1.style.borderRadius = "15%";
    p2.style.borderRadius = "15%";
    p1.style.padding = "20px 50px 0 50px";
    p2.style.padding = "20px 50px 0 50px";
    p1.style.border = "2px solid black";
    p2.style.border = "2px solid black";
}
async function game() {
    players_style();
    if (totCat === 0) {
        alert("No categories left,Game ended!!");
        document.querySelector(".player1").style.display = "none";
        document.querySelector(".player2").style.display = "none";
        document.getElementById("level").style.display = "none";
        document.getElementById("display_turn").remove();
        document.getElementById("answer").innerHTML = "Game Ended!!";
        results_display();
        return;
    }
    y = document.getElementById("cat2").children;
    for (let i = 0; i < totCat; i++) {
        if (y[i].value === category) {
            console.log("category found");
            y[i].remove();
            break;
        }
    }
    totCat -= 1;
    var ele1 = document.getElementById("question1");
    var ele2 = document.getElementById("question2");
    ele1.innerHTML = "";
    ele2.innerHTML = "";
    document.getElementById("choose_category").style.display = "none";
    await play("easy");
}

async function play(difficulty) {
    flag_arr = [0, 0];
    document.getElementById("play1").textContent = player1;
    document.getElementById("play2").textContent = player2;
    var ele1 = document.getElementById("question1");
    var ele2 = document.getElementById("question2");
    try {
        const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulty=${difficulty}&limit=2`);
        const data = await response.json();
        item1 = data[0];
        item2 = data[1];
        var arr1 = [];
        var arr2 = [];
        arr1 = options_shuffle(item1);
        arr2 = options_shuffle(item2);

        console.log("in play");
        document.getElementById("level").innerHTML = `<h4>${difficulty} level</h4>`;
        document.getElementById('level').style.textAlign = "center";

        ele1.innerHTML = `<h4>${item1.question}</h4>`;
        ele2.innerHTML = `<h4>${item2.question}</h4>`;


        options1 = document.getElementById("list1");
        options1.appendChild(options_display(arr1));
        console.log(options1);

        options2 = document.getElementById("list2");
        options2.appendChild(options_display(arr2));

        document.getElementById("quiz1").style.display = "block";
        document.getElementById("quiz2").style.display = "none";

        correct1 = item1.correctAnswer;
        correct2 = item2.correctAnswer;
        console.log(correct1);
        console.log(correct2);
        displayTurn();

        check("list1", correct1, 0, difficulty);

    } catch (error) {
        console.log("Error found" + error);
    }
}

function displayTurn() {
    if (currentplayer === 0) {
        console.log("player 1 turn");
        document.getElementById("display_turn").textContent = `${player1}'s turn`;
    } else {
        console.log("player 2 turn");
        document.getElementById("display_turn").textContent = `${player2}'s turn`;
    }
    document.getElementById("display_turn").style.textAlign = "center";
}


function options_shuffle(item) {
    var arr = [];
    arr = arr.concat(item.incorrectAnswers);
    arr = arr.concat(item.correctAnswer);
    arr.sort(() => Math.random() - 0.5);
    return arr;
}

function options_display(arr) {
    const myDiv = document.createElement("ul");
    for (let i = 0; i < 4; i++) {
        const li = document.createElement("li");
        const node = document.createTextNode(arr[i]);
        li.appendChild(node);
        myDiv.appendChild(li);
    }
    return myDiv;
}


function check(list, ans, player, difficulty) {
    console.log(player, difficulty, "are");
    x = document.getElementById(list);
    ul = x.querySelector("ul");
    items = ul.querySelectorAll("li");
    let flag = 0;
    displayTurn();
    items.forEach(item => {
        item.addEventListener("click", function checkans() {
            if (flag == 0 && currentplayer === player) {
                console.log(item);
                item.style.backgroundColor = "lightgray";
                flag = 1;
                flag_arr[player] = 1;
                evaluate(item, ans, player, difficulty);
                if (currentplayer === 0) {
                    currentplayer = 1;
                    document.getElementById("quiz2").style.display = "block";
                    check("list2", correct2, 1, difficulty);
                } else {
                    currentplayer = 0;
                }
                if (flag_arr[0] === 1 && flag_arr[1] === 1) {
                    next_level_button(difficulty);
                }
            }
        });
    })
}

function next_level_button(difficulty) {
    if (difficulty === "hard") {
        ending_game_or_not();
    } else {
        if (difficulty === "easy") {
            nextDiff = "medium";
        } else if (difficulty === "medium") {
            nextDiff = "hard";
        }
        const nextlevelButton = goTonextLevel(nextDiff);
        nextlevelButton.addEventListener("click", async function() {
            remove_content();
            nextlevelButton.remove();
            await play(nextDiff);
        })
    }
}



function ending_game_or_not() {
    const endbutton = create_end_button();
    endbutton.addEventListener("click", end_game);

    const nextCat = document.createElement("button");
    nextCat.innerHTML = "Choose another Category";
    document.getElementById("btn-next").appendChild(nextCat);
    nextCat.addEventListener("click", async function() {
        document.querySelector(".player1").style.display = "none";
        document.querySelector(".player2").style.display = "none";
        remove_content();
        nextCat.remove();
        document.getElementById("choose_category").style.display = "block";
        document.getElementById("choose_category").style.textAlign = "center";
        endbutton.remove();
        game_or_not();
    })
}

function remove_content() {
    let ele1 = document.getElementById("question1");
    let ele2 = document.getElementById("question2");
    ele1.innerHTML = "";
    ele2.innerHTML = "";
    options1.innerHTML = "";
    options2.innerHTML = "";
}

function goTonextLevel(level) {
    level = level[0].toUpperCase() + level.slice(1);
    const nextlevel = document.createElement("button");
    nextlevel.innerHTML = `Proceed to ${level} Level`;
    document.getElementById("btn-next").appendChild(nextlevel);
    return nextlevel;
}

function create_end_button() {
    const endbutton = document.createElement("button");
    endbutton.innerHTML = "End Game";
    document.getElementById("end_game").appendChild(endbutton);
    return endbutton;
}

function end_game() {
    document.querySelector(".player1").style.display = "none";
    document.querySelector(".player2").style.display = "none";
    document.getElementById("level").style.display = "none";
    alert("Game ended thank you");
    results_display();
    scores = [0, 0];
    document.getElementById("end_game").remove();
    document.getElementById("btn-next").remove();
    document.getElementById("display_turn").remove();
    document.getElementById("answer").innerHTML = "Game Ended!!";
    return;
}

function evaluate(item, correctanswer, player, difficulty) {
    console.log(difficulty);
    const myDiv2 = document.getElementById("answer");
    myDiv2.innerHTML = '';
    const x = document.createElement("h4");
    x.innerText = '';
    if (item.textContent === correctanswer) {
        console.log("correct answer");
        x.innerText = `Correct answer!`;
        if (difficulty === "easy") scores[player] += 10;
        else if (difficulty === "medium") scores[player] += 15;
        else if (difficulty === "hard") scores[player] += 20;
        if (player === 0)
            document.getElementById("p1score").innerHTML = scores[player];
        else if (player === 1)
            document.getElementById("p2score").innerHTML = scores[player];
        console.log(scores, "your score");
    } else {
        x.innerText = `No! the correct answer is ${correctanswer}`;
        console.log("incorrect answer");
    }
    myDiv2.appendChild(x);
}

function results_display() {
    x = document.getElementById("results");
    const myDiv = document.createElement("h3");
    myDiv.style.textAlign = "center";
    if (scores[0] > scores[1]) {
        myDiv.innerHTML = `<h3>${player1} won with score ${scores[0]}`;
    } else if (scores[0] < scores[1]) {
        myDiv.innerHTML = `<h3>${player2} won with score ${scores[1]}`;
        console.log("Player 2 winned");
    } else {
        myDiv.innerHTML = `<h3> ${player1} and ${player2} won with score ${scores[0]}`;
    }
    x.appendChild(myDiv);
    options1 = document.getElementById("list1");
    options1.innerHTML = "";
    options2 = document.getElementById("list2");
    options2.innerHTML = "";
    document.getElementById("question1").innerHTML = "";
    document.getElementById("question2").innerHTML = "";
}