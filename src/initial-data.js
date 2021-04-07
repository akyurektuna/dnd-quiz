const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'beautiful dnd icindeki combining kismini ekle' },
        'task-2': { id: 'task-2', content: 'combine edilince listedeki elemanlarin silinmesini kaldır'},
        'task-3': { id: 'task-3', content: 'sadece farkli iki listedekilerin combine edilmesini düzenle'}
    },
    //task_id key olarak kullaniliyor
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3',]
            //taskIds arrayi ile ownership saglanmis oluyor => task1-2-3 column1 icerisinde
        },
    },

    columnOrder: ['column-1'],
    //birden fazla column olduğunda onlari orderda tutmak için
};

export default initialData;

