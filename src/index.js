import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';
//import { useState } from 'react';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {

  state = initialData;

  componentDidMount() {
    console.log("componentdidMount icinde");
    window.addEventListener('message', this.handleIframeTask);
    console.log(this.handleIframeTask);
    //this.handleIframeTask();
    console.log("componentdidMount icinde????? event listener sonrasi");
  };


  handleIframeTask = (e) => {
    console.log("index.js icinde handleIframe");
    // console.log(e.origin);
    // if (e.origin !== 'https://localhost:3000/') {
    //   return;
    // }
    if (e.data === 'message') {
      console.log("react icinde handleIframe");
      // this.setState({
      //   activeStep: 3,
      // });
    }
  };

  constructor(props) {
    super(props);
    const columnIki = Array.from(this.state.columns["column-2"].taskIds);
    columnIki.forEach(element => this.state.tasks[element].isDragDisabled = true);

  }

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

    this.setState({
      homeIndex,
    });
  };

  onDragEnd = result => {

    this.setState({
      homeIndex: null,
    });
    const { destination, source, combine } = result;

    if (!combine && !destination) {
      return;
    }
    //user droppable'i basladigi yere geri birakti
    if (!combine && destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }

    //******bir listeden digerine gecis******
    if (combine) {
      const start = this.state.columns[source.droppableId];
      //const finish = this.state.columns[combine.droppableId];
      const combineTaskIds = Array.from(start.taskIds);
      // icindeki text: this.state.tasks[eleman].content
      var eleman = combineTaskIds[source.index];
      var textLeft = this.state.tasks[eleman].content;

      var eleman2 = combine.draggableId;
      this.state.tasks[eleman2].altContent = textLeft;
      //soldakini silmek yerine, sagdaki combine edilen elemanin altına bir text ekle
      const newColumn = {
        ...start,
        taskIds: combineTaskIds,
      };
      this.setState(prevState => ({ ...prevState, columns: { ...prevState.columns, [newColumn.id]: newColumn } }));
    }

    return;

  };
  
  //DragDropContext'te 3 adet callback var
  //ondragend,ondragstart,ondragupdate
  render() {
    const columnIki = Array.from(this.state.columns["column-2"].taskIds);
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

            const isDropDisabled = index <= this.state.homeIndex;
            return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled} />;
          })}
        </Container>
      </DragDropContext>

    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

