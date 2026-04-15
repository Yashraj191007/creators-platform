# include <iostream>
using namespace std;
int main()
{
    int i , n , x , a ;
    cout<<"\n Enter value of x:";
    cin >>x;
    cout<<"\n Enter value of n:";
    cin >>n;
    a = 1;
    for(i=1 ; i<=n ; i++)
    {
        a = a*x;
    }
    cout<<"\n"<<x<<" to the power "<<n<<" is: "<<a;
}