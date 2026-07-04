# include <iostream>
using namespace std;
void print(int n)
{
    if(n==0)
    {
        return ;    //base case
    }
    cout<<n<<endl;  //processing  or  work.
    print(n-1);     //recursive call
}
int main()
{
    int n ; 
    cin>>n;
    print(n);
}