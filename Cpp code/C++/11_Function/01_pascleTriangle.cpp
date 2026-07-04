#include <iostream>
using namespace std;

int fact(int n) {
    int f = 1;
    for (int i = 1; i <= n; i++) {
        f = f * i;
    }
    return f;
}

int ncr(int n, int r) {
    if (r > n) return 0;
    return fact(n) / (fact(r) * fact(n - r));
}

int main() {
    int n;
    cin >> n;

    for (int i = 0; i < n+1; i++) {
        // Print leading spaces for center alignment
        for (int s = 1; s < n-i+1 ; s++) {
            cout << " ";
        }

        // Print the numbers
        for (int j = 0; j <= i; j++) {
            cout << ncr(i, j) << " ";
        }
        cout << endl;
    }

    return 0;
}
