# include <iostream>
using namespace std;
int main()
{
    int i , n , sum;
    cout<<"\n Enter number: ";
    cin>>n;
    i = 2;
    sum = 0;
    while(i<=n)
    {
        sum =  sum+i;
        i = i + 2;
    }
    cout<<"\n Sum :"<< sum;
}