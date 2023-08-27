import React, { useEffect, useContext, useRef } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import FetchHeader from './FetchHeader.jsx'
import ModalText from '../ModalText.jsx'

const VehiclesListFetch = () => {
  const { allVehicles, getAllVehicles, modalTextOperation } = useContext(FuelLogContext)
  const { deleteVehicle, editVehicle } = useContext(EmployerContext)
  const assetID = useRef('')

  const handleEditClick = event => {
    event.preventDefault()
    editVehicle(event.target.value)
  }

  const handleDeleteIconClick = event => {
    event.preventDefault()
    assetID.current = event.target.attributes.value.value
    // turn modal on
    modalTextOperation(true)
  }

  const handleCompanyButtonClick = event => {
    event.preventDefault()
    deleteVehicle(event.target.value)
  }

  useEffect(() => {
    (async () => setTimeout(() => {
      // timeout to wait for icons to load
      getAllVehicles()
    }, 500))()
  }, [])

  return allVehicles && <>
    <FetchHeader buttonText={'Add Vehicle'} />
    <div id='allVehicles'>
      <table>
        <tbody>
          {allVehicles.map(vehicle => (
            <tr key={vehicle.asset_id}>
              <td><CompanyButton value={vehicle.asset_id} onClick={handleEditClick}>Edit</CompanyButton></td>
              <td value={vehicle.asset_id} onClick={handleDeleteIconClick}><span value={vehicle.asset_id} className='fa fa-trash-alt'></span></td>
              <td>Asset ID:</td>
              <td>{vehicle.asset_id}</td>
              <td>Registration No:</td>
              <td>{vehicle.registration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ModalText text={'Are you sure you want to delete this Vehicle?'}>
      <CompanyButton onClick={handleCompanyButtonClick} value={assetID.current}>Confirm</CompanyButton>
    </ModalText>
  </>
}

export default VehiclesListFetch