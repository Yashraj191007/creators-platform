//  t=top ,  b=bottom , l=left , ri=right  
    //  1 2 3
    //  4 5 6
    //  7 8 9  

#include <iostream>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;

    int a[r][c];

    for(int i=0;i<r;i++)
        for(int j=0;j<c;j++)
            cin >> a[i][j];

    int t=0, b=r-1, l=0, ri=c-1;

    while(t<=b && l<=ri) {   

        for(int i=l;i<=ri;i++){      // move from left to right on top row   
            cout << a[t][i] << " ";
        }            
        t++;
 

        for(int i=t;i<=b;i++){      // move from top to bottom on right column
            cout << a[i][ri] << " ";
        }
        ri--;

        for(int i=ri;i>=l;i--){     // move from right to left on bottom row
            cout << a[b][i] << " ";
        }
        b--;
  

        for(int i=b;i>=t;i--){       // move from bottom to top on left column
            cout << a[i][l] << " ";
        } 
        l++;
    }
}
