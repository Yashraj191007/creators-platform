/* These function is used to count the number of characters in the string.   
String are 1D array of type char. */   
# include<iostream>
# include<cstring>
using namespace std;
int main()
{
  int i , l ;
  char a[100];
  cout<<"\n Enter a line of text:";
  cin.getline(a,100);
  l = strlen(a);
  cout<<"\n Line in reverse:";
  for(i=l-1 ; i>=0 ; i--)
  {
    cout<<a[i];
  }
}
