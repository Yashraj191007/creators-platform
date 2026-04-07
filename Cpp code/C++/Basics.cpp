
// #include <iostream>
// using namespace std;

// int main() {
//     cout << "Hello Debug 🚀" << endl;
//     return 0;
// }


// Pointers


// #include <iostream>
// using namespace std;

// int main() {   
//     int x ;
//     int* p = &x;
//     cout<<p;

// }

// #include<iostream>
// using namespace std;
// void swap(int* a, int* b) {
// int temp = *a;
// *a = *b;
// *b = temp;
// }
// int main(){
// int x = 12;
// int y = 45;
// cout << x << " " << y << endl;
// swap (&x,&y);
// cout << x << " " << y << endl;
// }
// print 1 to n with recursion
// #include <bits/stdc++.h>
// using namespace std;
// void print(int n){
//     if (n==0) return;
//     cout<<n<<endl;
//     print(n-1);
// }
// int main() {
//     int n;
//     cin>>n;
//     print(n);
// 	// your code goes here
// }


// 4th Belt 
// copy arr1 in arr2 
// #include <bits/stdc++.h>
// using namespace std;

// int main() {
//     int n;
//     cin>>n;
//     int arr1[n];
//     int arr2[n];

//     for(int i=0;i<n;i++){
//         cin>>arr1[i];
//     }
//     for (int i=0;i<n;i++){
//         arr2[i]=arr1[i];
//     }
//     for(int i=0;i<n;i++){
//         cout<<arr2[i]<<" ";
//     }
// 	// your code goes here

// }
// print secondlargest 
// #include <bits/stdc++.h>
// using namespace std;

// int main() {
//     int n;
//     cin>>n;
//     int arr[n];
//     for (int i=0;i<n;i++){
//         cin>>arr[i];
//     }
//     int largest=arr[0];
//     int Seclargest= INT_MIN;
//     for (int i=1; i<n;i++){
//         if (arr[i]>largest){
//             Seclargest=largest;
//             largest=arr[i];
//         }
//         else if ( arr[i]<largest && arr[i]>Seclargest){
//             Seclargest=arr[i];
//         }
//     }
//     if(Seclargest==INT_MIN){
//         cout<<largest;
//     }
//     else{
//         cout<<Seclargest;
//     }
    
// }












