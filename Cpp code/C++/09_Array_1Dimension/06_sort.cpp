# include<iostream>
# include<algorithm>
using namespace std;
int main()
{
    int n , i , a[100];
    cout<<"\n Enter number of elements:";
    cin>>n;
    cout<<"\n Enter elements:";
    for(i=1 ; i<=n ; i++)
    {
        cin>>a[i];
    }
    sort(a+1, a+n+1);
    cout<<"\n Sorted elements:";
    for(i=1 ; i<=n ; i++)
    {
        cout<<"\n"<<a[i];
    }
}