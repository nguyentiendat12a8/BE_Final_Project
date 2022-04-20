const db = require('../../models/index')
const BillHotelRoom = db.billHotelRoom
const BillTour = db.billTour
const HotelRoom = db.hotelRoom
const Tour = db.tour
const TourCustom = db.tourCustom

exports.dashboard = async (req, res) => {
    const date = new Date(req.query.date)
    await Promise.all([Tour.find({ moderatorID: req.accountID }), HotelRoom.find({ moderatorID: req.accountID }), TourCustom.find({ moderatorID: req.accountID })])
        .then(async ([tour, room, tourCustom]) => {
            var totalPriceTour = 0
            var totalPriceTourCustom = 0
            var totalPriceRoom = 0
            async function getBillTour(i) {
                var tour = await BillTour.find({ tourID: i._id })
                tour.forEach(e => {
                    var dateBill = new Date(e.bookedDate)
                    if (date.getMonth() === dateBill.getMonth() && date.getFullYear() === dateBill.getFullYear()) {
                        totalPriceTour += e.price
                    }
                })
                return totalPriceTour
            }
            async function getBillTourCustom(j) {
                var tourCustom = await BillTour.find({ tourCustomID: j._id })
                tourCustom.forEach(e => {
                    var dateBill = new Date(e.bookedDate)
                    if (date.getMonth() === dateBill.getMonth() && date.getFullYear() === dateBill.getFullYear()) {
                        totalPriceTourCustom += e.price
                    }
                })
                return totalPriceTourCustom
            }
            async function getBillRoom(k) {
                var room = await BillHotelRoom.find({ hotelRoomID: k._id })
                room.forEach(e => {
                    var dateBill = new Date(e.createdAt)
                    if (date.getMonth() === dateBill.getMonth() && date.getFullYear() === dateBill.getFullYear()) {
                        totalPriceRoom += e.price
                    }
                })
                return totalPriceRoom
            }
            await Promise.all(tour.map(i => getBillTour(i)))
            await Promise.all(tourCustom.map(j => getBillTourCustom(j)))
            await Promise.all(room.map(k => getBillRoom(k)))
            return res.status(200).send({
                errorCode: 0,
                totalPriceTour,
                totalPriceTourCustom,
                totalPriceRoom,
                numberOfTour: tour.length,
                numberOfHotelRoom: room.length,
                numberOfTourCustom: tourCustom.length
            })
        })
        .catch(error => {
            return res.status(500).send({
                errorCode: 500,
                message: 'Dashboard function is error!'
            })
        })
}