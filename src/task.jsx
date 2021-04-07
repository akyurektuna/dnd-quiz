import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? 'whitesmoke' : 'white')};
    display: flex;
`;
//task contenti bu container icerisinde wrap ediyoruz

const Handle = styled.div`
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 4px;
    margin-right: 8px;
`; 
//drag handle artık handle componenti olacak (container yerine)
export default class Task extends React.Component {
    render() {
        return(
        <Draggable draggableId={this.props.task.id} index={this.props.index}>
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    //{...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <Handle {...provided.dragHandleProps} />
                    {this.props.task.content}
                </Container>
            )}
            
        </Draggable>
        );
    }
}
