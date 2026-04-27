import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const Add = ({url}) => {
    const [image,setImage] = useState(false);
    const [data,setdata] = useState({
        name:"",
        description:"",
        category:"salad",
        price:""
    });
     
    const onChangeHandler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setdata({
            ...data,
            [name]:value
        })
    }

   const onSubmitHandler = async(event)=>{
    event.preventDefault();
    
    // Validate image is selected
    if(!image){
        toast.error("Please select an image");
        return;
    }

    const formData = new FormData();
    formData.append('image',image);
    formData.append('name',data.name);
    formData.append('description',data.description);
    formData.append('category',data.category);
    formData.append('price',Number(data.price));
    
    try {
        const response = await axios.post(`${url}/api/food/add`, formData);

        if(response.status===201){
            setdata({
                name:"",
                description:"",
                category:"salad",
                price:""
            })
            setImage(false);
            toast.success(response.data.message);
        }
    } catch(error) {
        if(error.response && error.response.data && error.response.data.message){
            toast.error(error.response.data.message);
        } else if(error.message){
            toast.error(error.message);
        } else {
            toast.error("Error in adding product");
        }
    }
   }

  return (
    <div className='add' >
        <form className="flex-col" onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor='image'>
                    <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />

                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
            </div>
            <div className='add-product-name flex-col'>
                <p>Product name</p>
                <input onChange={onChangeHandler} value={data.name} name='name' type="text" placeholder='Type here' required />
            </div>
            <div className='add-product-description flex-col'>
                <p>Product description</p>
                <textarea onChange={onChangeHandler} value={data.description} name='description' rows='6' placeholder='Write content here' required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
              <p>Product category</p>
              <select onChange={onChangeHandler} value={data.category} name= "category">
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
               
                <option value="Pure veg">Pure veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
              </select>
                </div>
                <div className="add-price flex-col">
                <p>Product price</p>
                <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='₹20'  />
            </div >
            </div>
            <button type='submit' className='add-btn'>Add</button>
            </form>
      
    </div>
  )
}

export default Add;  
