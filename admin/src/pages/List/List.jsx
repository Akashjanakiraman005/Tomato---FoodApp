import React from 'react';
import './List.css';
import { food_list } from '../../assets/food_list.js';


// Remove food functionality is disabled in local mode
const removeFood = (foodId) => {
  alert('Remove is disabled in local mode.');
};
const List = () => {
  return (
    <div className='list-add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {food_list.map((item, index) => (
          <div key={index} className="list-table-format ">
            <img
              src={`/food_images/${item.image}`}
              alt={item.name}
              onError={(e) => {
                console.error('Failed to load image:', item.image);
                e.target.src = 'https://via.placeholder.com/50';
              }}
            />
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
          </div>
        ))}
      </div>
    </div>

  );
}

export default List
