import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import Spinner from './Spinner'
import { async } from '@firebase/util'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])


const Slider = () => {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() =>{

        const fetchListings = async () => {

            const listingsRef = collection(db, 'listings') 
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            // console.log(listings)
            setListings(listings)
            setLoading(false)

        }
       
    fetchListings()
    }, [])

    if(loading){
        return <Spinner />
    }

  return  listings && (
    <>
        <p className="exploreHeading">Recommended</p>
        <Swiper slidesPerView={1} pagination={{clickable: true}}>
            {listings.map(({data, id}) => (
                <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)} className='swiperSlideExplore'>
                    <div className="swiperSlideExplore">
                        <div className="swiperSlideDiv" style={{background: `url(${data.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover'}}>
                           <p className="swiperSlideText">{data.name}</p>
                           <p className="swiperSlidePrice">£{data.discountedPrice ?? data.regularPrice}
                            {' '}{data.type === 'rent' && '/ month'}
                           </p> 
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </>
  )
}

export default Slider