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
  
  void update( ){
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
  
  void reset(){
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

