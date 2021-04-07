import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initialData;

  onDragEnd = result => {
    //TODO
    const {destination, source, draggableId} = result;

    if (!destination){
      return;
    }

    //user droppable'i basladigi yere geri birakti
    if(destination.droppableId === source.droppableId &&
      destination.index === source.index){
        return;
      }

    //******Listeyi reorder yapiyor******
    //bunu if start==finish seklince yazmak gerekiyor
    //   const column = this.state.columns[source.droppableId];
    //   const newTaskIds = Array.from(column.taskIds);
    //   newTaskIds.splice(source.index, 1);
    //   //splice: from this index remove 1 item.
    //   newTaskIds.splice(destination.index, 0, draggableId);
    //   //draggableId: taskId splice burada 0 eleman sil ve draggableId'yi ekle diyor.
   
    //   const newColumn = {
    //     ...column,
    //     taskIds: newTaskIds,
    //   };
      
    //   const newState = {
    //     ...this.state,
    //     columns: {
    //       ...this.state.columns,
    //       [newColumn.id]: newColumn,
    //     },
    //   };
    
    //   this.setState(newState);


    //******bir listeden digerine gecis******
      const start = this.state.columns[source.droppableId];
      const finish = this.state.columns[destination.droppableId];

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index,1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index,0,draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      this.setState(newState);
      return;

     };

  //DragDropContext'te 3 adet callback var
  //ondragend,ondragstart,ondragupdate
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
      {this.state.columnOrder.map(columnId => {
        const column = this.state.columns[columnId];
        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
        
        return <Column key = {column.id} column={column} tasks={tasks} />;
      })}
      </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
