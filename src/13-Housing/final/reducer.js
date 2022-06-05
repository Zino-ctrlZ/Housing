export const reducer = (state, action) => {

    if(action.type === 'ADD_LOCATION'){
        const newLocations = [...state.locations, action.payload]
        return {
            ...state, 
            locations: newLocations
        }
    }

    throw new Error('no matching action type')
}