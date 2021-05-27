import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
let quizType = "Combine";
export { quizType };

let correctAnswersIdsArr = [];

const Container = styled.div`
  display: flex;
`;
let isIframeEventRead = false;

class App extends React.Component {

  constructor(props) {
    super(props);
    if (isIframeEventRead === false) {
      const liste1 = "ornekEleman1*ornekEleman2";
      const liste1D = liste1.split("*");
      const liste2 = "ornekEleman3*ornekEleman4";
      const liste2D = liste2.split("*");


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
            altContentId: '',
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
            altContentId: '',
            whichColumn: '2'
          }
          tasks.push(task);
          taskIdsList2.push(taskId.toString());
          taskId++;
        }

        /////
        correctAnswersIdsArr = [];
        for (let i in taskIdsList1) {
          const correctMatch = {
            taskIdOne: taskIdsList1[i],
            taskIdTwo: taskIdsList2[i]
          }
          correctAnswersIdsArr.push(correctMatch);
        }
        /////

        return tasks;
      };



      const initialDataFromIframe = {
        tasks: getTasksInLists(liste1D, liste2D),

        columns: {
          'column-1': {
            id: 'column-1',
            title: ' ',
            taskIds: taskIdsList1
            //taskIds arrayi ile ownership saglanmis oluyor => task1-2-3 column1 icerisinde
          },

          'column-2': {
            id: 'column-2',
            title: ' ',
            taskIds: taskIdsList2
          }
        },
        columnOrder: ['column-1', 'column-2'],
      };
      this.state = initialDataFromIframe;
    }

    if (quizType === "Combine") {
      const columnIki = Array.from(this.state.columns["column-2"].taskIds);
      columnIki.forEach(element => this.state.tasks[element].isDragDisabled = true);

    }


  }

  componentDidMount() {
    window.addEventListener("message", this.handleIframeTask.bind(this), false);
  };

  handleIframeTask = (e) => {
    isIframeEventRead = true;
    var eventDataArr = JSON.stringify(e.data).split(",");
    quizType = eventDataArr[0].split(':')[1].substring(1, eventDataArr[0].split(':')[1].length - 1);
    const liste1 = eventDataArr[1].split(':')[1].substring(1, eventDataArr[1].split(':')[1].length - 1);
    const liste2 = eventDataArr[2].split(':')[1].substring(1, eventDataArr[2].split(':')[1].length - 2);

    const liste1D = liste1.split("*");
    const liste2D = liste2.split("*");

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
          altContentId: '',
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
          altContentId: '',
          whichColumn: '2'
        }
        tasks.push(task);
        taskIdsList2.push(taskId.toString());
        taskId++;
      }

      correctAnswersIdsArr = [];
      for (let i in taskIdsList1) {
        const correctMatch = {
          taskIdOne: taskIdsList1[i],
          taskIdTwo: taskIdsList2[i]
        }
        correctAnswersIdsArr.push(correctMatch);
      }

      return tasks;
    };

    const initialDataFromIframe = {
      tasks: getTasksInLists(liste1D, liste2D),
      columns: {
        'column-1': {
          id: 'column-1',
          title: ' ',
          taskIds: taskIdsList1
          //taskIds arrayi ile ownership saglanmis oluyor => task1-2-3 column1 icerisinde
        },

        'column-2': {
          id: 'column-2',
          title: ' ',
          taskIds: taskIdsList2
        }
      },
      columnOrder: ['column-1', 'column-2'],
    };

    this.setState(initialDataFromIframe);
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
    //console.log("result: " + JSON.stringify(result));
    if (quizType === "Combine") {

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
      if (combine && quizType === "Combine") {
        //console.log("quiztype combine");
        const start = this.state.columns[source.droppableId];
        //const finish = this.state.columns[combine.droppableId];
        const combineTaskIds = Array.from(start.taskIds);
        // icindeki text: this.state.tasks[eleman].content
        var eleman = combineTaskIds[source.index];
        var textLeft = this.state.tasks[eleman].content;
        var textLeftId = this.state.tasks[eleman].id;

        var eleman2 = combine.draggableId;
        this.state.tasks[eleman2].altContent = textLeft;
        this.state.tasks[eleman2].altContentId = textLeftId;
        //soldakini silmek yerine, sagdaki combine edilen elemanin altına bir text ekle
        const newColumn = {
          ...start,
          taskIds: combineTaskIds,
        };
        this.setState(prevState => ({ ...prevState, columns: { ...prevState.columns, [newColumn.id]: newColumn } }));
      }
    }

    if (quizType === "Reorder") {
      console.log("quiztype reorder icinde");
      const { destination, source, draggableId } = result;

      if (!destination) {
        console.log("kontrol-1");
        return;
      }

      if (destination.droppableId === source.droppableId &&
        destination.index === source.index) {
        console.log("kontrol-2");
        return;
      }

      const startColumn = this.state.columns[source.droppableId];
      const finishColumn = this.state.columns[destination.droppableId];

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        //draggableId=taskId
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          taskIds: newTaskIds,
        };

        const newState = {
          ...this.state,
          columns: {
            ...this.state.columns,
            [newColumn.id]: newColumn,
          },
        };

        this.setState(newState);

        return;
      }

      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finishColumn,
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

    }
    return;
  }

  //DragDropContext'te 3 adet callback var
  //ondragend,ondragstart,ondragupdate
  render() {

    //answers that user gave for the reorder quiztype
    const answersArr = [];
    if (quizType === "Reorder") {
      const taskIdsFirstCol = this.state.columns["column-1"].taskIds;
      const taskIdsSecondCol = this.state.columns["column-2"].taskIds;

      for (let i in taskIdsFirstCol) {

        const answer = {
          taskIdOne: taskIdsFirstCol[i],
          taskIdTwo: taskIdsSecondCol[i]
        }
        answersArr.push(answer);

      }
      //console.log("answers arr: " + JSON.stringify(answersArr));
      //console.log("correct answers arr: " + JSON.stringify(correctAnswersIdsArr));
    }

    //answers that user gave for the combine quiztype
    if (quizType === "Combine") {

      const taskAltIdsSecondCol = [];
      const taskIdsSecondCol = this.state.columns["column-2"].taskIds;

      for (let i in taskIdsSecondCol) {
        const tasks = this.state.tasks;

        for (let j in tasks) {
          if (JSON.stringify(tasks[j].id) === JSON.stringify(taskIdsSecondCol[i])) {
            const answerAltId = tasks[j].altContentId;
            taskAltIdsSecondCol.push(answerAltId);
          }
        }

      }

      for (let i in taskIdsSecondCol) {

        const answer = {
          taskIdOne: taskAltIdsSecondCol[i],
          taskIdTwo: taskIdsSecondCol[i]
        }
        answersArr.push(answer);

      }
      //console.log("answers arr: "+JSON.stringify(answersArr));
      //console.log("correct answers arr: "+JSON.stringify(correctAnswersIdsArr));
    }


    var score = 0;
    const maxPoints = correctAnswersIdsArr.length;

    for (let i in correctAnswersIdsArr) {
      for (let j in answersArr) {
        if (JSON.stringify(correctAnswersIdsArr[i]) === JSON.stringify(answersArr[j])) {
          score = score + 1;
          continue;
        }
        else {
          continue;
        }
      }
    }

    //send this to iframe to be shown after form submit
    var scoreForIframe = score + "/" + maxPoints;
    window.parent.postMessage(scoreForIframe, 'https://elegant-blackwell-70ddb5.netlify.app');

    //const columnIki = Array.from(this.state.columns["column-2"].taskIds);
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

            //// <= olma durumu da var
            var isDropDisabled = index < this.state.homeIndex;
            if (quizType === "Combine") {
              isDropDisabled = index <= this.state.homeIndex;
            }
            return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled} />;
          })}
        </Container>
      </DragDropContext>

    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

