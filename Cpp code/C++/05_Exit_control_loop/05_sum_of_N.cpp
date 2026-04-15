# include<iostream>
using namespace std;
int main()
{
    int i , n , sum ; 
    cout<<"\n Enter Number:";
    cin>>n;
    i = 1;
    sum = 0;
    do   
    {
        sum = sum + i;
        i = i +1 ;
    }while (i<=n);
    cout<<"\n Sum of "<<n<<" is: "<<sum;
}