var app = new Vue({
    el:'#app',
    data:{
        message:'Hello Vue.js!'
    }
});

var wayBind = new Vue({
    el:'.way-bind',
    data:{
        message:'Hello Qiudw!'
    }
});

var form = new Vue({
    el:'.form-controls',
    data:{
        checked:'对否',
        checkedNames:[],
        selected:'A',
        selecteds:[],
        options:[
            {text:'One',value:'A'},
            {text:'Two',value:'B'},
            {text:'Three',value:'C'}
        ]
    }
});