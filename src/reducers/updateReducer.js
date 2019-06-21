function updateState(state, dispatch){
    if(typeof dispatch !== 'object' || dispatch === null){
        let type = typeof dispatch;
        if (dispatch === null){
            type = null;
        }
        throw TypeError(`updateState() argument must be an object, or array of objects, not array of '${type}', or mixed.`);
    }

    let fields = []
    let fieldName = "stateKey"
    let obj = {stateKey: state}
    if(dispatch.field !== undefined){
        fields = dispatch.field.split(".");
        fieldName = fields.pop();
        obj = state;
        for(let field of fields){
            obj = obj[field]
        }
    }

    if(dispatch.action === "assign" || dispatch.action === undefined){
        obj[fieldName] = dispatch.value;
        if(dispatch.field === undefined){
            // Apply side effect on state
            state = obj[fieldName]
        }
    }
    else if(dispatch.action === "push"){
        obj[fieldName].push(dispatch.value);
    }
    else if(dispatch.action === "pop"){
        obj[fieldName].pop();
    }
    else if(dispatch.action === "remove"){
        let index = obj[fieldName].indexOf(dispatch.value);
        if (index > -1) {
            obj[fieldName].splice(index, 1);
        }
    }
    else if(dispatch.action === "filter"){
        // Note filter has no side effect
        obj[fieldName] = obj[fieldName].filter(dispatch.value);
        if(dispatch.field === undefined){
            // Apply side effect on state
            state = obj[fieldName]
        }
    }
    else{
        // Unsupported Operator
    }
    return state
}


function updateReducer(state, dispatches){
    if(Array.isArray(dispatches)){
        // Do nothing
    }
    else if(typeof dispatches === 'object' && dispatches !== null){
        dispatches = [dispatches]
    }
    else {
        let type = typeof dispatches;
        if (dispatches === null){
            type = null;
        }
        throw TypeError(`updateReducer() argument must be an object, or array of objects, not '${type}'.`);
    }

    for(let dispatch of dispatches){
        state = updateState(state, dispatch);
    }

    return state
}

export {updateReducer}
