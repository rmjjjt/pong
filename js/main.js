const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameTop = 0;
const gameBottom = canvas.height;
const gameLeft = 0;
const gameRight = canvas.width;
const paddleWidth = 18;
const ballWidth = 10;
const maxScore = 10;
const moveIncrement = 2;
const paddleHeight = 40;
const directions = [1, -1];
const paddlePadding = 0;
let playerScore = 0;
let compScore = 0;
let upPressed = false;
let downPressed = false;
let leftPaddleX = gameLeft + paddlePadding;
let leftPaddleY = 10;
let rightPaddleX = gameRight - paddlePadding;
let rightPaddleY = 10;
let rightPaddleDirection = 1;
let ballX = gameLeft + 60;
let ballY = 50;
let ballXDirection = directions[Math.floor(Math.random() * directions.length / 2) * 2];
let ballYDirection = directions[Math.floor(Math.random() * directions.length / 2) * 2];
let scrolling = false;

// TODO: Make ball bounce in different directions depending on where/how it hits the paddle

const keyDownHandler = (e) => {
  if (e.keyCode === 38) {
    upPressed = true;
  } else if (e.keyCode === 40) {
    downPressed = true;
  }
};
const keyUpHandler = (e) => {
  if (e.keyCode === 38) {
    upPressed = false;
  } else if (e.keyCode === 40) {
    downPressed = false;
  }
};
const isBallPastLeftPaddle = (ballX, paddleWidth) => ballX <= paddleWidth;
const isBallPastRightPaddle = (ballX, paddleX, ballWidth) => ballX === gameRight - paddleWidth - ballWidth;
const isBallBelowPaddleTop = (paddleY, ballY, ballWidth) => ballY + ballWidth > paddleY;
const isBallAbovePaddleBottom = (paddleY, ballY, paddleHeight) => ballY <= paddleY + paddleHeight;
const shouldScoreRight = (ballX, ballY, rightPaddleX, rightPaddleY, ballWidth, paddleHeight, direction) => {
  return direction === 1 &&
    ballX >= gameRight &&
    !isBallBelowPaddleTop(rightPaddleY, ballY, ballWidth) &&
    !isBallAbovePaddleBottom(rightPaddleY, ballY, paddleHeight);
};
const shouldBounceRight = (ballX, ballY, rightPaddleX, rightPaddleY, ballWidth, paddleHeight, direction) => {
  return direction === 1 &&
    isBallPastRightPaddle(ballX, rightPaddleX, ballWidth) &&
    isBallBelowPaddleTop(rightPaddleY, ballY, ballWidth) &&
    isBallAbovePaddleBottom(rightPaddleY, ballY, paddleHeight);
};
const shouldScoreLeft = (ballX, ballY, leftPaddleX, leftPaddleY, ballWidth, paddleHeight) => {
  return isBallPastLeftPaddle(ballX, leftPaddleX, ballWidth) &&
    !isBallBelowPaddleTop(leftPaddleY, ballY, ballWidth) &&
    !isBallAbovePaddleBottom(leftPaddleY, ballY, paddleHeight);
};
const shouldBounceLeft = (ballX, ballY, leftPaddleX, leftPaddleY, ballWidth, paddleHeight, direction) => {
  return direction === -1 &&
    isBallPastLeftPaddle(ballX, ballWidth) &&
    isBallBelowPaddleTop(leftPaddleY, ballY, ballWidth) &&
    isBallAbovePaddleBottom(leftPaddleY, ballY, paddleHeight);
};
const shouldBounceTop = (ballY, direction) => direction === -1 && ballY <= gameTop;
const shouldBounceBottom = (ballY, direction) => direction === 1 && ballY + ballWidth >= gameBottom;

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  // document.addEventListener('wheel', function(e) {
  //   scrolling = true;
  //   setInterval(function() {
  //     if (scrolling) {
  //       scrolling = false;
  //       if (e.deltaY < 0) {
  //         console.log('scrolling up');
  //         upPressed = true;
  //         downPressed = false;
  //       } else if (e.deltaY > 0) {
  //         console.log('scrolling down');
  //         downPressed = true;
  //         upPressed = false;
  //       }
  //     }
  //   }, 250);
  // });
  document.getElementById("playerScore").innerHTML = playerScore;
  document.getElementById("compScore").innerHTML = compScore;
  if (playerScore >= maxScore) {
    alert("GAME OVER");
    document.location.reload();
  } else {
    // Draw centre dividing line
    ctx.beginPath();
    ctx.moveTo(gameRight / 2, 0);
    ctx.lineTo(gameRight / 2, gameBottom);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFF';
    ctx.stroke();

    // Draw left paddle
    ctx.beginPath();
    ctx.moveTo(leftPaddleX, leftPaddleY);
    ctx.lineTo(leftPaddleX, leftPaddleY + paddleHeight);
    ctx.lineWidth = paddleWidth;
    ctx.strokeStyle = '#FF69B4';
    ctx.stroke();

    // Draw right paddle
    ctx.beginPath();
    ctx.moveTo(rightPaddleX, rightPaddleY);
    ctx.lineTo(rightPaddleX, rightPaddleY + paddleHeight);
    ctx.lineWidth = paddleWidth;
    ctx.strokeStyle = '#FF69B4';
    ctx.stroke();

    // Draw ball at starting position
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(ballX + ballWidth, ballY);
    ctx.lineWidth = ballWidth;
    ctx.strokeStyle = '#39ff14';
    ctx.stroke();

    // Bouncey / scorey stuff
    if (shouldBounceRight(ballX, ballY, rightPaddleX, rightPaddleY, ballWidth, paddleHeight, ballXDirection)) {
      console.log({ballX})
      ballXDirection = -1;
    }

    if (shouldScoreRight(ballX, ballY, rightPaddleX, rightPaddleY, ballWidth, ballXDirection)) {
      console.log({ballX})
      playerScore++;
      ballX = gameLeft + (Math.floor(Math.random() * 200) + 200);
      ballY = gameTop + (Math.floor(Math.random() * 200) + 200);
      ballXDirection = directions[Math.floor(Math.random() * directions.length)];
      ballYDirection = directions[Math.floor(Math.random() * directions.length)];
    }

    if (shouldScoreLeft(ballX, ballY, leftPaddleX, leftPaddleY, ballWidth)) {
      compScore++;
      ballX = gameLeft + (Math.floor(Math.random() * 200) + 200);
      ballY = gameTop + (Math.floor(Math.random() * 200) + 200);
      ballXDirection = directions[Math.floor(Math.random() * directions.length)];
      ballYDirection = directions[Math.floor(Math.random() * directions.length)];
    }

    if (shouldBounceLeft(ballX, ballY, leftPaddleX, leftPaddleY, ballWidth, paddleHeight, ballXDirection)) {
      ballXDirection *= -1;
    }

    if (shouldBounceTop(ballY, ballYDirection) || shouldBounceBottom(ballY, ballYDirection)) {
      ballYDirection *= -1;
    }

    // Move stuff that needs to move
    ballX += (ballXDirection * moveIncrement);
    ballY += (ballYDirection * moveIncrement);
    rightPaddleY += (moveIncrement * rightPaddleDirection);
    if ((rightPaddleY + paddleHeight >= gameBottom) && rightPaddleDirection === 1) rightPaddleDirection = -1;
    if (rightPaddleY <= gameTop && rightPaddleDirection === -1) rightPaddleDirection = 1;
    if (upPressed && (leftPaddleY) > gameTop) leftPaddleY -= moveIncrement;
    if (downPressed && (leftPaddleY + paddleHeight) < gameBottom) leftPaddleY += moveIncrement;
  }
};

setInterval(draw, 10);

