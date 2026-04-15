/*  * 
    * * 
    * * *
    * * * *
    * * * * *    */   // print this
    
#include <iostream>
using namespace std;
int main()
{
    int r , c ;
    for( r=0 ; r<=4 ; r++)
    {
        for( c=0 ; c<=r ; c++)
        {
            cout<<"\t"<<"*";
        }
        cout<<"\n";
    }
}