# include<iostream>
using namespace std;
int main()
{
    double p , c , m , e , cs1 , cs2 ,tm , tp ;
    cout <<"\n Enter your Physics marks:";
    cin>>p;
    cout <<"\n Enter your Chemistry marks:";
    cin>>c;
    cout <<"\n Enter your Maths marks:";
    cin>>m;
    cout <<"\n Enter your English marks:";
    cin>>e;
    cout <<"\n Enter your CS1 marks:";
    cin>>cs1;
    cout <<"\n Enter your CS2 marks:";
    cin>>cs2;
 tm = (p + c + m + e + cs1 + cs2);
 cout<<"\n Total Marks:"<<tm;
 tp = (tm/6) ; 
 cout<<"\n Total Percentage:"<<tp;
  
 if(tp>=90 && tp<100)
    {
        cout<<"\n You PASS with grade A+";
    }
    else if (tp>=75 && tp<90)
    {
        cout<<"\n You PASS with grade A";
    }
    else if (tp>=50 && tp<75)
    {
        cout<<"\n You PASS with grade B";
    }
    else if (tp>=35 && tp<50)
    {
        cout<<"\n You PASS with grade C";
    }
    else if(tp>=0 && tp<35)
    {
        cout<<"\n You FAIL please don't Give up";
    }
    else if (tp>100 | tm>600)
    {
        cout<<"\n Marks tho accha sa daal gudha ";
    }
}