/*  2    4    6 
    8    10   12
    14   16   18 
    20   22   24 */  // print this matrix

#include <iostream>
using namespace std;
int main()
{
    int i , r ,c ;
   i = 0;
    for( r=0 ; r<=3 ; r++)
    {
        for( c=0 ;c<=2 ; c++)
        {
            i = i+2;
            cout<<"\t"<<i;
        }
        cout<<"\n";
    }
}
