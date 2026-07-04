# include<iostream>
using namespace std;
struct Node{
    int value;
    Node*next;
    
    Node(int v){
        value = v;
        next = NULL;
    }
};

Node*insert(Node*head , int n){
    Node*newNode = new Node(n);
    newNode->next = head;
    head = newNode;
    return head;
}

Node*deleteNode(Node*head){
    if(head==NULL) return head;
    Node*temp = head;
    head= head->next;
    delete temp;
    return (head);
}

void display(Node*head){
    Node*temp = head;
    while(temp!=NULL){
        cout<<temp->value<<" ";
        temp = temp->next;
    }
}

int main(){
    Node*head = NULL;
    int n ; 
    cin>>n;
    for(int i=0; i<n; i++){
        int a;
        cin>>a;
        head = insert(head , a);
    }
    head = deleteNode(head);
    display(head);
    
}