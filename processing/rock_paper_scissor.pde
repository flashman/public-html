/*******************
 * Rock Paper Scisors 
 * by Michael Flashman, mtf53@cornell.edu
 *
 * 
 * Rock paper scissors game with asyncronous update and eventualy evolving stratigies
 *********************/

/* environment variables */
int sx =  200;
int sy = 300; 
int sampleSize = sx*sy;
int state = 1;
color rockColor = color(232,21,99);
color paperColor = color(137,0,224);
color scissorColor = color(0,240,105);
PFont arial;

//globals
Cell[][] world;
int[] counts = {0, 0, 0};
TernaryPlot tPlot;

/* model parameters */
int[][] payoff = { { 0,-1,1  }, { 1,0,-1  }, { -1,1,0  } };
float[] prob =  { 0.7,0.2, 0.1};
float mutationRate = 0.0001;
float[] mutationProbaility = {0.33,0.33,0.33};

/* setup */
void setup() { 
  size(max(sx+300,500), max(sy,300));
  background(0);
  arial = createFont("arial", 12);
  textFont(arial);
  
  /*setup world*/
  world = new Cell[sx][sy];
  for (int x = 0; x < sx; x=x+1) { 
    for (int y = 0; y < sy; y=y+1) { 
      world[x][y] = new Cell(x,y, prob);
      int strat = world[x][y].getCurrentStrategy();
      counts[strat] ++;
    }   
  }
  
  /* generate plots */
  text("ROCK PAPER SCISSORS:", sx+20, 14);
  text("(RED) (PURPLE) (GREEN)", sx+20, 28);
  text("" + prob[0], sx+25, 42);
  text("" +  prob[1], sx+65, 42);
  text("" +  prob[2], sx+125, 42);
  
  barPlot();
  float[] tPlotCenter = {width-150, height - 100};
  tPlot = new TernaryPlot(250, tPlotCenter);
}

/* update world */ 
void draw(){
  for(int i=0;i<sampleSize;i++){
    Cell c1 = world[(int)random(sx)][(int)random(sy)];
    Cell c2 = getNeighbor(c1);
    playRPS(c1,c2);
  }
  
  /*update info plots*/
  barPlot();
  tPlot.update();
}

void mousePressed(){
 if(state == 1){
   state = 0; 
   noLoop();
 }
 else{
   state=1;
   loop();
 }
}

/*--------HELPER METHODS---------*/

//PLAY ROCK PAPER SCISSORS OR RANDOMELY MUTATE
void playRPS( Cell c1, Cell c2){
  if(random(1)<mutationRate){
    counts[c1.getCurrentStrategy()] --;
    int[] ns = new int[1];
    ns[0] = c1.randomStrategy(mutationProbaility);
    c1.reset(ns);
    counts[ns[0]] ++;
  }
  else{
    int p = payoff[c1.getCurrentStrategy()][c2.getCurrentStrategy()];
    
    c1.health += p;
  
    if(c1.health <= 0){
      counts[c1.getCurrentStrategy()] --;
      c1.reset(c2.strategy);
      counts[c1.getCurrentStrategy()] ++;
    }
  } 
}

Cell getNeighbor(Cell c1){
  int x = c1.x;
  int y = c1.y;
  int nx, ny;
  switch((int)random(0,8)){
  case 0:
    nx = (x + 1) % sx;
    ny = y;
    break;
  case 1:
    nx = x; 
    ny = (y + 1) % sy;
    break;      
  case 2:
    nx = (x + sx - 1) % sx;
    ny = y;
    break;
  case 3:
    nx = x;
    ny = (y + sy - 1) % sy;
    break;
  case 4:
    nx = (x + 1) % sx;
    ny = (y + 1) % sy;
    break;
  case 5:
    nx = (x + sx - 1) % sx; 
    ny = (y + 1) % sy;
    break;      
  case 6:
    nx = (x + sx - 1) % sx;
    ny = (y + sy - 1) % sy;
    break;
  case 7:
    nx = (x + 1) % sx;
    ny = (y + sy - 1) % sy;
    break;
  default:
    nx = (x + 1) % sx;
    ny = y;
    break;  
  }
  return world[nx][ny];  
}  

void barPlot(){
  /* plot percentage of each color as bars */
  int barHeight = 100;
  int barWidth = 20;
  int barSpace = 10;
  int redHeight = (int) barHeight*counts[0]/(sx*sy);
  int greenHeight = (int) barHeight*counts[1]/(sx*sy);
  int blueHeight = (int) barHeight*counts[2]/(sx*sy);
  noStroke();
  fill(0);
  rect(width-3*barWidth-4*barSpace,0,width-3*barWidth-2*barSpace,barHeight);
  fill(rockColor);
  rect(width-3*barWidth-3*barSpace,0,barWidth,redHeight);
  fill(paperColor);
  rect(width-2*barWidth-2*barSpace,0,barWidth,greenHeight);
  fill(scissorColor);
  rect(width-barWidth-barSpace,0,barWidth,blueHeight);
}
