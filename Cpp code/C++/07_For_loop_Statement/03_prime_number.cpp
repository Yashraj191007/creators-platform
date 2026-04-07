# include <iostream>
using namespace std;
int main()
{
    int i , n , p ;
    cout<<"\n Enter any Number:";
    cin>>n;
    for( i=2 ; i<=n-1 ; i++ )
    {
        if( n%i == 0)
        {
            p = 0;
            break;
        }
        else
        {
            p = 1 ;
            break;
        }
    }
        if(p == 1 )
        {
            cout<<"\n It is a Prime Number";
        }
        else
        {
            cout<<"\n It is not a Prime Number";
        }

}