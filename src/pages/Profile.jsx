import React, {useEffect, useState} from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { async } from '@firebase/util'
import { toast } from 'react-toastify'

const Profile = () => {
  const auth = getAuth()

  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    fname: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {fname, email} = formData

  const navigate = useNavigate()

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
      </main>
    </div>
  )
}

export default Profile