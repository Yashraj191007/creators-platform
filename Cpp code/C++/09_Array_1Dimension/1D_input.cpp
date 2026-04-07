# include <iostream>
using namespace std;
int main()
{
    int i , n[5];
    cout<<"\n Enter any five numbers:";
    for(i=0 ; i<5 ; i++)
    {
        cin>>n[i];
    }
    cout<<"\n Total elements:";
    for( i=0 ; i<5 ; i++)
    {
        cout<<"\t"<<n[i];
    }
}