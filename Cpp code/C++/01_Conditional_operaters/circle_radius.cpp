// C++ program to calculate circle area and perimeter.
# include <iostream>
int main()
{
    double r , area , peri;
    std :: cout<<"\n Enter radius of circle: ";
    std :: cin>>r;
    area = 3.1416*r*r;
    std :: cout<<"\n Area of circle is:"<< area;
    peri = 2*3.1416*r;
    std :: cout<<"\n Perimeter of circle is:"<<peri;
}