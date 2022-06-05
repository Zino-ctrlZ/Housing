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

    throw new Error('no matching action type')
}