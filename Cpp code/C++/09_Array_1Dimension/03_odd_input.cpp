# include<iostream>
using namespace std;
int main()
{
    int i , n ;
    int a[100];
    cout<<"\n Enter number of elements:";
    cin>>n;
    cout<<"\n Enter "<<n<<" numbers:";
    for(i=1 ; i<=n ; i++)
    { 
        cin>>a[i];
    }
    cout<<"\n Elements are:";
    
    for(i=1 ; i<=n ; i++)
    {
        if(a[i]%2!=0)
        {
            cout<<"\n"<<a[i];
        }
    }
}