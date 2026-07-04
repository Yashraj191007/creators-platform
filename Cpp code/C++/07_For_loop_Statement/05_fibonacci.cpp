# include<iostream>
using namespace std;
int main()
{
    int i , n , fibo , a , b ;
    cout<<"\n Enter number: ";
    cin>>n;
    a = 0;
    b = 1;
    cout<< a;
    cout<<"\t"<<b;
    for( i=0 ; i<=n ; i++)
    {
        fibo = a+b;
        cout<<"\t"<<fibo;
        a = b ;
        b = fibo ;
    }
}