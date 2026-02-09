import React from 'react'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import { Outlet } from 'react-router-dom'

function Applayout() {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Applayout
