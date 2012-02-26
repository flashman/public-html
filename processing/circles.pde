int dr = 10;
int mx = 690;
int my= 300;
int i = 0;
void setup()
{
  size(mx, my);
  background(250,250,0);
  smooth();
  frameRate( 20 );

}

void draw() 
{
  cc((int) random(0,mx),(int) random(0,my));
  i++;
}

void cc(int x, int y){
  int z = (int) random(2,15);
  while(z>0){
  	stroke(0);
  	fill(255 - 15*z, 50+205*(mouseX/mx), 50+205*(1-mouseY/my));
    ellipse(x, y, dr*z, dr*z);
    z--;
  };
}

void mouseClicked(){
    background(250,250,0);
}