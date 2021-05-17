import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
//import { useState } from 'react';

const Container = styled.div`
  display: flex;
`;
let isIframeEventRead = false;
class App extends React.Component {

  constructor(props) {
    super(props);
    if (isIframeEventRead === false) {
      const liste1 = "ornekEleman1 ornekEleman2";
      const liste1D = liste1.split(" ");
      const liste2 = "ornekEleman3 ornekEleman4";
      const liste2D = liste2.split(" ");

      const taskIdsList1 = [];
      const taskIdsList2 = [];
      const getTasksInLists = (liste1D, liste2D) => {

        let tasks = [];
        let taskId = 0;
        for (let idx in liste1D) {
          const task = {
            id: taskId.toString(),
            content: liste1D[idx],
            altContent: '',
            whichColumn: '1'
          }
          tasks.push(task);
          taskIdsList1.push(taskId.toString());
          taskId++;
        }
        for (let idx in liste2D) {
          const task = {
            id: taskId.toString(),
            content: liste2D[idx],
            altContent: '',
            whichColumn: '2'
          }
          tasks.push(task);
          taskIdsList2.push(taskId.toString());
          taskId++;
        }
        return tasks;
      };

      const initialDataFromIframe = {
        tasks: getTasksInLists(liste1D, liste2D),

        columns: {
          'column-1': {
            id: 'column-1',
            title: 'liste1',
            taskIds: taskIdsList1
            //taskIds arrayi ile ownership saglanmis oluyor => task1-2-3 column1 icerisinde
          },

          'column-2': {
            id: 'column-2',
            title: 'liste2',
            taskIds: taskIdsList2
          }
        },
        columnOrder: ['column-1', 'column-2'],
      };
      this.state = initialDataFromIframe;
      console.log("**");
    }

    const columnIki = Array.from(this.state.columns["column-2"].taskIds);
    columnIki.forEach(element => this.state.tasks[element].isDragDisabled = true);

  }

  componentDidMount() {
    window.addEventListener("message", this.handleIframeTask.bind(this), false);
  };

  handleIframeTask = (e) => {
    isIframeEventRead = true;
    var eventDataArr = JSON.stringify(e.data).split(",");
    const quizType = eventDataArr[0].split(':')[1].substring(1, eventDataArr[0].split(':')[1].length - 1);
    const liste1 = eventDataArr[1].split(':')[1].substring(1, eventDataArr[1].split(':')[1].length - 1);
    const liste2 = eventDataArr[2].split(':')[1].substring(1, eventDataArr[2].split(':')[1].length - 2);

    const liste1D = liste1.split(" ");
    const liste2D = liste2.split(" ");

    const taskIdsList1 = [];
    const taskIdsList2 = [];

    const getTasksInLists = (liste1D, liste2D) => {
      let tasks = [];
      let taskId = 0;

      for (let idx in liste1D) {
        const task = {
          id: taskId.toString(),
          content: liste1D[idx],
          altContent: '',
          whichColumn: '1'
        }
        tasks.push(task);
        taskIdsList1.push(taskId.toString());
        taskId++;
      }

      for (let idx in liste2D) {
        const task = {
          id: taskId.toString(),
          content: liste2D[idx],
          altContent: '',
          whichColumn: '2'
        }
        tasks.push(task);
        taskIdsList2.push(taskId.toString());
        taskId++;
      }
      return tasks;
    };

    const initialDataFromIframe = {
      tasks: getTasksInLists(liste1D, liste2D),
      columns: {
        'column-1': {
          id: 'column-1',
          title: 'liste1',
          taskIds: taskIdsList1
          //taskIds arrayi ile ownership saglanmis oluyor => task1-2-3 column1 icerisinde
        },

        'column-2': {
          id: 'column-2',
          title: 'liste2',
          taskIds: taskIdsList2
        }
      },
      columnOrder: ['column-1', 'column-2'],
    };

    console.log("handleiframe****");
    console.log("Iframe data: "+ JSON.stringify(initialDataFromIframe));
    constructor(this.props);
    this.state = initialDataFromIframe;
    this.forceUpdate();
    console.log("****");
  };

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
    //const columnIki = Array.from(this.state.columns["column-2"].taskIds);
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

