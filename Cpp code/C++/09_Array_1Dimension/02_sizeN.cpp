# include<iostream>
using namespace std;
int main()
{
    int i , n, a[100];
    cout<<"\n Enter number of elements:";
    cin>>n;
    cout<<"\n Enter the value of "<<n<<" elements:";
    for(i=1 ; i<=n ; i++)
    {
        cin>>a[i];
    }
    cout<<"\n Total "<<n<<" elements are:";
   for(i=1 ; i<=n ; i++)
   {
    cout<<"\n"<<a[i];
   }
}