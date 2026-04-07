# include <iostream>
using namespace std;
int main()
{
    int i , f , n ; 
    cout<<"\n Enter Number of Factorial:";
    cin>>n;
    f = 1;
    for( i=1 ; i<=n ; i++)
    {
        f = f * i;
        i = i + 1;
    }
    cout<<"\n Factorial:"<<f;
}