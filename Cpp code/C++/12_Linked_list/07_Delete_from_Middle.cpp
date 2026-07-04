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



 void DeleteAtStart(Node*&head){
    Node*temp = head;
    head=head->next;
    delete(temp);
 }
 
 void DeleteFromMiddle(Node* &head , int val){
    if(val==1){
        DeleteAtStart(head);
        return;
    }
    Node*prev = head ;
    int count = 1 ;
    while(count<(val-1)){
        prev =prev->next;
        count++;
    }
    Node*lastNode = prev->next;
    prev->next = lastNode->next;
    delete(lastNode);
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
    DeleteFromMiddle(head , 3);
    Traverse(head);
 }
   
