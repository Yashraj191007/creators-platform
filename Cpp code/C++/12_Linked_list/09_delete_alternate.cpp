# include<iostream>
using namespace std;

class Node{
    public:
    int value ;
    Node*next ;

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
    }cout<<"NULL"<<endl;
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

void DeleteAlternate(Node*&head ){
    Node*temp = head;
    while(temp!=NULL and temp->next!=NULL){
        Node*deleteNode = temp->next;
        temp->next = temp->next->next;
        temp = temp->next;
        delete(deleteNode);

    }
    traverse(head);
}

int main(){
    Node*head = NULL;
    InsertAtEnd(head , 1);
    InsertAtEnd(head , 2);
    InsertAtEnd(head , 3);
    InsertAtEnd(head , 4);
    InsertAtEnd(head , 5);
    traverse(head);
    DeleteAlternate(head);

}