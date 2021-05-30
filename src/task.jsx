import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import {quizType} from './index.js';

//task content is wrapped in this container
const Container = styled.div`
border: 1px solid lightgrey;
border-radius: 2px;
padding: 8px;
margin-bottom: 8px;
background-color: ${props => props.isDragDisabled ? 'lightgrey' : props.isDragging ? 'lightgreen':'white'};
display: flex;
position: relative;
&.even {
    background-color: #c2e3a8;
}
&.odd {
    background-color: #dfc6f1;
}
`;

// answer should be used in quizType: combine cases
const Answer = styled.div`
width: 20px;
height: 20px;
color: white;
position: absolute;
right: 10px;
border: 1px solid lightgrey;
border-radius: 30px;
background-color: #0c7a0c;
display: inline-table;
text-align: center;
`;


export default class Task extends React.Component {
    render() {
        //for the quizType:combine
        //drag is disabled for all the tasks that have whichColumn = 2 
        var isDragDisabled = this.props.task.whichColumn > '1';
        
        if(quizType === "Reorder"){
            isDragDisabled = this.props.task.whichColumn <'2';
        }
        let rowClassName = '';
        if(quizType === "Reorder"){
            rowClassName = this.props.index % 2 === 0 ? "even" : "odd";
        }
        


        return(
        <Draggable 
            draggableId={this.props.task.id} 
            index={this.props.index}
            isDragDisabled={isDragDisabled}
            isCombineEnabled={this.props.isCombineEnabled}
            >
            {(provided, snapshot) => (
                <Container
                    className={rowClassName} 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <div>{this.props.task.content}</div>
                    
                    {this.props.task.altContent && <div> <Answer> {this.props.task.altContent} </Answer> </div>}
                    
                </Container>
            )}
            
        </Draggable>
        );
    }
}
