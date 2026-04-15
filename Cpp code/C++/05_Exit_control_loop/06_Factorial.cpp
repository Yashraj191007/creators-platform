# include<iostream>
using namespace std;
int main()
{
    int fact , i , n;
    cout<<"\n Enter Factorial Number: ";
    cin>>n;
    i = 1; 
    fact = 1 ;
    do  
    { 
        fact = fact*i;
        i = i+1;
    }while(i<=n);
    cout<<"\n Factorial of "<< n <<" is: "<<fact;
}