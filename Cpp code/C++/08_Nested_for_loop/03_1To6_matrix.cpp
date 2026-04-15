/*  1  2  3 
    4  5  6 */

# include <iostream>
using namespace std;
int main()
{
    int i , r , c ;
    i = 0 ;
    for(r=0 ; r<=1 ; r++)
    {
        for( c=0 ; c<=2 ; c++)
        {
            i = i+1;
            cout<<"\t"<<i;
        }
        cout<<"\n";
    }

}