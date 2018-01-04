var ai='o', player='x';
var turn=2; var vs='ai';
var p1score=0; var p2score=0;
var board=[['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];

$(document).ready(function(){
  $('.xoro').hide();
  $('.board').hide();
  $('.result').hide();
  $('.scores').hide();
})

$('#one').click(function(){
  $('.mode').hide();
  $('.xoro').fadeIn(2300);
  vs='ai';
  $('#vs').html('Computer ');
});

$('#two').click(function(){
  $('.mode').hide();
  $('.xoro').fadeIn(2300);
  vs='player';
  $('#vs').html('Player 2 ');
});

function moveLeft(board){
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      if (board[i][j]=='_')
        return true;
    }
  }
  return false;
}

function evaluate(b){
  for (var i=0; i<3; i++){
    if (b[i][0]==b[i][1] && b[i][1]==b[i][2]){
      if (b[i][0]==ai)
        return 10;
      else if (b[i][0]==player)
        return -10;
    }
  }
  for (var j=0; j<3; j++){
    if (b[0][j]==b[1][j] && b[1][j]==b[2][j]){
      if (b[0][j]==ai)
        return 10;
      else if (b[0][j]==player)
        return -10;
    }
  }
  if (b[0][0]==b[1][1] && b[1][1]==b[2][2]){
    if (b[0][0]==ai)
      return 10;
    else if (b[0][0]==player)
      return -10;
  }
  if (b[0][2]==b[1][1] && b[1][1]==b[2][0]){
    if (b[1][1]==ai)
      return 10;
    else if (b[1][1]==player)
      return -10;
  }
  return 0;
}

function minimax(board, isMax){
  var score=evaluate(board);
  if (score==10)  return score;
  if (score==-10) return score;
  if (score==0 && moveLeft(board)==false) return 0;
  if (isMax===true){
    var best=-1000;
    for (var i=0; i<3; i++){
      for (var j=0; j<3; j++){
        if (board[i][j]=='_'){
          board[i][j]=ai;
          best=Math.max(best, minimax(board, false));
          board[i][j]='_';
        }
      }
    }
    return best;
  }
  else {
    var best2=1000;
    for (var a=0; a<3; a++){
      for (var b=0; b<3; b++){
        if (board[a][b]=='_'){
          board[a][b]=player;
          best2=Math.min(best2, minimax(board, true));
          board[a][b]='_';
        }
      }
    }
    return best2;
  }
}

function bestMove(board){
  var best=-1000;
  var row=-1; var col=-1;
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      if (board[i][j]=='_'){
        board[i][j]=ai;
        var mov=minimax(board,false);
        board[i][j]='_';
        if (mov>=best){
          best=mov;
          row=i; col=j;
        }
      }
    }
  }
  return [row,col];
}

function updateBoard(b){
  var color='#21618C';
  for (var i=0; i<3; i++){
    if (b[i][0]==b[i][1] && b[i][1]==b[i][2] && b[i][0]!='_'){
      $('#'+i+'0').animate({backgroundColor: color},{duration:200, queue:false});
      $('#'+i+'1').animate({backgroundColor: color},{duration:200, queue:false});
      $('#'+i+'2').animate({backgroundColor: color},{duration:200, queue:false});
      return;
    }
  }
  for (var j=0; j<3; j++){
    if (b[0][j]==b[1][j] && b[1][j]==b[2][j] && b[0][j]!='_'){
      $('#0'+j).animate({backgroundColor: color},{duration:200, queue:false});
      $('#1'+j).animate({backgroundColor: color},{duration:200, queue:false});
      $('#2'+j).animate({backgroundColor: color},{duration:200, queue:false});
      return;
    }
  }
  if (b[0][0]==b[1][1] && b[1][1]==b[2][2] && b[0][0]!='_'){
    $('#00').animate({backgroundColor: color},{duration:200, queue:false});
    $('#11').animate({backgroundColor: color},{duration:200, queue:false});
    $('#22').animate({backgroundColor: color},{duration:200, queue:false});
    return;
  }
  if (b[0][2]==b[1][1] && b[1][1]==b[2][0] && b[1][1]!='_'){
    $('#02').animate({backgroundColor: color},{duration:200, queue:false});
    $('#11').animate({backgroundColor: color},{duration:200, queue:false});
    $('#20').animate({backgroundColor: color},{duration:200, queue:false});
    return;
  }
}

function khelaShesh(){
  updateBoard(board);
  $('.block').css('pointer-events','none');
  var score=evaluate(board);
  if (score==10){
    if (vs=='ai') $('.result').html('You lost!');
    else $('.result').html('Player 2 won!');
    p2score++;
    $('#player2').html(p2score);
  }
  else if (score==-10){
    if (vs=='ai') $('.result').html('You won!');
    else $('.result').html('Player 1 won!');
    p1score++;
    $('#player1').html(p1score);
  }
  else $('.result').html('It\'s a tie!');
  setTimeout(function(){
    $('.board').hide();
    $('.result').fadeIn();
    board=[['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
    $('.block').html('').css('background','transparent');
    setTimeout(function(){
      $('.block').css('pointer-events','auto');
      $('.result').hide();
      $('.board').fadeIn();
      if (vs=='player'){
        if (ai=='x') turn=2;
        else turn=1;
        playerMove();
      }else {
        if (ai=='x')  aiMove();
        else playerMove();
      }
    },1000);
  },1500);
}

function playerMove(){
  var score=evaluate(board);
  if ((score==10 || score==-10) || (score==0 && moveLeft(board)==false)){
    khelaShesh(); return;
  }
  setTimeout(function(){
    $('.turn').show();
    $('.block').css('pointer-events','auto');
    $('.block').click(function(){
      if (vs=='player' && turn==2){
        var idx=$(this).attr('id');
        var row=idx.split('')[0];
        var col=idx.split('')[1];
        if (board[row][col]=='_'){
          $('.block').css('pointer-events','none');
          $(this).append(ai);
          board[row][col]=ai;
          turn=1; playerMove();
        }
      }
      else {
        var idx=$(this).attr('id');
        var row=idx.split('')[0];
        var col=idx.split('')[1];
        if (board[row][col]=='_'){
          $('.block').css('pointer-events','none');
          $(this).append(player);
          board[row][col]=player;
          if (vs=='ai') aiMove();
          else { turn=2; playerMove(); }
        }
      }
    });
  },500);
}

function aiMove(){
  var score=evaluate(board);
  if ((score==10 || score==-10) || (score==0 && moveLeft(board)==false)){
    khelaShesh(); return;
  }
  setTimeout(function(){
    var arr=bestMove(board);
    var row=arr[0], col=arr[1];
    var idx='#'+row+''+col;
    board[row][col]=ai;
    $(idx).append(ai);
    $('.block').css('pointer-events','auto');
    playerMove();
  },500);
}

$('#x').click(function(){
  $('.xoro').hide();
  $('.board').fadeIn(2300);
  $('.scores').fadeIn(2300);
  ai='o'; player='x'; turn=1;
  playerMove();
});

$('#o').click(function(){
  $('.xoro').hide();
  $('.board').fadeIn(2300);
  $('.scores').fadeIn(2300);
  ai='x'; player='o'; turn=2;
  if (vs=='ai') aiMove();
  else playerMove();
});

$('#rst').click(function(){
  $('.xoro').hide();
  $('.board').hide();
  $('.result').hide();
  $('.scores').hide();
  $('.mode').fadeIn();
  ai='o'; player='x'; p1score=0; p2score=0;
  turn=1; vs='ai';
  $('#player1').html(p1score);
  $('#player2').html(p2score);
  board=[['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
  $('.block').html('');
});