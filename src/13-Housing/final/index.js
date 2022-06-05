import React , {useState} from 'react'


const Index = ()=> {
    const [locations, setLocations] = useState([])
    const [house, setHouse] = useState({address: ''})
    const [categories, setCategories] = useState({rent: '', location: '' })
    const [catValue, setCatValue] = useState({name: ''})
    const [edit, setEdit] = useState(false)

    const handleChange = (e) =>{
        const name = e.target.id
        const value =  e.target.value
       
        setHouse({...house, [name]: value })
    }

    const handleRangeChange = (e) =>{
        e.preventDefault()
        const name = e.target.name
        const value = e.target.value
        console.log(name, value)
        setCategories((category) => {
            const newCategories = {...category}
            newCategories[name] = value
            return newCategories    
        } )
    }


    const handleSubmit = (e) =>{
        e.preventDefault() 
        if(house.address && !edit){
            //calculate an average 
            let totalScore = 0 
            Object.keys(categories).forEach(v => {
                console.log(categories[v])
                totalScore += Number(categories[v])
            }) 
            totalScore = totalScore / Object.keys(categories).length 

            //add new location to array 
            const newLocation = {...house, id: new Date().getMilliseconds().toString(), score: totalScore}
            setLocations([...locations, newLocation])
            
            const newHouse = {address: ''}
            const setDefaultCategory = (category)=> {
                const newCategory = {...category}
                Object.keys(newCategory).forEach(v => {
                    newCategory[v] = ''})
                return newCategory    
            }

            const defaultCategory = setDefaultCategory(categories)
            setCategories(defaultCategory)
            console.log(newHouse)
            return setHouse(newHouse)
        }
    
    }

    const addNewCategory = () =>{
        if(catValue.name){
            setEdit(false)
            const newCategory = {...categories}
            newCategory[catValue.name] = ''
                
            setCategories(newCategory)
            setCatValue({name: ''})
        }
      
    }

    // const Category = ({categories})=> {

    //     return (
    //          categories.map((category)=> {
    //              return(
    //             <div className='form-control' key={category + 1}>
    //                 <label htmlFor={category}>{category} :  </label>
    //                 <input type='number' min='0' max='5' id={category} name={category} value={category.value} onChange={handleRangeChange} />
    //             </div>
    //             )
    //         } )
    //     )
    // }
    

    if(edit){

        return <>
            <article>
                <form className="form" onSubmit={handleSubmit}>
                    <div className='form-control'>
                        <label htmlFor="address">Address : </label>
                        <input type="text" id='address' name='address' value={house.address} onChange={handleChange} />
                    </div>
                    <h4>Categories</h4>
                    
                    {
                        Object.keys(categories).map((category) => {
                            return <div className='form-control' key={category + 1}>
                        <label htmlFor={category}>{category} :  </label>
                        <input type='number' min='0' max='5' id={category} name={category} value={categories[category]} onChange={handleRangeChange} />
                    </div>
                        })
                    }
                    
                    <h4>Enter new category name</h4>
                    <div className='form-control'>
                        <label htmlFor='categoryName'>category name :  </label>
                        <input type='text' id='categoryName' name='categoryName' value={catValue.name} onChange={(e)=> {
                           const val = e.target.value
                           setCatValue({name: val}) 
                        }}/>
                        </div>
                        <button className='btn' onClick={addNewCategory}>submit</button>
                    
                </form>
                 {
                    locations.map((location) => {
                    return <div className='item' key={location.id}>
                        <h4>{location.address}</h4>
                        <div>
                            <label htmlFor="score">Total Score :  {location.score} </label>
                        </div>
                    </div>
                })
            }
            </article>
           
        </>

    }

    return (
        <>
            <article>
                <form className="form" onSubmit={handleSubmit}>
                    <div className='form-control'>
                        <label htmlFor="address">Address : </label>
                        <input type="text" id='address' name='address' value={house.address} onChange={handleChange} />
                    </div>
                    <h4>Categories</h4>
                    
                    {
                        Object.keys(categories).map((category) => {
                            return <div className='form-control' key={category + 1}>
                        <label htmlFor={category}>{category} :  </label>
                        <input type='number' min='0' max='5' id={category} name={category} value={categories[category]} onChange={handleRangeChange} />
                    </div>
                        }) 
                    }
                    <button className='button' onClick={handleSubmit}>compute</button>
                    <button className="btn" onClick={ ()=> setEdit(true)}> add new category</button>
                </form>
                 {
                    locations.map((location) => {
                    return <div className='item' key={location.id}>
                        <h4>{location.address}</h4>
                        <div>
                            <label htmlFor="score">Total Score : {location.score} </label>
                        </div>
                    </div>
                })
            }
            </article>
           
        </>
    )
}


export default Index; 
