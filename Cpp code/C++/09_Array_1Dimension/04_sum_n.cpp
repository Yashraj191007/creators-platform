#include<iostream>
using namespace std;
int main()
{
    int a[100];
    int i , n , sum;
    cout<<"\n Enter Number of elements: ";
    cin>>n;
    cout<<"\n Enter the elements:";
    for(i=1 ; i<=n ; i++)
    {
        cin>>a[i];
    }
    cout<<"\n  sum of elements are:";
    sum = 0;
    for(i=1 ; i<=n ; i++)
    {
        sum = sum + a[i];
    }
    cout<<sum;
}