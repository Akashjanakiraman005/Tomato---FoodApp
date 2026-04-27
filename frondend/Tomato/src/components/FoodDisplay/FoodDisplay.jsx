import React from 'react'
import '../FoodDisplay/FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem.jsx';

const FoodDisplay = ({ category }) => {
    const {food_list, searchTerm} = React.useContext(StoreContext);
    const filteredList = food_list.filter(item => {
      const matchesCategory = category === "All" || category === item.category;
      const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    return (
      <div className='food-disply' id='food-display'>
          <h2>Top dishes near you</h2>
          <div className="food-display-list">
              {filteredList.map((item,index)=>
                <FoodItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} description={item.description} />
              )}
          </div>
      </div>
    )
}

export default FoodDisplay
