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

Node*insert(int n){
    Node*head = NULL;
    Node*tail = NULL;
    for(int i=0 ; i<n ; i++){
        int x;
        cin>>x;
        Node*newNode = new Node(x);
        if(head==NULL){
            head= tail = newNode;
        }
        else{
            tail->next = newNode;
            tail = newNode;
        }
    }
    return head;
}

// void DeleteAtStart(Node* &head){
//    Node*temp= head;
//    head=head->next;
//    delete(temp);
// }

void print(Node*head){
    Node*fast = head;
    Node*slow = head;
    while(fast!= NULL and fast->next!=NULL){
        fast = fast->next->next;
        slow = slow->next;
    }
    cout<<slow->value;
}
 
int main(){
    Node*head = NULL;
    int n ; 
    cin>>n;
    head= insert(n);
    print(head);
}