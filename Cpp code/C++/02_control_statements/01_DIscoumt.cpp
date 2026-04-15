# include<iostream>
using namespace std;
int main() {
    double amount, dis, total;
    cout<<"\n Enter Purchase amount:";
    cin>>amount;
    dis=0;
    if(amount>= 10000)
    {
        dis = (amount*10)/100;
        }
    total = amount - dis;
    cout<<"\n Your total amount ="<<total;
}