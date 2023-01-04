import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

const defaultLocation = { lat: 45.516, lng: -73.56 }

export default function MapScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()
  const [googleApiKey, setGoogleApiKey] = useState('')
  const [center, setCenter] = useState(defaultLocation)
  const [location, setLocation] = useState(center)

  const mapRef = useRef(null)
  const placeRef = useRef(null)
  const markerRef = useRef(null)

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation os not supported by this browser')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios('/api/keys/google', {
        headers: { Authorization: `BEARER ${userInfo!.token}` },
      })
      setGoogleApiKey(data.key)
      getUserCurrentLocation()
    }

    fetch()
    ctxDispatch({
      type: 'SET_FULLBOX_ON',
    })
  }, [ctxDispatch])

  const onLoad = (map: any) => {
    mapRef.current = map
  }
  const onIdle = () => {
    setLocation({
      // lat: mapRef.current!.center.lat(),
      // lng: mapRef.current!.center.lng(),
      lat: defaultLocation.lat,
      lng: defaultLocation.lng,
    })
  }

  const onMarkerLoad = (marker: any) => {
    markerRef.current = marker
  }

  const onConfirm = () => {
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
      payload: {
        lat: location.lat,
        lng: location.lng,
      },
    })
    toast.success('location selected successfully.')
    navigate('/shipping')
  }
  return (
    <div className="full-box">
      <LoadScript googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="smaple-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <div className="map-input-box">
            <Button type="button" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
          <Marker position={location} onLoad={onMarkerLoad}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  )
}
