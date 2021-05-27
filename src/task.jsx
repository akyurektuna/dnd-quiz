import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import {quizType} from './index.js';

const Container = styled.div`
border: 1px solid lightgrey;
border-radius: 2px;
padding: 8px;
margin-bottom: 8px;
background-color: ${props => props.isDragDisabled ? 'lightgrey' : props.isDragging ? 'lightgreen':'white'};
display: flex;
position: relative;
`;
//task contenti bu container icerisinde wrap ediyoruz

//answer sadece quizType:combine icin olmali
const Answer = styled.div`
width: 20px;
height: 20px;
color: white;
position: absolute;
right: 10px;
border: 1px solid lightgrey;
border-radius: 8px;
background-color: #0c7a0c;
display: inline-table;
padding: 0 5px;
`;


export default class Task extends React.Component {
    render() {
        //quizType: combine icin
        //dragdisabled durumunu ikinci listedeki tum elemanlar icin yap
        //whichColumn = 2 olan tum tasklar icin drag disabled
        var isDragDisabled = this.props.task.whichColumn > '1';
        
        if(quizType === "Reorder"){
            isDragDisabled = this.props.task.whichColumn <'2';
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
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    {this.props.task.content}
                    {this.props.task.altContent && <Answer> {this.props.task.altContent} </Answer>}
                    
                </Container>
            )}
            
        </Draggable>
        );
    }
}
