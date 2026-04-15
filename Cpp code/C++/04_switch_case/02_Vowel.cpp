# include <iostream>
using namespace std;
int main()
{
    char v;
    cout<<"\n Enter any Alphabet:";
    cin>>v;
switch (v)
{
    case 'a':
    case 'A':
    cout<<"\n A is a vowel";
    break;

    case 'e':
    case 'E':
    cout<<"\n E is a vowel";
    break;

    case 'i':
    case 'I':
    cout<<"\n I is a vowel";
    break;

    case 'o':
    case 'O':
    cout<<"\n O is a vowel";
    break;

     case 'u':
    case 'U':
    cout<<"\n U is a vowel";
    break;
    
    default:
    cout<<"\n This is consonent";

}
}