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

bool checkEqual(Node*head1 , Node*head2){
    while(head1!=NULL && head2!= NULL){
        if(head1->value!=head2->value){
            return false;

        }
        head1 = head1->next;
        head2 = head2->next;
    }
    return (head1==NULL && head2==NULL);
}



int main(){
    Node*head1 = NULL;
    InsertAtEnd(head1 , 2);
    InsertAtEnd(head1 , 1);
    InsertAtEnd(head1 , 3);
    InsertAtEnd(head1 , 5);
    InsertAtEnd(head1 , 5);
    traverse(head1);

    Node*head2 = NULL;
    InsertAtEnd(head2 , 2);
    InsertAtEnd(head2 , 1);
    InsertAtEnd(head2 , 3);
    InsertAtEnd(head2 , 4);
    InsertAtEnd(head2 , 5);
    traverse(head2);

    cout<<checkEqual(head1 , head2)<<endl;
    return 0; 

}