# include<iostream>
using namespace std;
int main()
{
    int a,b,c;
    cout<<"Enter 1st Number:";
    cin>>a;
    cout<<"\n Enter 2nd Number:";
    cin>>b;
    cout<<"\n Enter 3rd Number:";
    cin>>c;

    if(a>b)
    {
        if(a>c)
        {
            cout<<"\n Greatest Number is:"<<a;
        }
        else
        {
            cout<<"\n Greatest Number is:"<<b;
        }
    }
    else
    {
        if(b>c)
        {
            cout<<"\n Greatest Number is:"<<b;
        }
        else
        {
            cout<<"\n Greatest Number is:"<<c;
        }
    }
}