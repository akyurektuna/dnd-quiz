import React, { Component } from 'react';

export default class AddTask extends Component {
    constructor(props){
        super(props);
        this.state.task = {
            //todo
        }
    };

    addContent = (e) => {
        const content = e.target.value;
        this.setState({content, addContent: content});
    };

    createTask = () => {
        this.props.add({
            content: this.state.task.content,
        });
    };

    render(){
        return (
            <div>
                <input 
                onChange={this.addContent}
                placeholder= "add content"
                />
                <br />
                <button onClick={this.createTask}>create</button>
            </div>);
    }
}