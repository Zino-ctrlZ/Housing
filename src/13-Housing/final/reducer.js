export const reducer = (state, action) => {

    if(action.type === 'ADD_LOCATION'){
        const newLocations = [...state.locations, action.payload]
        return {
            ...state, 
            locations: newLocations
        }
    }

    if(action.type === 'CHANGE_ADDRESS'){
        const newAddr = action.payload
        return {
            ...state, 
            address: newAddr
        }
    }

    if(action.type === 'CHANGE_RANGE'){
        const catDetails = action.payload
        const newCategories = {...state.categories}
        newCategories[catDetails[0]] = catDetails[1]
        return{
            ...state, 
            categories: newCategories
        }

    }

    if(action.type === 'ADD_CATEGORY'){
        const newCategories = {...state.categories}
        const newCatName = action.payload
        newCategories[newCatName] = ''
        return{
            ...state, 
            categories: newCategories
        }
    }

    if (action.type === 'REMOVE_CATEGORY') {
        const newCategories = { ...state.categories }
        const category = action.payload 
        delete newCategories[category]
        return {
            ...state, 
            categories: newCategories
        }
    }
    if(action.type === 'RESET'){
        const newCategories = {...state.categories}
        Object.keys(newCategories).forEach(catName => {
            newCategories[catName] = ''
        })
        return{
            ...state, 
            address: '',
            categories: newCategories
        }
        
    }
    throw new Error('no matching action type')
}