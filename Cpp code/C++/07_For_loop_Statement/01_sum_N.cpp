# include <iostream>
using namespace std;
int main()
{
    int n , i , sum ;
    
    cout<<"\n Enter Number: ";
    cin>>n;
    sum = 0;
    for( i = 1 ; i <= n ; i++)
    {
        sum = sum + i ;
    }

    cout<<"\n Sum : "<< sum;

}
