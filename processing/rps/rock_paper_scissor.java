import processing.core.*; 
import processing.xml.*; 

import controlP5.*; 

import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class rock_paper_scissor extends PApplet {

/*******************
 * Rock Paper Scisors 
 * by Michael Flashman, mtf53@cornell.edu
 *
 * 
 * Rock paper scissors game with asyncronous update and eventualy evolving stratigies
 *********************/


ControlP5 controlP5;


/* environment variables */
int sx =  300;
int sy = 300; 
int sampleSize = sx*sy;
int state = 1;
int rockColor = color(232,21,99);
int paperColor = color(137,0,224);
int scissorColor = color(0,240,105);
PFont arial;

//globals
Cell[][] world;
int[] counts = {0, 0, 0};
TernaryPlot tPlot;

/* model parameters */
int[][] payoff = { { 0,-1,1  }, { 1,0,-1  }, { -1,1,0  } };
float[] prob =  { 1,0, 0};
float mutationRate = 0.0f;
float[] mutationProbaility = {0.33f,0.33f,0.33f};

/* setup */
public void setup() {
 
  /* setup display environment */
  size(max(sx+300,500), max(sy,300)+20);
  background(0);
  arial = createFont("arial", 12);
  textFont(arial);
  frameRate(30);
  
  /* setup controllers */
  controlP5 = new ControlP5(this);
  controlP5.addButton("RESET",0,0,sy,sx/2,20);
  controlP5.addButton("PAUSE",0,sx/2,sy,sx/2,20);
  controlP5.addSlider("prrock",0,1.0f,prob[0],sx + 20,20,80,10);
  controlP5.addSlider("prpaper",0,1.0f,prob[1],sx + 20,40,80,10);
  controlP5.addSlider("prscissor",0,1.0f,prob[2],sx + 20,60,80,10);
  controlP5.addSlider("logmutation",-20,0,log(mutationRate)/log(10),sx + 20,80,50,10);

  /* setup data displays */
  fill(rockColor);
  text("ROCK", sx+20, 14);
  fill(paperColor);
  text("PAPER", sx+68, 14);
  fill(scissorColor);
  text("SCISSOR", sx+120, 14);
  
  barPlot();
  float[] tPlotCenter = {width-150, height - 90};
  tPlot = new TernaryPlot(250, tPlotCenter);
  
 /*setup simulation environment*/
  world = new Cell[sx][sy];
  resetWorld();
}

/* update world */ 
public void draw(){
  for(int i=0;i<sampleSize;i++){
    Cell c1 = world[(int)random(sx)][(int)random(sy)];
    Cell c2 = getNeighbor(c1);
    playRPS(c1,c2);
  }
  
  /*update info plots*/
  barPlot();
  tPlot.update();
}

/*-------CONTROLLER-------*/

public void RESET(int val) {
  state=1;
  resetWorld();
  tPlot.reset();
  loop();

}

public void PAUSE(int val){
   if(state == 1){
     state = 0; 
     noLoop();
   }
   else{
     state=1;
     loop();
   }
}

public void prrock(float rp){
  prob[0] = rp;
  float rem = 1 - prob[0];
  prob[1] = rem/2;
  prob[2] = rem/2;
  controlP5.controller("prpaper").setValue(prob[1]);
  controlP5.controller("prscissor").setValue(prob[2]);
}

public void prpaper(float rp){
  if(rp + prob[0] <= 1 ){
    prob[1] = rp;
    prob[2] = 1 - prob[0] - prob[1];
    controlP5.controller("prscissor").setValue(prob[2]);
  }
  else{
    controlP5.controller("prpaper").setValue(prob[1]);
    controlP5.controller("prscissor").setValue(prob[2]);

  }
}

public void logmutation(float lm){
   mutationRate = pow(10,lm);
}

/*--------HELPER METHODS---------*/

public void resetWorld(){
  for(int i = 0; i<counts.length; i++){
   counts[i]=0; 
  }
  
  for (int x = 0; x < sx; x=x+1) { 
    for (int y = 0; y < sy; y=y+1) { 
      world[x][y] = new Cell(x,y, prob);
      int strat = world[x][y].getCurrentStrategy();
      counts[strat] ++;
      
    }   
  }
  
  int[] rs = {0};
  int[] rp = {1};
  setStrategy(0,sx,0,sy/2,rs);
  setStrategy(0,sx,sy/2,sy-1,rp);
}

public void setStrategy(int x1, int x2, int y1, int y2, int[] strat){
  for(int i=x1; i<x2; i++){
    for(int j=y1; j<y2; j++){
      Cell c = world[i][j];
      counts[c.getCurrentStrategy()] --;
      c.reset(strat);
      counts[strat[0]] ++;
    }
  }  
}

//PLAY ROCK PAPER SCISSORS OR RANDOMELY MUTATE
public void playRPS( Cell c1, Cell c2){
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

public Cell getNeighbor(Cell c1){
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

public void barPlot(){
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
class Cell
{
  int x,y;
  int[] strategy = new int[1];
  float health = 1;
  
  Cell(int xi, int yi, float[] prob)
  {
    health = 1;
    x = xi;
    y = yi;

    strategy[0] = randomStrategy(prob);
    drawCell();
  }

/*-------------METHODS------------*/
  public int getCurrentStrategy(){
    return strategy[0];
  }
  
  
  public void reset(int[] newStrategy){
    health = 1;
    strategy = newStrategy;
    drawCell();
  }
  
  
/*-----------HELPERS----------*/
  //0=rock, 1=paper, 2=scissor
  public int randomStrategy(float[] probability ){
    float rand = random(1);
    int newStrat;
    if(rand < probability[0]){
      newStrat = 0;
    }
    else if( rand <probability[0]+probability[1] ){
      newStrat = 1;
    }
    else{
      newStrat = 2; 
    }
    return newStrat;
  }

  public void drawCell(){
    int clr= rockColor;
    if(strategy[0] == 0){
      clr = rockColor;
    }
    else if(strategy[0] == 1){
      clr = paperColor;
    }
    else if(strategy[0] == 2){
      clr = scissorColor;
    }
    set(x,y,clr);  
  }
}


class TernaryPlot
{
  int l; /*length scale */
  float[] c = new float[2]; /* center */
  float[] r = new float[2];
  float[] p = new float[2] ;
  float[] s = new float[2];

  TernaryPlot( int newL, float[] newc){
    // setup coordinate system
    l = newL; 
    c = newc;
    r[0] = c[0]; r[1]= c[1]- l/(2*cos(PI/6));
    p[0] = c[0] + l/2; p[1] = c[1]+ l*tan(PI/6)/2;
    s[0] = c[0] -l/2; s[1] = c[1]+l*tan(PI/6)/2  ;
    
    //draw background
    reset();
  
    //draw starting point
    update();  
  }
  
  public void update( ){
    //calculate contributaion by each strategy
    float rr = (float)counts[0]/(sx*sy);
    float pp = (float)counts[1]/(sx*sy);
    float ss = (float)counts[2]/(sx*sy);
      
    //update current position in ternary space
    float nx = rr*(r[0]-c[0]) + pp*(p[0]-c[0]) + ss*(s[0]-c[0]) + c[0]; 
    float ny = rr*(r[1]-c[1]) + pp*(p[1]-c[1]) + ss*(s[1]-c[1]) + c[1];
    strokeWeight(1);
    stroke(255);
    point(nx,ny);
  }
  
  public void reset(){
//draw triangle
    stroke(255);
    strokeWeight(1);
    fill(0);
    beginShape();
    vertex(r[0],r[1]);
    vertex(p[0],p[1]);
    vertex(s[0],s[1]);
    endShape(CLOSE);    

    // draw points 
    strokeWeight(10);
    stroke(rockColor);
    point(r[0],r[1]);
    stroke(paperColor);
    point(p[0],p[1]);
    stroke(scissorColor);
    point(s[0],s[1]);
    strokeWeight(2);
    stroke(255);
    point(c[0],c[1]);  
  }
}

  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#FFFFFF", "rock_paper_scissor" });
  }
}
