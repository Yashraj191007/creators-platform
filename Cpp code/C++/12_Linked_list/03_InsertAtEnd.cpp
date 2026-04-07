#include<iostream>
using namespace std;
class Node{
    public:
    int value;
    Node*next;

    Node(int v){
        value = v;
        next = NULL;
    }
};

void traverse(Node*head){
    Node*temp = head; 
    while(temp!=NULL){
        cout<<temp->value<<"->";
        temp = temp->next;
    }cout<<"Null";
}


void InsertAtHead(Node* &head , int val){
    Node*newNode = new Node(val);
    newNode->next= head ; 
    head = newNode;
}

void InsertAtEnd(Node* &head , int val){
    if(head==NULL){
        InsertAtHead(head, val);
        return;
    }
    Node*newNode = new Node(val);
    Node*temp = head ; 
    while (temp->next!=NULL)
    {
        temp = temp->next;
    }
    temp->next = newNode;
    
}
int main(){
    
    Node*node1 = new Node(1);
    Node*node2 = new Node(2);
    Node*head = node1;
    node1->next=node2;
    traverse(head);
    InsertAtHead(head , 0);
    InsertAtEnd(head , 3);
    traverse(head);
}