import cvm from '../core/cvm';
import props from '../core/props';

const renderFactory = function (prototypeExtend) {
    let $r = function (vm,handler,options) {
        render.call(this,vm,handler,options);
    };
    $r.prototype = Object.create(render.prototype);
    Object.assign($r.prototype, prototypeExtend);
    $r.prototype.constructor = $r;
    return $r;
};



const render = function (vm, handler, options = {}) {
    this.handler = handler;
    this.options = options;
    this.vm = vm;
    this.cvm = cvm.instance(vm.$createElement);
    this.init();
};

render.prototype = {
    props: props.instance(),
    init(){
        this.event = this.handler.rule.event;
    },
    parse(){
        throw new Error('请实现parse方法');
    },
    inputProps(){
        let {refName,unique,rule:{props,field}} = this.handler;
        return this.props
            .props(Object.assign(props,{model:`formData.${field}`,value:this.vm.formData[field],elementId:refName}))
            .ref(refName).key(`fip${unique}`).on(this.event).on('input',(value)=>{
                this.vm.$emit('input',value);
                this.vm.$set(this.vm.formData,field,value);
            });
    }
};

export {
    renderFactory
}