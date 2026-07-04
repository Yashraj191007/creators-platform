# include<iostream>
using namespace std;

class Node{
    public:
    int value;
    Node*next ; 

    Node(int v){
        value = v;
        next= NULL;
    }
};

Node*InsertInput(int n){
    Node*head = NULL;
    Node*tail = NULL;
    for(int i=0 ; i<n ; i++){
        int x;
        cin>>x;    
        Node*newNode = new Node(x);

        if(head==NULL){
            head = tail = newNode;
        }
        else{
            tail->next=newNode;
            tail = newNode;
        }
    }
    return head;
}

Node* reverseList(Node* head) {
    Node* prev = NULL;
    Node* next = NULL;

    while (head != NULL) {
        next = head->next;   // store next
        head->next = prev;   // reverse link
        prev = head;         // move prev
        head = next;         // move head
    }

    return prev;  // new head
}


void print(Node*head){
    Node*temp= head;
    while(temp!=NULL){
        cout<<temp->value<<"->";
        temp = temp->next;
    }cout<<"NULL";
}

int main(){
    int n ;
    cin>>n;
    Node*head = InsertInput(n);
    head = reverseList(head);
    print(head);
}
