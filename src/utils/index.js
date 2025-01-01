'use strict';

import _ from 'lodash';


const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

// convert fileds to object => ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// convert fileds to object => ['a', 'b'] => {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (object) =>{
    Object.keys(object).forEach(key => {
        if (object[key] == undefined) {
            delete object[key];
        }
    })

    return object;
}


const updateNestedObjectParsers = (object) => {
    const final = {}
    Object.keys(object).forEach(key => {
        if (typeof object[key] === 'object' &&!Array.isArray(object[key])) {
            const res = updateNestedObjectParsers(object[key])
            Object.keys(res).forEach( a => {
                final[`${key}.${a}`] = res[a]
            })
        }else{
            final[key] = object[key]
        }
    })
    return final
}
export {getInfoData, getSelectData, unGetSelectData, removeUndefinedObject, updateNestedObjectParsers};