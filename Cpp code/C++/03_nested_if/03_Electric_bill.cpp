# include <iostream>
using namespace std; 
int main()
{
    double unit , bill ;
    cout<<"\n Enter unit:";
    cin>>unit;
    if (unit<=30 && unit>0)
    {
        bill = unit * 0.75;
    }
    else if (unit<=100 && unit>=30)
    {
        bill = unit * 2.5;
    }
    else if (unit<=300 && unit>=100)
    {
        bill = unit * 3.0;
    }
    else if (unit>300)
    {
        bill = unit * 4.6;
    }
    cout<<"\n Total Bill:"<<bill;
    
}