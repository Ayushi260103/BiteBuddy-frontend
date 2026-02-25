import React, { useEffect, useState } from 'react'
import Nav from './Nav';
import CategoryCard from './CategoryCard';
import { categories } from '../category.js';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard.jsx';
import { useNavigate } from 'react-router-dom';



function UserDashboard() {
  const navigate = useNavigate();
  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems } = useSelector((state) => state.user);
  const cateScrollRef = React.useRef();
  const shopScrollRef = React.useRef();

  const [showLeftCateButton, setShowLeftCateButton] = React.useState(false);
  const [showRightCateButton, setShowRightCateButton] = React.useState(false);


  const [showLeftShopButton, setShowLeftShopButton] = React.useState(false);
  const [showRightShopButton, setShowRightShopButton] = React.useState(false);

  const [filteredItemsList, setFilteredItemsList] = useState(itemsInMyCity);

  const handleFilterByCategory = (category) => {
    if (category == "All") setFilteredItemsList(itemsInMyCity);
    else {
      const list = itemsInMyCity.filter(i => i.category === category);
      setFilteredItemsList(list);
    }
  }

  const updateButtonVisibility = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0); // Show left button if scrolled more than 0
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth); // Show right button if not scrolled to the end
    }
  }

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButtonVisibility(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);  // Initial check to set button visibility

      cateScrollRef.current.addEventListener('scroll', () => {
        updateButtonVisibility(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      }
      )

    }
    if (shopScrollRef.current) {
      updateButtonVisibility(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);  // Initial check to set button visibility


      shopScrollRef.current.addEventListener('scroll', () => {
        updateButtonVisibility(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
      }
      )
    }
    return () => {
      cateScrollRef?.current?.removeEventListener('scroll', () => {
        updateButtonVisibility(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      });
      shopScrollRef?.current?.removeEventListener('scroll', () => {
        updateButtonVisibility(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
      });
    };

  }, [categories]);

  useEffect(() => {
    setFilteredItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      })
    }
  }


  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 p-6 bg-white rounded-3xl shadow-lg mt-6">
      <Nav />

      {/* Searched Items */}
      {searchItems && searchItems.length > 0 &&
        <div className='w-full max-w-6xl flex flex-col gap-5 items-center p-5 bg-white shadow-md rounded-2xl mt-4'>
          <h1 className="text-lg font-semibold flex items-center gap-2 ">
            🔍 Search Results
          </h1>
          <p className="text-xs text-gray-500">
            Items matching your search
          </p>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))

            }
          </div>
        </div>
      }

      {/* category section */}
      <div className='w-full max-w-6xl flex flex-col gap-4 px-4 mt-4 bg-white rounded-3xl shadow-sm'>
        <h1 className='text-xl sm:text-2xl font-semibold text-gray-900'>Inspiration for your first order</h1>
        <div className='w-full relative'>
          {showLeftCateButton &&
            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(cateScrollRef, 'left')}>
              <FaChevronCircleLeft />
            </button>
          }
          <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
            {categories.map((cat, idx) => {
              return <CategoryCard key={idx} name={cat.category} image={cat.image}
                onClick={() => handleFilterByCategory(cat.category)} />
            })}
          </div>
          {showRightCateButton &&
            <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(cateScrollRef, 'right')}>
              <FaChevronCircleRight />
            </button>
          }
        </div>
      </div>


      {/* Shop section */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] mt-10 bg-white rounded-3xl shadow-sm' >
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Best restraunts in {currentCity}</h1>
        <div className='w-full relative'>
          {showLeftShopButton &&
            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(shopScrollRef, 'left')}>
              <FaChevronCircleLeft />
            </button>
          }
          <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={shopScrollRef}>
            {shopsInMyCity?.map((shop, idx) => {
              return <CategoryCard key={idx} name={shop.name} image={shop.image}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            })}
          </div>
          {showRightShopButton &&
            <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(shopScrollRef, 'right')}>
              <FaChevronCircleRight />
            </button>
          }
        </div>
      </div>

      {/*Suggested Food Items*/}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] mt-10 bg-white rounded-3xl shadow-sm'>
        <h1 className='text-2xl sm:text-3xl text-gray-800'>Suggested Food Items</h1>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center'>
          {filteredItemsList?.map((item, idx) => {
            return <FoodCard key={idx} data={item} />
          })}
        </div>
      </div>
    </div>
  );

}


export default UserDashboard