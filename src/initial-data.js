const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'bir',altContent:'' },
        'task-2': { id: 'task-2', content: 'iki',altContent:''},
        'task-3': { id: 'task-3', content: 'uc', altContent:''},
        'task-4': { id: 'task-4', content: 'liste 2nin ilk elemani liste 2nin ilk elemani liste 2nin ilk elemani', altContent:''},
        'task-5': { id: 'task-5', content: 'liste 2nin ikinci elemani', altContent: ''}
    },
    //task_id key olarak kullaniliyor
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'liste1',
            taskIds: ['task-1', 'task-2', 'task-3',]
            //taskIds arrayi ile ownership saglanmis oluyor => task1-2-3 column1 icerisinde
        },

        'column-2': {
            id: 'column-2',
            title: 'liste2',
            taskIds: ['task-4', 'task-5']
        }
    },

    columnOrder: ['column-1', 'column-2'],
    //birden fazla column olduğunda onlari orderda tutmak için
};

export default initialData;

