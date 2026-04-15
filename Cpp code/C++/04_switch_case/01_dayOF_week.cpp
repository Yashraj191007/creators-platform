#include <iostream>
using namespace std;
int main()
{
    int n;
    cout<<"\n Enter Number 1 to 7:";
    cin>>n;
    switch (n)
    {
    case 1:
        cout<<"\n Today is Sunday:";
        break;

    case 2:
        cout<<"\n Today is Monday";
      break;

    case 3:
        cout<<"\n Today is Tuesday";
        break;

    case 4:
        cout<<"\n Today is Wednesday";
        break;

    case 5:
        cout<<"\n Today is Thursday";
        break;

    case 6:
        cout<<"\n Today is Friday";
        break;

    case 7:
        cout<<"\n Today is Saturday";
        break;
    
    default:
        cout<<"\n Invalid Number";
        break;
    }
}