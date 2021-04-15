import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props =>
        props.isDragDisabled ? 'lightgrey' 
        :props.isDragging ? 'whitesmoke' : 'white'};
        //dragdisabled olanin rengini grey yapmiyor
    display: flex;
`;
//task contenti bu container icerisinde wrap ediyoruz

const Answer = styled.div`
    width: 20px;
    height: 20px;
    textAlign: right;
`;

// const Handle = styled.div`
//     width: 20px;
//     height: 20px;
//     background-color: plum;
//     border-radius: 4px;
//     margin-right: 8px;
// `; 
//drag handle artık handle componenti olacak (container yerine)
export default class Task extends React.Component {
    render() {
        //dragdisabled durumunu ikinci listedeki tum elemanlar icin yap
        //whichColumn = 2 olan tum tasklar icin drag disabled
        const isDragDisabled = this.props.task.whichColumn > '1';
        console.log(this.props.columnIki);
        return(
        <Draggable 
            draggableId={this.props.task.id} 
            index={this.props.index}
            isDragDisabled={isDragDisabled}
            isCombineEnabled={this.props.isCombineEnabled}
            >
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    {/* <Handle {...provided.dragHandleProps}/> */}
                    {this.props.task.content}
                    <Answer> {this.props.task.altContent} </Answer>
                </Container>
            )}
            
        </Draggable>
        );
    }
}
