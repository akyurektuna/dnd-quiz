import React from 'react';
import styled from 'styled-components';
import { Droppable } from  'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width: 220px;
    display: flex;
    flex-direction: column;
`;
const Title = styled.h3`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'silver' : 'white')};
    flex-grow: 1;
    min-height: 100px;
`;

class InnerList extends React.Component{
    shouldComponentUpdate(nextProps){
        if(nextProps.tasks === this.props.tasks){
            return false;
        }
        return true;
    }
    render(){
        return this.props.tasks.map((task,index) => (
            <Task key={task.id} task={task} index={index} />
        ));
    }
}


export default class Column extends React.Component {
    render() {
        console.log("combine column icinde nasil duruyo: "+ this.props.isCombineEnabled);
        return (
            <Container>
                <Title> {this.props.column.title}</Title>
                <Droppable 
                    droppableId={this.props.column.id}
                    isDropDisabled={this.props.isDropDisabled}
                    //1. column a drop yapilamasin
                    isCombineEnabled
                    >
                    
                    {(provided, snapshot) => (
                    <TaskList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        <InnerList tasks={this.props.tasks} />
                        {provided.placeholder}
                    </TaskList>
                    )}
                </Droppable>
            </Container>
        );
    }
}