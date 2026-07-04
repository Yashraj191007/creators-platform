# include<iostream>
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
 
 void DeleteLastNode(Node* &head){
    if(head == NULL){
        // List is empty
        return;
    }

    if(head->next == NULL){
        // List has only one node
        delete head;
        head = NULL;
        return;
    }
    Node*temp = head ;
    while(temp->next->next != NULL){
        temp = temp->next;
    }
    Node* lastNode =temp->next;
    temp->next = NULL;
    delete lastNode;
 }

 int main()
 {
    Node*node1 = new Node(1);
    Node*node2 = new Node(2);
    Node*node3 = new Node(3);
    Node*head = node1 ; 
    node1->next = node2;
    node2->next = node3;
    Traverse(head);
    DeleteLastNode(head);
    Traverse(head);
 }