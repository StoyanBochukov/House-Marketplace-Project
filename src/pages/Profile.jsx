import React, {useEffect, useState} from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { async } from '@firebase/util'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

const Profile = () => {
  const auth = getAuth()

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    fname: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {fname, email} = formData

  const navigate = useNavigate()

  useEffect(() =>{
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc'))

      const querySnap = await getDocs(q)
      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== fname){
        //Update display anem in firebase
        await updateProfile(auth.currentUser, {
          displayName: fname
        })
        //Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          fname: fname
        })
        toast.success('Profile details updated successfuly')
      }
    } catch (error) {
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) =>{
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (listingId) =>{
    if(window.confirm('Are you sure you want to DELETE?')){
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Listing has beed successfully deleted')
    }
  }

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }
  
  return (
    <div className='profile'>
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type='button' onClick={onLogout}>Logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Perosnal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className="profileCard">
          <form >
            <input type="text" id="fname" className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails} value={fname} onChange={onChange} />
            

            <input type="email" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changeDetails} value={email} onChange={onChange} />
            
          </form>
        </div>
        <Link to='/create-listing' className='createListing' >
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrwo-right" />
        </Link>

        {!loading && listings?.length > 0 &&(
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}
                 onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile