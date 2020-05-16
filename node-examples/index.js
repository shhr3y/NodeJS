var rect = {
     perimeter: (x,y) => (2*(x+y)),
     area: (x,y) => (x*y)
}


function solveRect(l,b){
     console.log("solving for rectangle with l = "+l+" and b = "+b);

     if(l < 1 || b < 1){
          console.log("rectangle dimensions should be greater than zero: l = "+l+" and b = "+b);
     }
     else{
          console.log('The area of the rectangle is :'+rect.area(l,b)+" and perimeter is :"+rect.perimeter(l,b));
     }
}



solveRect(5,6);
solveRect(0,6);
solveRect(6,0);
solveRect(-6,6);



