# include<iostream>
using namespace std;
int main()
{
    double a , b ;
    cout<<"Enter a 1st number:";
    cin>>a;
    cout<<"Enter a 2nd number:";
    cin>>b;
    if(a>b)
    {
        cout<<"\n Greatest Number is: "<<a;
    }
    else
    {
        cout<<"\n Greatest Number is:"<<b;
    }
    if(a=b)
    {
        cout<<"\n Both values are equal";
    }
}