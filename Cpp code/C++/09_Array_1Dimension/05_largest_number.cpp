# include<iostream>
using namespace std;
int main()
{
    int n , i , l , a[100];
    cout<<"\n Enter number of elements:";
    cin>>n;
    cout<<"\n Enter the elements:";
    for(i=1 ; i<=n ; i++)
    {
        cin>>a[i];
    }
    cout<<"The largest element is:";
    l = a[1];
    for(i=1 ; i<=n ; i++)
    {
        if(a[i]>l)
        {
            l = a[i];
        }
    }
    cout<<l;
}