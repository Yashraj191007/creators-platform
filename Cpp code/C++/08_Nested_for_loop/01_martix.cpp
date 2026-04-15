//  00  01  02 
//  10  11  12
//  20  21  22
 
# include<iostream>
using namespace std;
int main()
{
    int r , c ;
    for ( r=0 ; r<=2 ; r++)
    {
        for(c=0 ; c<=2 ; c++)
        {
            cout<<"\t"<<r<<c;
        }
        cout<<"\n";
    }
}
