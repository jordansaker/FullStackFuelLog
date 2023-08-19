import { Router } from 'express'
import VehicleModel from '../models/Vehicle.js'
import fileUpload from 'express-fileupload'
import { postToS3 } from '../middleware/post_to_s3.js'
import { deleteObjectS3ForUpdate } from '../middleware/delete_object_s3.js'

const router = Router()
router.use(fileUpload())

router.get('/', async (req, res) => {
  res.send(await VehicleModel.find())
})

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await VehicleModel.findById(req.params.id).exec()
    vehicle ? res.send(vehicle) : res.status(404).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/', postToS3, async (req, res) => {
  try {
     // save this in database with vehicle data to use to retrive img .png from S3 bucket
     const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.body.asset_id}`
     // create new document
     const newVehicle = {
      ...req.body,
      vehicleImage_URL: url
     }
     // add the document
     const vehicleAdded = await VehicleModel.create(newVehicle)
     res.status(201).send(vehicleAdded)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.delete('/:id', deleteObjectS3ForUpdate, async (req, res) => {
  try {
    const vehicle = await VehicleModel.findByIdAndDelete(req.params.id)
    vehicle ? res.sendStatus(200) : res.status(400).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.put('/:id', deleteObjectS3ForUpdate, postToS3, async (req, res) => {
  try {
    let url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.body.asset_id}`
    let vehicleUpdated = {
      ...req.body,
      vehicleImage_URL: url
     }
    const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, vehicleUpdated, { new: true })
    vehicle ? res.send(vehicle) : res.status(404).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router