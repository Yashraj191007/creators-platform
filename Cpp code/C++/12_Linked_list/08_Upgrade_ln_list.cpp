#include<iostream>
using namespace std;
 class Node{
    public:
    int value;
    Node* next ; 

    Node(int v){
        value = v;
        next = NULL;
    }
 };

 void Traverse(Node*head){
    Node*temp = head;
    while(temp!=NULL){
        cout<<temp->value<<"->";
        temp = temp->next;
    }cout<<"Null"<<endl;
 }

 void InsertAtHead(Node* &head, int val){
    Node*newNode = new Node(val);
    newNode->next = head;
    head = newNode;
 }

 void InsertAtEnd(Node* &head , int val){
    Node*newNode = new Node(val);
    Node*temp = head ;
    while(temp->next!=NULL){
        temp = temp->next ; 
    }temp->next = newNode;
 }

 void InsertAtMiddle(Node* &head , int val , int position){
    Node* newNode = new Node(val);
    Node* prev = head ; 
    int count = 1; 
    while(count<(position-1)){
        prev = prev->next;
        count++;
    }
    newNode->next= prev->next ;
    prev->next = newNode;
 }

 void UpgradeInList(Node* &head , int val , int position){
    Node*temp = head ;
    int count=1;
    while(count<(position)){
        temp= temp->next;
        count++;
    }
    temp->value = val;
    Traverse(head);
 }

 int main()
 {
    Node*node1 = new Node(1);
    Node*node2 = new Node(2);
    Node*head = node1 ; 
    node1->next = node2;
    Traverse(head);
    InsertAtHead(head , 0);
    InsertAtEnd(head , 4);
    InsertAtMiddle(head , 3 , 4);
    Traverse(head);
    UpgradeInList(head, 99 , 2);
 }