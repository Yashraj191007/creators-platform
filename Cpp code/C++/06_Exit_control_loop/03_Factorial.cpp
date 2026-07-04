# include <iostream>
using namespace std;
int main()
{
    int i , fact , n ; 
    cout<<"\n Enter Number:";
    cin>>n;
    i = 1; 
    fact = 1;
    while(i<=n)
    {
        fact = fact * i ;
        i = i + 1 ;
    }
    cout<<"\n Factorial of "<<n<<" is "<<fact;
}