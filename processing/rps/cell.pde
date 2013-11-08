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
  int getCurrentStrategy(){
    return strategy[0];
  }
  
  
  void reset(int[] newStrategy){
    health = 1;
    strategy = newStrategy;
    drawCell();
  }
  
  
/*-----------HELPERS----------*/
  //0=rock, 1=paper, 2=scissor
  int randomStrategy(float[] probability ){
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

  void drawCell(){
    color clr= rockColor;
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


